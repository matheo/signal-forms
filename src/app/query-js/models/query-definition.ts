/**
 * `QueryDefinition` — the JSON the query API accepts, and the serialization
 * target of the v2 freeform editor (see `filter-ui-v2.md`).
 *
 * These shapes mirror the prototype's serializers exactly:
 * `toWhere` / `toHaving` / `serializeSelectItem` / `serializeArg` / `serializeList`.
 * They are independent of the v1 {@link QueryNode} AST — v2 is added alongside,
 * not replacing it.
 */

/** Canonical (wire) operator names accepted by the query API. */
export type WireOperator =
  | 'equal'
  | 'not_equal'
  | 'greater_than'
  | 'greater_than_or_equal'
  | 'less_than'
  | 'less_than_or_equal'
  | 'is_in'
  | 'is_not_in'
  | 'is_empty'
  | 'is_not_empty'
  | 'starts_with'
  | 'ends_with'
  | 'contains'
  | 'like'
  | 'regexp'
  | 'is_in_cidr'
  | 'is_not_in_cidr'
  | 'has_key'
  | 'has_value'
  | 'any_match'
  | 'all_match';

export type LogicalCondition = 'and' | 'or';
export type SortDirection = 'asc' | 'desc';

// --- values ----------------------------------------------------------------

export type QueryScalar = string | number | boolean | null;

/**
 * Documented container value shape — e.g. `array any_match` / `all_match`,
 * `map has_key` / `has_value` serialize to `{operator: "equal", value}`.
 */
export interface ContainerValue {
  operator: WireOperator;
  value: QueryValue;
}

export type QueryValue = QueryScalar | QueryScalar[] | ContainerValue;

// --- field references (LHS) ------------------------------------------------

/**
 * A function LHS/argument. The discriminator is `"function"` everywhere except
 * a Having root aggregate, which uses `"agg_function"`. Nested args are always
 * `"function"`.
 */
export interface FunctionRef {
  type: 'function' | 'agg_function';
  name: string;
  args: FunctionArg[];
}

/** A serialized function argument: bare column name, literal, or nested function. */
export type FunctionArg = string | number | FunctionRef;

/** Comparison LHS: a bare column name (string) or a function call. */
export type FieldRef = string | FunctionRef;

// --- WHERE (boolean grammar) -----------------------------------------------

export interface WhereRule {
  field: FieldRef;
  operator: WireOperator;
  value: QueryValue;
}

export interface WhereGroup {
  condition: LogicalCondition;
  not: boolean;
  rules: WhereNode[];
}

export type WhereNode = WhereGroup | WhereRule;

// --- HAVING (boolean grammar, aggregate LHS, distinct wrapper spelling) -----

export interface HavingRule {
  /** Always an aggregate: `type: "agg_function"`. */
  field: FunctionRef;
  operator: WireOperator;
  value: QueryValue;
}

/** Having's logical wrapper uses `operator`/`expressions` (not `condition`/`rules`). */
export interface HavingGroup {
  operator: LogicalCondition;
  expressions: HavingNode[];
}

export type HavingNode = HavingGroup | HavingRule;

// --- SELECT (list grammar) -------------------------------------------------

export interface SelectColumn {
  type: 'column';
  name: string;
  alias?: string;
}

export interface SelectFunction {
  /** `window_function` for analytic-kind functions, otherwise `function`. */
  type: 'function' | 'window_function';
  name: string;
  args: FunctionArg[];
  alias?: string;
}

/** A bare, unaliased column serializes to its name string; otherwise an object. */
export type SelectItem = string | SelectColumn | SelectFunction;

// --- ORDER BY (list grammar) -----------------------------------------------

export interface OrderByItem {
  column: string;
  direction: SortDirection;
}

// --- assembled payload -----------------------------------------------------

/**
 * The submitted query. Keys are emitted only when non-empty; `where` is always
 * a {@link WhereGroup} (a lone comparison is wrapped); `having` is suppressed
 * unless a group-by exists.
 */
export interface QueryDefinition {
  select?: SelectItem[];
  where?: WhereGroup;
  groupBy?: string[];
  having?: HavingNode;
  orderBy?: OrderByItem[];
}
