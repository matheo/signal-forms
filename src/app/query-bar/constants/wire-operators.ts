import { WireOperator } from '../models';

/**
 * Wire-operator display + input tables for the v2 freeform editor.
 *
 * These are distinct from the v1 {@link operatorLabels} (camelCase
 * `ConditionOperator` → uppercase label): v2 works in the snake_case
 * {@link WireOperator} space the query API accepts, shows one canonical symbol
 * per operator, and accepts several input spellings per operator.
 *
 * Ported verbatim from the prototype's `OP_DISPLAY` / `OP_TABLE` /
 * `matchOperator` and the `NO_VALUE_OPS` / `LIST_OPS` / `CIDR_OPS` /
 * `CONTAINER_OPS` classification sets (see `filter-ui-v2.md`).
 */

/** Canonical wire operator → the single display form shown in the dropdown. */
export const OP_DISPLAY: Record<WireOperator, string> = {
  equal: '=',
  not_equal: '≠',
  greater_than: '>',
  greater_than_or_equal: '≥',
  less_than: '<',
  less_than_or_equal: '≤',
  is_in: 'in',
  is_not_in: 'not in',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  starts_with: 'starts with',
  ends_with: 'ends with',
  contains: 'contains',
  like: 'like',
  regexp: 'regexp',
  is_in_cidr: 'in cidr',
  is_not_in_cidr: 'not in cidr',
  has_key: 'has key',
  has_value: 'has value',
  any_match: 'any match',
  all_match: 'all match',
};

/** Extra input spellings accepted beyond each operator's display + canonical name. */
const OP_ALIASES: ReadonlyArray<readonly [string, WireOperator]> = [
  ['==', 'equal'],
  ['eq', 'equal'],
  ['!=', 'not_equal'],
  ['<>', 'not_equal'],
  ['ne', 'not_equal'],
  ['>=', 'greater_than_or_equal'],
  ['<=', 'less_than_or_equal'],
  ['gte', 'greater_than_or_equal'],
  ['gt', 'greater_than'],
  ['lte', 'less_than_or_equal'],
  ['lt', 'less_than'],
];

/**
 * Every spelling the matcher accepts → canonical wire name, sorted
 * longest-spelling-first so greedy prefix matching prefers `>=` over `>` and
 * `not in` over `in`. Built from the display forms, the canonical names, and
 * {@link OP_ALIASES}.
 */
export const OP_TABLE: ReadonlyArray<readonly [string, WireOperator]> = (() => {
  const table: Array<[string, WireOperator]> = [];
  for (const [canon, display] of Object.entries(OP_DISPLAY) as Array<[WireOperator, string]>) {
    table.push([display, canon]);
    if (canon !== display) table.push([canon, canon]);
  }
  for (const alias of OP_ALIASES) table.push([alias[0], alias[1]]);
  return table.sort((a, b) => b[0].length - a[0].length);
})();

/** A successful {@link matchOperator} result: the matched text and its canonical form. */
export interface OperatorMatch {
  /** The matched substring, verbatim from the input. */
  text: string;
  /** The canonical wire operator it resolves to. */
  canon: WireOperator;
}

/**
 * Match an operator at the start of `rest`. Word-like spellings (ending in a
 * letter) require a trailing non-identifier boundary so `into` is not read as
 * `in`. Returns null when nothing matches.
 */
export function matchOperator(rest: string): OperatorMatch | null {
  const low = rest.toLowerCase();
  for (const [spell, canon] of OP_TABLE) {
    if (low.startsWith(spell)) {
      if (/[a-z]$/.test(spell)) {
        const next = rest[spell.length];
        if (next && /[A-Za-z0-9_]/.test(next)) continue;
      }
      return { text: rest.slice(0, spell.length), canon };
    }
  }
  return null;
}

/** Operators that take no value; their value serializes to `null`. */
export const NO_VALUE_OPS: ReadonlySet<WireOperator> = new Set<WireOperator>([
  'is_empty',
  'is_not_empty',
]);

/** Operators whose value is an array (a comma list or `[…]`). */
export const LIST_OPS: ReadonlySet<WireOperator> = new Set<WireOperator>(['is_in', 'is_not_in']);

/** Operators whose value is a CIDR string, validated against {@link CIDR_RE}. */
export const CIDR_OPS: ReadonlySet<WireOperator> = new Set<WireOperator>([
  'is_in_cidr',
  'is_not_in_cidr',
]);

/** Container operators whose value is shaped by the container serializer. */
export const CONTAINER_OPS: ReadonlySet<WireOperator> = new Set<WireOperator>([
  'any_match',
  'all_match',
  'has_key',
  'has_value',
  'contains',
]);

/** Matches a full `a.b.c.d/n` IPv4 CIDR block. */
export const CIDR_RE = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[12][0-9]|3[0-2])$/;
