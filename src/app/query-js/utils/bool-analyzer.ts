import { BoolAnalysis, BoolItem, BoolMode, BoolTree, Comparison, EditorToken } from '../models';
import { CIDR_OPS, CIDR_RE, NO_VALUE_OPS, OP_DISPLAY, matchOperator } from '../constants';
import { CatalogIndex } from './catalog-index';
import { lexExpr, lexValue } from './expr-lexer';
import { containerTypeOfNode, typeOfNode } from './expr-type';
import { coerceValue, containerValue } from './value-coerce';

/**
 * Boolean-grammar analyzer for the v2 WHERE / HAVING freeform editor.
 *
 * A single left-to-right scan turns the raw text into (a) source-spanned tokens
 * for highlighting + chip grouping, (b) validated comparison leaves, and (c) a
 * precedence tree. It never throws and always makes forward progress, so it can
 * run on every keystroke over partial input. Ported from the prototype's
 * `analyzeBoolean` / `lexExpr` / `lexArg` / `lexValue` / `finalizeComp` /
 * `parseItems`, with the mutable `Catalog` global replaced by an injected
 * immutable {@link CatalogIndex}.
 *
 * WHERE and HAVING share this analyzer; they differ only in `finalizeComp`'s LHS
 * rule (see {@link BoolMode}) and in which serializer (`toWhere` / `toHaving`)
 * consumes the resulting tree.
 */
export class BoolAnalyzer {
  constructor(private readonly catalog: CatalogIndex) {}

  /** Analyze `source` under the given profile into tokens + comparisons + tree. */
  analyze(source: string, mode: BoolMode): BoolAnalysis {
    const s = source;
    const tokens: EditorToken[] = [];
    const items: BoolItem[] = [];
    const compById: Record<number, Comparison> = {};
    const N = s.length;
    let i = 0;
    let expect: 'LHS' | 'OP' | 'VALUE' | 'JOIN' = 'LHS';
    let cur: Comparison | null = null;
    let cid = 0;

    const pushWs = () => {
      tokens.push({ start: i, end: i + 1, role: 'ws', text: s[i], compId: cur ? cur.cid : undefined });
      i++;
    };
    const flush = () => {
      if (!cur) return;
      this.finalizeComp(cur, mode);
      compById[cur.cid] = cur;
      items.push({ k: 'leaf', comp: cur });
      cur = null;
    };

    while (i < N) {
      if (s[i] === ' ') {
        pushWs();
        continue;
      }
      const rest = s.slice(i);

      if (expect === 'LHS') {
        let m: RegExpExecArray | null;
        if ((m = /^not\b/i.exec(rest))) {
          tokens.push({ start: i, end: i + m[0].length, role: 'kw', text: m[0] });
          items.push({ k: 'not' });
          i += m[0].length;
          continue;
        }
        if (s[i] === '(') {
          tokens.push({ start: i, end: i + 1, role: 'paren', text: '(' });
          items.push({ k: '(' });
          i++;
          continue;
        }
        if (s[i] === ')') {
          tokens.push({ start: i, end: i + 1, role: 'paren', text: ')' });
          items.push({ k: ')' });
          i++;
          continue;
        }
        if ((m = /^(and|or)\b/i.exec(rest))) {
          // A logical keyword with no left operand — invalid here.
          tokens.push({ start: i, end: i + m[0].length, role: 'bad', text: m[0] });
          i += m[0].length;
          continue;
        }
        const ex = lexExpr(this.catalog, s, i);
        if (!ex) {
          tokens.push({ start: i, end: i + 1, role: 'bad', text: s[i] });
          i++;
          continue;
        }
        cur = { cid: ++cid, lhs: ex.node, op: null, opCanon: null, raw: '', start: i };
        const owner = cur;
        ex.tokens.forEach((t) => {
          t.compId = owner.cid;
          tokens.push(t);
        });
        i = ex.end;
        expect = 'OP';
        continue;
      }

      if (expect === 'OP') {
        const op = matchOperator(rest);
        if (!op) {
          // No operator yet — leaf stays incomplete, look for a connector.
          flush();
          expect = 'JOIN';
          continue;
        }
        const owner = cur!;
        tokens.push({ start: i, end: i + op.text.length, role: 'op', text: op.text, compId: owner.cid });
        owner.op = op.text;
        owner.opCanon = op.canon;
        i += op.text.length;
        if (NO_VALUE_OPS.has(op.canon)) {
          flush();
          expect = 'JOIN';
        } else {
          expect = 'VALUE';
        }
        continue;
      }

      if (expect === 'VALUE') {
        const owner = cur!;
        const v = lexValue(s, i, owner.opCanon);
        v.tokens.forEach((t) => {
          t.compId = owner.cid;
          tokens.push(t);
        });
        owner.raw = v.raw;
        i = v.end;
        flush();
        expect = 'JOIN';
        continue;
      }

      // expect === 'JOIN'
      let m: RegExpExecArray | null;
      if ((m = /^(and|or)\b/i.exec(rest))) {
        tokens.push({ start: i, end: i + m[0].length, role: 'kw', text: m[0] });
        items.push({ k: m[0].toLowerCase() as 'and' | 'or' });
        i += m[0].length;
        expect = 'LHS';
        continue;
      }
      if (s[i] === ')') {
        tokens.push({ start: i, end: i + 1, role: 'paren', text: ')' });
        items.push({ k: ')' });
        i++;
        continue;
      }
      // Only AND/OR (or a close paren) are valid in a connector slot.
      const bm = /^\S+/.exec(rest);
      const bt = bm ? bm[0] : s[i];
      tokens.push({ start: i, end: i + bt.length, role: 'bad', text: bt });
      i += bt.length;
    }

    flush();
    const tree = parseItems(items);
    return { tokens, compById, tree };
  }

