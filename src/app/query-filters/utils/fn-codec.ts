import { FnArgs, FnName } from '../models';

const FN_NAMES: readonly FnName[] = ['coalesce', 'floor', 'count', 'sum', 'avg', 'min', 'max'];

export const isFnName = (name: string): name is FnName =>
  (FN_NAMES as readonly string[]).includes(name.toLowerCase());

const stripQuotes = (raw: string): string => {
  const v = raw.trim();
  if (v.length >= 2 && (v[0] === "'" || v[0] === '"') && v[v.length - 1] === v[0]) {
    return v.slice(1, -1);
  }
  return v;
};

const quote = (value: string): string => `'${value.replace(/'/g, "\\'")}'`;

/** Render `FnArgs` to its canonical text form, e.g. `COALESCE(a:b:'v')`, `SUM(field)`. */
export function formatFnArgs(args: FnArgs): string {
  const name = args.fn.toUpperCase();
  if (args.fn === 'coalesce') {
    return `${name}(${args.field1}:${args.field2}:${quote(args.value)})`;
  }
  return `${name}(${args.field})`;
}

/**
 * Parse a function text form (e.g. `COALESCE(a:b:'v')`) into `FnArgs`.
 * Returns `null` when the text is not a recognized function call. Tolerant of
 * partial inner content so it can run while the user is still typing.
 */
export function parseFnText(text: string): FnArgs | null {
  const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*$/s.exec(text);
  if (!match) {
    return null;
  }
  const name = match[1]!.toLowerCase();
  if (!isFnName(name)) {
    return null;
  }
  const inner = match[2]!;

  if (name === 'coalesce') {
    const first = inner.indexOf(':');
    const second = first === -1 ? -1 : inner.indexOf(':', first + 1);
    const field1 = (first === -1 ? inner : inner.slice(0, first)).trim();
    const field2 = first === -1 ? '' : inner.slice(first + 1, second === -1 ? undefined : second).trim();
    const value = second === -1 ? '' : stripQuotes(inner.slice(second + 1));
    return { fn: 'coalesce', field1, field2, value };
  }

  return { fn: name as Exclude<FnName, 'coalesce'>, field: stripQuotes(inner) };
}
