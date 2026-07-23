/**
 * Source-spanned token emitted by the v2 analyzers (boolean and list grammars
 * alike) for syntax highlighting and inline-chip grouping.
 *
 * One shape across all five profiles — the prototype keeps a single `ROLE_CLASS`
 * table, so a highlighter can render any profile's tokens uniformly. The list
 * grammar adds the `dir` (order-by `asc`/`desc`) and `alias` (`as …`) roles.
 */
export type EditorTokenRole =
  | 'field'
  | 'func'
  | 'op'
  | 'val'
  | 'str'
  | 'num'
  | 'bare'
  | 'kw'
  | 'paren'
  | 'comma'
  | 'ws'
  | 'bad'
  | 'dir'
  | 'alias';

export interface EditorToken {
  start: number;
  end: number;
  role: EditorTokenRole;
  text: string;
  /** The owning comparison/item id (set for LHS / operator / value / alias tokens). */
  compId?: number;
  /** For `field` tokens: whether the column is known to the catalog. */
  known?: boolean;
}
