import { FunctionDefinition } from '../../query-bar';
import { EditorToken } from './editor-token';
import { QueryValue, WireOperator } from './query-definition';

/**
 * Transient AST for the v2 boolean grammar (WHERE / HAVING freeform editor).
 *
 * Distinct from the v1 {@link QueryNode} tree in `ast.ts`: this is what the
 * prototype's `analyzeBoolean` produces per keystroke — comparison leaves joined
 * by AND/OR/NOT and parentheses — and is what `toWhere` / `toHaving` serialize
 * into the wire {@link WhereNode} / {@link HavingNode} shapes.
 *
 * The terse `t` / `k` discriminators are kept verbatim from the prototype so the
 * port stays a line-by-line correspondence with the reference; they also read
 * differently from the wire `type` discriminator on {@link FunctionRef}, which
 * keeps the parse nodes visually separate from the serialized payload.
 */

/** Which boolean profile is analyzed — differs only in LHS rules + serializer. */
export type BoolMode = 'where' | 'having';

// --- LHS expression nodes ---------------------------------------------------

/** A comparison's left-hand side: a column, a (possibly nested) function, or a literal arg. */
export type ExprNode = ColumnExpr | FunctionExpr | LiteralExpr;

export interface ColumnExpr {
  t: 'col';
  name: string;
  /** Whether the catalog has a field by this name. */
  known: boolean;
}

export interface FunctionExpr {
  t: 'fn';
  /** The resolved definition, or null when the function name is unknown. */
  fn: FunctionDefinition | null;
  name: string;
  args: ExprNode[];
}

/** A literal function argument (`'x'`, `5`, or the `*` in `count(*)`). */
export interface LiteralExpr {
  t: 'lit';
  value: string | number;
  litType: 'string' | 'number' | 'star';
}

// --- comparison leaf --------------------------------------------------------

/** One `LHS op value`, enriched by `finalizeComp` with validity/coerced value. */
export interface Comparison {
  cid: number;
  lhs: ExprNode;
  /** Matched operator surface text (e.g. `>=`, `in`), or null while incomplete. */
  op: string | null;
  opCanon: WireOperator | null;
  /** Raw (unparsed) value substring as typed. */
  raw: string;
  start: number;
  valid?: boolean;
  reason?: string;
  /** Resolved LHS generic/container type used for operator + value checks. */
  lhsType?: string;
  /** Coerced value once valid (null for no-value ops). */
  value?: QueryValue;
}

// --- flat item stream + tree ------------------------------------------------

/** Flat pre-parse item from the analyzer, consumed by `parseItems`. */
export type BoolItem =
  | { k: 'leaf'; comp: Comparison }
  | { k: 'not' }
  | { k: '(' }
  | { k: ')' }
  | { k: 'and' }
  | { k: 'or' };

/** The parsed boolean tree (precedence OR < AND < NOT < primary; groups explicit). */
export type BoolTree = LeafTree | LogicalTree | NotTree | GroupTree | EmptyTree;

export interface LeafTree {
  t: 'leaf';
  comp: Comparison;
}
export interface LogicalTree {
  t: 'and' | 'or';
  not: boolean;
  kids: BoolTree[];
}
export interface NotTree {
  t: 'not';
  kid: BoolTree;
}
export interface GroupTree {
  t: 'group';
  kid: BoolTree;
}
export interface EmptyTree {
  t: 'empty';
}

/** Full analysis of a boolean expression: tokens, comparisons by id, and the tree. */
export interface BoolAnalysis {
  tokens: EditorToken[];
  compById: Record<number, Comparison>;
  tree: BoolTree;
}
