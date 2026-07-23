import {
  BoolCaretContext,
  EditorProfile,
  FilterDefinition,
  FnArgContext,
  FunctionDefinition,
  Suggestion,
  SuggestionGroup,
  SuggestionResult,
} from '../models';
import { NO_VALUE_OPS, OP_DISPLAY, matchOperator } from '../constants';
import { CatalogIndex } from './catalog-index';
import { acceptedGenerics, toGeneric } from './type-bridge';
import { lexExpr, lexValue } from './expr-lexer';
import { containerTypeOfNode, typeOfNode } from './expr-type';

/**
 * Pure, caret-driven autocomplete-context layer for the v2 editor.
 *
 * From the text + caret + profile it derives *what* to suggest, as plain data
 * ({@link SuggestionResult}) — no DOM, no rendering. The editor component maps
 * these descriptors to Material list items and handles insertion. Ported from
 * the prototype's `suggestFor` / `boolContext` / `caretFnContext` /
 * `boolSuggestions` / `argSuggestions` and the `fnGroup` / `colGroup` builders,
 * with the mutable `Catalog` global replaced by an injected {@link CatalogIndex}.
 */

/** Top-level entry: suggestions for `caret` in `text` under `profile`. */
export function suggestFor(
  catalog: CatalogIndex,
  text: string,
  caret: number,
  profile: EditorProfile,
): SuggestionResult {
  const prefix = text.slice(0, caret);
  const frag0 = fragAt(prefix, /[A-Za-z0-9_.@]*$/);

  // Inside a function's argument list → argument candidates (any profile).
  const fnCtx = caretFnContext(catalog, text, caret);
  if (fnCtx) return argSuggestions(catalog, fnCtx.fnName, fnCtx.argIndex, frag0);

  if (profile === 'where' || profile === 'having') {
    return boolSuggestions(catalog, boolContext(catalog, prefix), profile);
  }

  if (profile === 'orderby') {
    // Typing a direction right after a column (space-separated, no `:`)?
    const seg = prefix.split(',').pop() ?? '';
    const dm = /[A-Za-z_@][A-Za-z0-9_.]*\s+([A-Za-z]*)$/.exec(seg);
    if (dm && !seg.includes(':')) {
      const f = dm[1]!.toLowerCase();
      const dirs = ['asc', 'desc'].filter((d) => d.startsWith(f));
      if (dirs.length) {
        return { frag: dm[1]!, groups: [{ label: 'direction', items: dirs.map(dirOpt) }] };
      }
    }
    return { frag: frag0, groups: [colGroup(catalog.fields, frag0)] };
  }

  // select / groupby head
  const cols = profile === 'groupby' ? catalog.filterableFields() : catalog.fields;
  const fns = profile === 'groupby' ? [] : catalog.functions;
  return { frag: frag0, groups: [fnGroup(catalog, fns, frag0), colGroup(cols, frag0)] };
}

// --- caret contexts ---------------------------------------------------------

/**
 * If the caret sits inside a (known) function call's argument list, return that
 * function name + zero-based argument index; otherwise null. Skips string
 * contents and tracks nesting, so the innermost known function wins.
 */
export function caretFnContext(catalog: CatalogIndex, text: string, caret: number): FnArgContext | null {
  const s = text.slice(0, caret);
  const stack: FnArgContext[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "'" || ch === '"') {
      const q = ch;
      i++;
      while (i < s.length && s[i] !== q) {
        if (s[i] === '\\') i++;
        i++;
      }
      i++;
      continue;
    }
    if (ch === '(') {
      let j = i - 1;
      while (j >= 0 && /\s/.test(s[j])) j--;
      const e = j;
      while (j >= 0 && /[A-Za-z0-9_]/.test(s[j])) j--;
      stack.push({ fnName: s.slice(j + 1, e + 1), argIndex: 0 });
      i++;
      continue;
    }
    if (ch === ')') {
      stack.pop();
      i++;
      continue;
    }
    if (ch === ',' && stack.length) {
      stack[stack.length - 1]!.argIndex++;
      i++;
      continue;
    }
    i++;
  }
  for (let k = stack.length - 1; k >= 0; k--) {
    if (stack[k]!.fnName && catalog.fnByName(stack[k]!.fnName)) return stack[k]!;
  }
  return null;
}

/**
 * The grammatical role expected at the end of `prefix` (ignoring function
 * internals — those are handled by {@link caretFnContext}). Runs the same
 * LHS→OP→VALUE→JOIN state machine as the analyzer but only to classify the tail.
 */
