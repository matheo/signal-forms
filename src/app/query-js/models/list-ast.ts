import { EditorToken } from './editor-token';
import { ExprNode } from './bool-ast';
import { SortDirection } from './query-definition';

/**
 * Transient AST for the v2 list grammar (SELECT / GROUP BY / ORDER BY).
 *
 * A comma-separated list of items; each item is one inline chip. Produced by the
 * prototype's `analyzeList` and consumed by `serializeSelectItem` / `serializeList`.
 */

/** Which list profile is analyzed. */
export type ListKind = 'select' | 'groupby' | 'orderby';

/**
 * One list item, enriched with validity. `node` is the parsed expression (column
 * or function); `alias` applies to SELECT; `name`/`direction` apply to ORDER BY
 * (which serializes from those rather than from `node`).
 */
export interface ListItem {
  cid: number;
  start: number;
  valid: boolean;
  reason: string;
  node?: ExprNode;
  /** ORDER BY: the column name. */
  name?: string;
  /** ORDER BY: sort direction (defaults to `asc`). */
  direction?: SortDirection;
  /** SELECT: the (unquoted) `as` alias, if present. */
  alias?: string;
}

/** Full analysis of a list expression: tokens, items in order, and items by id. */
export interface ListAnalysis {
  tokens: EditorToken[];
  items: ListItem[];
  compById: Record<number, ListItem>;
}
