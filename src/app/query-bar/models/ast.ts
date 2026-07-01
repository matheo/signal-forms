import { ConditionOperator } from './operators';

/**
 * Abstract Syntax Tree for the query-bar grammar.
 *
 * The tree is a discriminated union keyed on `type`. It round-trips with the
 * source text: every node carries an optional {@link SourceSpan} (produced by
 * the parser) so the contenteditable view can map caret offsets to nodes and
 * render each segment as a chip. Domain code may ignore `span`.
 */
export type QueryNode = LogicalNode | NotNode | GroupNode | ConditionNode | FunctionNode;

/** `AND` / `OR`. N-ary to mirror query-builder's `LogicalExpression.expressions[]`. */
export interface LogicalNode {
  type: 'logical';
  operator: 'and' | 'or';
  operands: QueryNode[];
  span?: SourceSpan;
}

/** `NOT` prefix over a single condition or a grouped block. */
export interface NotNode {
  type: 'not';
  operand: QueryNode;
  span?: SourceSpan;
}

/** Explicit parentheses authored by the user, preserved verbatim (`(A OR B)`). */
export interface GroupNode {
  type: 'group';
  operand: QueryNode;
  span?: SourceSpan;
}

/** `field OPERATOR value` (e.g. `env = 'production'`). */
export interface ConditionNode {
  type: 'condition';
  field: string;
  operator: ConditionOperator;
  /** Absent for no-value ops (isEmpty/isNotEmpty); array for isIn/isNotIn. */
  value?: LiteralValue | LiteralValue[];
  span?: SourceSpan;
}

/** `function_name(arg, arg, ...)` (e.g. `COALESCE(col1, col2, 0)`). */
export interface FunctionNode {
  type: 'function';
  name: string;
  args: Array<IdentifierArg | LiteralValue>;
  span?: SourceSpan;
}

/** A bare column/identifier used as a function argument. */
export interface IdentifierArg {
  type: 'identifier';
  name: string;
  span?: SourceSpan;
}

/** A literal value. Its lexical type is refined to the field's FilterType later. */
export type LiteralValue =
  | { type: 'string'; value: string; span?: SourceSpan }
  | { type: 'number'; value: number; span?: SourceSpan }
  | { type: 'boolean'; value: boolean; span?: SourceSpan };

/** Character offsets `[start, end)` into the source text. */
export interface SourceSpan {
  start: number;
  end: number;
}

/** A recoverable parse problem. The parser never throws; it collects these. */
export interface ParseError {
  message: string;
  span: SourceSpan;
}

/** Result of {@link parse}: a (possibly partial) tree plus any errors. */
export interface ParseResult {
  ast: QueryNode | null;
  errors: ParseError[];
}
