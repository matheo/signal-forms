import { ContainerValue, QueryValue, WireOperator } from '../models';
import { LIST_OPS, NO_VALUE_OPS, OP_DISPLAY } from '../constants';
import { ContainerFilterType } from './catalog-index';

/**
 * Freeform value coercion for the v2 editor — turns the raw typed value of a
 * comparison into its serialized {@link QueryValue}, keyed on the operator and
 * the LHS's resolved (generic) type. Ported from the prototype's
 * `stripQuotes` / `coerceValue` / `containerValue`.
 */

/** Strip one pair of matching surrounding quotes, if present. */
export function stripQuotes(s: string): string {
  return /^(['"]).*\1$/.test(s) ? s.slice(1, -1) : s;
}

/**
 * Coerce a raw scalar/list value. `is_empty`/`is_not_empty` → `null`;
 * `is_in`/`is_not_in` → an array (accepts `a, b` or `[a, b]`); numbers/booleans
 * are parsed by the LHS type; everything else is an unquoted string.
 */
export function coerceValue(canon: WireOperator, lhsType: string, raw: string): QueryValue {
  if (NO_VALUE_OPS.has(canon)) return null;
  raw = raw.trim();
  if (LIST_OPS.has(canon)) {
    return raw
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => (lhsType === 'number' ? Number(stripQuotes(x)) : stripQuotes(x)));
  }
  if (lhsType === 'number') return Number(stripQuotes(raw));
  if (lhsType === 'boolean') return /^'?true'?$/i.test(raw);
  return stripQuotes(raw);
}

/** A container value that could be shaped, or a reason it needs the structured editor. */
export type ContainerValueResult =
  | { ok: true; value: QueryValue }
  | { ok: false; reason: string };

/**
 * Shape a freeform value for a container comparison into the documented wire
 * form (single inner value, `equal`):
 * - `array contains` → the coerced scalar;
 * - other `array` ops → `{operator: "equal", value}`;
 * - `map has_key` / `has_value` → `{operator: "equal", value}` (key/value type).
 *
 * Operators that require selecting a key / struct field / union variant are
 * rejected — they need the structured editor (out of scope for freeform).
 */
export function containerValue(
  ct: ContainerFilterType,
  op: WireOperator,
  raw: string,
): ContainerValueResult {
  if (ct.type === 'array' && op === 'contains') {
    return { ok: true, value: coerceValue('equal', ct.element_type.type, raw) };
  }
  if (ct.type === 'array') {
    const value: ContainerValue = { operator: 'equal', value: coerceValue('equal', ct.element_type.type, raw) };
    return { ok: true, value };
  }
  if (ct.type === 'map' && op === 'has_key') {
    const value: ContainerValue = { operator: 'equal', value: coerceValue('equal', ct.key_type.type, raw) };
    return { ok: true, value };
  }
  if (ct.type === 'map' && op === 'has_value') {
    const value: ContainerValue = { operator: 'equal', value: coerceValue('equal', ct.value_type.type, raw) };
    return { ok: true, value };
  }
  return {
    ok: false,
    reason: `${ct.type} '${OP_DISPLAY[op] ?? op}' needs the structured editor (out of scope for freeform)`,
  };
}