export function boolContext(catalog: CatalogIndex, prefix: string): BoolCaretContext {
  const s = prefix;
  const N = s.length;
  let i = 0;
  let expect: 'LHS' | 'OP' | 'VALUE' | 'JOIN' = 'LHS';
  let lhs: BoolCaretContext['lhs'] = null;

  while (i < N) {
    if (s[i] === ' ') {
      i++;
      continue;
    }
    const rest = s.slice(i);

    if (expect === 'LHS') {
      let m: RegExpExecArray | null;
      if ((m = /^not\b/i.exec(rest))) {
        i += m[0].length;
        continue;
      }
      if (s[i] === '(' || s[i] === ')') {
        i++;
        continue;
      }
      if ((m = /^(and|or)\b/i.exec(rest))) {
        i += m[0].length;
        continue;
      }
      const ex = lexExpr(catalog, s, i);
      if (!ex) {
        i++;
        continue;
      }
      lhs = ex.node;
      i = ex.end;
      expect = 'OP';
      continue;
    }
    if (expect === 'OP') {
      const op = matchOperator(rest);
      if (!op) break;
      i += op.text.length;
      if (NO_VALUE_OPS.has(op.canon)) {
        expect = 'JOIN';
        lhs = null;
      } else {
        expect = 'VALUE';
      }
      continue;
    }
    if (expect === 'VALUE') {
      const v = lexValue(s, i, 'equal');
      i = v.end;
      expect = 'JOIN';
      lhs = null;
      continue;
    }
    // expect === 'JOIN'
    let m: RegExpExecArray | null;
    if ((m = /^(and|or)\b/i.exec(rest))) {
      i += m[0].length;
      expect = 'LHS';
      lhs = null;
      continue;
    }
    if (s[i] === ')') {
      i++;
      continue;
    }
    break;
  }

  const container = lhs ? containerTypeOfNode(catalog, lhs) : null;
  const lhsType = container ? container.type : typeOfNode(catalog, lhs);
  if (expect === 'OP') return { role: 'op', lhsType, frag: fragAt(prefix, /[A-Za-z<>=!≤≥≠_]*$/), lhs };
  if (expect === 'VALUE') return { role: 'value', lhsType, frag: fragAt(prefix, /[^\s()]*$/), lhs };
  if (expect === 'JOIN') return { role: 'join', frag: '' };
  return { role: 'lhs', frag: fragAt(prefix, /[A-Za-z0-9_.@]*$/) };
}

// --- suggestion assembly ----------------------------------------------------

function boolSuggestions(
  catalog: CatalogIndex,
  ctx: BoolCaretContext,
  profile: 'where' | 'having',
): SuggestionResult {
  if (ctx.role === 'op') {
    const ops = catalog.operatorsForDisplay(ctx.lhsType ?? 'any');
    const f = ctx.frag.toLowerCase();
    const items: Suggestion[] = ops
      .map((o) => ({ display: OP_DISPLAY[o] ?? o, canon: o }))
      .filter((o) => !f || o.display.toLowerCase().startsWith(f) || o.canon.startsWith(f))
      .map((o) => ({ kind: 'operator' as const, insert: o.display + ' ', label: o.display, sublabel: o.canon }));
    return { frag: ctx.frag, groups: [{ label: 'operators · ' + (ctx.lhsType ?? 'any'), items }] };
  }
  if (ctx.role === 'join') return { frag: '', groups: [] }; // user types AND / OR themselves
  if (ctx.role === 'value') {
    if (ctx.lhsType === 'boolean') {
      return { frag: ctx.frag, groups: [{ label: 'value', items: [litOpt('true'), litOpt('false')] }] };
    }
    return { frag: ctx.frag, groups: [] }; // value autocomplete deferred
  }
  // role 'lhs'
  const f = ctx.frag.toLowerCase();
  const cols = profile === 'having' ? [] : catalog.filterableFields();
  const fns = profile === 'having' ? catalog.fnsByKind('aggregate') : catalog.fnsByKind('scalar');
  return { frag: ctx.frag, groups: [fnGroup(catalog, fns, f), colGroup(cols, f)] };
}

function argSuggestions(
  catalog: CatalogIndex,
  fnName: string,
  argIndex: number,
  frag: string,
): SuggestionResult {
  const fn = catalog.fnByName(fnName);
  if (!fn) return { frag, groups: [] };
  const param = paramAt(fn, argIndex);
  if (!param) return { frag, groups: [{ label: 'no more parameters', items: [] }] };

  const acc = acceptedGenerics(param.types);
  const f = frag.toLowerCase();
  const cols = catalog.fields.filter((c) => acc.has('any') || acc.has(toGeneric(c.type.type)));
  const fns = catalog.functions.filter(
    (fn2) => fn2.kind === 'scalar' && (acc.has('any') || acc.has(catalog.outputGeneric(fn2))),
  );
  const groups: SuggestionGroup[] = [fnGroup(catalog, fns, f), colGroup(cols, f)];
  if (fnName === 'count' && argIndex === 0) groups.unshift({ label: 'literal', items: [litOpt('*')] });
  return { frag, groups, desc: fn.description };
}

// --- group / item builders --------------------------------------------------

function fnGroup(catalog: CatalogIndex, fns: readonly FunctionDefinition[], f: string): SuggestionGroup {
  return {
    label: 'functions',
    items: fns
      .filter((fn) => fn.name.toLowerCase().includes(f))
      .map((fn) => ({
        kind: 'function' as const,
        insert: fn.name + '()',
        caretBack: 1,
        label: fn.name,
        badge: fn.kind,
        output: catalog.outputGeneric(fn),
        description: fn.description,
      })),
  };
}

function colGroup(cols: readonly FilterDefinition[], f: string): SuggestionGroup {
  return {
    label: 'columns',
    items: cols
      .filter((c) => c.field.toLowerCase().includes(f) || c.label.toLowerCase().includes(f))
      .map((c) => ({
        kind: 'column' as const,
        insert: c.field,
        label: c.label,
        sublabel: c.field,
        badge: c.type.type,
      })),
  };
}

function litOpt(v: string): Suggestion {
  return { kind: 'literal', insert: v + ' ', label: v, sublabel: 'literal' };
}

function dirOpt(d: string): Suggestion {
  return { kind: 'direction', insert: d + ' ', label: d };
}

/** The parameter definition at `argIndex`, repeating the last one when variadic. */
export function paramAt(fn: FunctionDefinition, i: number): FunctionDefinition['parameters'][number] | null {
  if (i < fn.parameters.length) return fn.parameters[i]!;
  const last = fn.parameters[fn.parameters.length - 1];
  return last && last.maxRepeat === null ? last : null;
}

/** The trailing match of `re` against `prefix`, or `''`. */
function fragAt(prefix: string, re: RegExp): string {
  return (re.exec(prefix) ?? [''])[0]!;
}