  // --- validation -----------------------------------------------------------

  /** Validate a comparison in place, setting `valid` / `reason` / `lhsType` / `value`. */
  private finalizeComp(comp: Comparison, mode: BoolMode): void {
    comp.valid = false;
    comp.reason = '';
    const lhs = comp.lhs;

    if (lhs.t === 'col' && !lhs.known) {
      comp.reason = `unknown field '${lhs.name}'`;
      return;
    }
    if (lhs.t === 'fn' && !lhs.fn) {
      comp.reason = 'unknown function';
      return;
    }
    if (mode === 'where' && lhs.t === 'fn' && lhs.fn && lhs.fn.kind === 'aggregate') {
      comp.reason = 'aggregate not allowed in WHERE — use Having';
      return;
    }
    if (mode === 'having' && !(lhs.t === 'fn' && lhs.fn && lhs.fn.kind === 'aggregate')) {
      comp.reason = 'Having needs an aggregate (e.g. count(*))';
      return;
    }

    const container = containerTypeOfNode(this.catalog, lhs);
    const lhsType = container ? container.type : typeOfNode(this.catalog, lhs);
    comp.lhsType = lhsType;

    if (!comp.opCanon) {
      comp.reason = 'missing operator';
      return;
    }
    if (!this.catalog.isOperatorValid(lhsType, comp.opCanon)) {
      comp.reason = `'${OP_DISPLAY[comp.opCanon] ?? comp.opCanon}' not valid for ${lhsType}`;
      return;
    }
    if (NO_VALUE_OPS.has(comp.opCanon)) {
      comp.value = null;
      comp.valid = true;
      return;
    }
    if ((comp.raw || '').trim() === '') {
      comp.reason = 'missing value';
      return;
    }

    if (container) {
      const cv = containerValue(container, comp.opCanon, comp.raw);
      if (!cv.ok) {
        comp.reason = cv.reason;
        return;
      }
      comp.value = cv.value;
      comp.valid = true;
      return;
    }

    const val = coerceValue(comp.opCanon, lhsType, comp.raw);
    if (lhsType === 'number' && typeof val === 'number' && isNaN(val)) {
      comp.reason = 'expected a number';
      return;
    }
    if (CIDR_OPS.has(comp.opCanon) && !CIDR_RE.test(String(val))) {
      comp.reason = 'invalid CIDR (e.g. 10.0.0.0/8)';
      return;
    }
    comp.value = val;
    comp.valid = true;
  }
}

/**
 * Build the precedence tree from the flat item stream: OR < AND < NOT < primary,
 * with same-operator operands flattened into a single n-ary node (matching
 * query-builder's `LogicalExpression.expressions[]`). Explicit `( )` become
 * group nodes. Tolerant: a missing close paren or stray item degrades gracefully.
 */
export function parseItems(items: BoolItem[]): BoolTree {
  let p = 0;

  const flat = (op: 'and' | 'or', n: BoolTree): BoolTree[] =>
    (n.t === 'and' || n.t === 'or') && n.t === op && !n.not ? n.kids : [n];

  function parseOr(): BoolTree {
    let n = parseAnd();
    while (items[p] && items[p].k === 'or') {
      p++;
      const r = parseAnd();
      n = { t: 'or', not: false, kids: flat('or', n).concat(flat('or', r)) };
    }
    return n;
  }
  function parseAnd(): BoolTree {
    let n = parseNot();
    while (items[p] && items[p].k === 'and') {
      p++;
      const r = parseNot();
      n = { t: 'and', not: false, kids: flat('and', n).concat(flat('and', r)) };
    }
    return n;
  }
  function parseNot(): BoolTree {
    if (items[p] && items[p].k === 'not') {
      p++;
      return { t: 'not', kid: parseFactor() };
    }
    return parseFactor();
  }
  function parseFactor(): BoolTree {
    const it = items[p];
    if (it && it.k === '(') {
      p++;
      const n = parseOr();
      if (items[p] && items[p].k === ')') p++;
      return { t: 'group', kid: n };
    }
    if (it && it.k === 'leaf') {
      p++;
      return { t: 'leaf', comp: it.comp };
    }
    p++;
    return { t: 'empty' };
  }

  if (!items.length) return { t: 'empty' };
  return parseOr();
}
