import { EditorToken, ExprNode, WireOperator } from '../models';
import { LIST_OPS } from '../constants';
import { CatalogIndex } from './catalog-index';

/**
 * Shared expression lexer for both v2 grammars: it recognizes one LHS / list
 * item / argument — a column, a `name(args…)` call (functions may nest), or (as
 * an argument) a string / `*` / number literal — with source-spanned tokens.
 *
 * Extracted from the prototype's `lexExpr` / `lexArg` / `lexValue` so the boolean
 * analyzer (WHERE / HAVING), the list analyzer (SELECT / GROUP BY / ORDER BY),
 * and the autocomplete-context layer share a single implementation — the "one
 * code path" the v2 design depends on.
 */
export interface ExprLex {
  end: number;
  node: ExprNode;
  tokens: EditorToken[];
}

/** Result of {@link lexValue}: consumed span, raw (unparsed) text, and its tokens. */
export interface ValueLex {
  end: number;
  raw: string;
  tokens: EditorToken[];
}

/** Lex one column or `name(args…)` function call starting at `i`, or null if none. */
export function lexExpr(catalog: CatalogIndex, s: string, i: number): ExprLex | null {
  const m = /^[A-Za-z_@][A-Za-z0-9_.]*/.exec(s.slice(i));
  if (!m) return null;
  const name = m[0];
  const nameEnd = i + name.length;
  let k = nameEnd;
  while (s[k] === ' ') k++;

  if (s[k] === '(') {
    const fn = catalog.fnByName(name) ?? null;
    const toks: EditorToken[] = [{ start: i, end: nameEnd, role: 'func', text: name }];
    if (k > nameEnd) toks.push({ start: nameEnd, end: k, role: 'ws', text: s.slice(nameEnd, k) });
    toks.push({ start: k, end: k + 1, role: 'paren', text: '(' });
    let p = k + 1;
    const args: ExprNode[] = [];
    while (p < s.length) {
      while (s[p] === ' ') {
        toks.push({ start: p, end: p + 1, role: 'ws', text: ' ' });
        p++;
      }
      if (s[p] === ')') {
        toks.push({ start: p, end: p + 1, role: 'paren', text: ')' });
        p++;
        break;
      }
      const arg = lexArg(catalog, s, p);
      if (!arg) {
        toks.push({ start: p, end: p + 1, role: 'bad', text: s[p] || '' });
        p++;
      } else {
        args.push(arg.node);
        arg.tokens.forEach((t) => toks.push(t));
        p = arg.end;
      }
      while (s[p] === ' ') {
        toks.push({ start: p, end: p + 1, role: 'ws', text: ' ' });
        p++;
      }
      if (s[p] === ',') {
        toks.push({ start: p, end: p + 1, role: 'comma', text: ',' });
        p++;
        continue;
      }
      if (s[p] === ')') {
        toks.push({ start: p, end: p + 1, role: 'paren', text: ')' });
        p++;
        break;
      }
      if (p >= s.length) break;
      if (s[p] !== ',') {
        toks.push({ start: p, end: p + 1, role: 'bad', text: s[p] });
        p++;
      }
    }
    return { end: p, node: { t: 'fn', fn, name, args }, tokens: toks };
  }

  const known = !!catalog.fieldByName(name);
  return {
    end: nameEnd,
    node: { t: 'col', name, known },
    tokens: [{ start: i, end: nameEnd, role: 'field', text: name, known }],
  };
}

/** Lex one function argument: string / `*` / number literal, else a nested expression. */
export function lexArg(catalog: CatalogIndex, s: string, i: number): ExprLex | null {
  const c = s[i];
  if (c === "'" || c === '"') {
    let j = i + 1;
    let v = '';
    while (j < s.length && s[j] !== c) {
      if (s[j] === '\\') j++;
      v += s[j];
      j++;
    }
    j++;
    return {
      end: j,
      node: { t: 'lit', value: v, litType: 'string' },
      tokens: [{ start: i, end: j, role: 'str', text: s.slice(i, j) }],
    };
  }
  if (c === '*') {
    return {
      end: i + 1,
      node: { t: 'lit', value: '*', litType: 'star' },
      tokens: [{ start: i, end: i + 1, role: 'bare', text: '*' }],
    };
  }
  if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(s[i + 1] || ''))) {
    const m = /^-?[0-9.]+/.exec(s.slice(i))!;
    return {
      end: i + m[0].length,
      node: { t: 'lit', value: Number(m[0]), litType: 'number' },
      tokens: [{ start: i, end: i + m[0].length, role: 'num', text: m[0] }],
    };
  }
  return lexExpr(catalog, s, i);
}

/**
 * Lex the value substring after an operator. List operators consume a bracketed
 * or comma-separated run (stopping at a bare `)` or a following `AND`/`OR`);
 * other operators take one quoted string or a non-space run. Tolerant of a
 * missing closing quote at end-of-input. The catalog is not needed here.
 */
export function lexValue(s: string, i: number, canon: WireOperator | null): ValueLex {
  let j = i;
  if (canon && LIST_OPS.has(canon)) {
    let depth = 0;
    while (j < s.length) {
      const c = s[j];
      if (c === '[') {
        depth++;
        j++;
        continue;
      }
      if (c === ']') {
        depth--;
        j++;
        continue;
      }
      if (c === "'" || c === '"') {
        const q = c;
        j++;
        while (j < s.length && s[j] !== q) {
          if (s[j] === '\\') j++;
          j++;
        }
        j++;
        continue;
      }
      if (depth <= 0) {
        if (c === ')') break;
        if (/^\s+(and|or)\b/i.test(s.slice(j))) break;
      }
      j++;
    }
    const raw = s.slice(i, j);
    return { end: j, raw, tokens: raw.trim() ? [{ start: i, end: j, role: 'val', text: raw }] : [] };
  }

  const c = s[i];
  if (c === "'" || c === '"') {
    let m = i + 1;
    while (m < s.length && s[m] !== c) {
      if (s[m] === '\\') m++;
      m++;
    }
    m++;
    return { end: m, raw: s.slice(i, m), tokens: [{ start: i, end: m, role: 'str', text: s.slice(i, m) }] };
  }
  const mm = /^[^\s()]+/.exec(s.slice(i));
  if (!mm) return { end: i, raw: '', tokens: [] };
  const role = /^-?[0-9.]+$/.test(mm[0]) ? 'num' : 'bare';
  return { end: i + mm[0].length, raw: mm[0], tokens: [{ start: i, end: i + mm[0].length, role, text: mm[0] }] };
}
