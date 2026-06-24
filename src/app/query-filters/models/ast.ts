import { ConditionOperator, ConditionValue } from '../../query-builder';

/**
 * Optimized internal AST for the query-filters bar.
 *
 * Unlike the public recursive `LogicalExpression` tree (used only at the I/O
 * boundary), every node carries a stable `id`. Mutations rebuild only the spine
 * to the touched node (see `utils/ast.utils`), so untouched subtrees keep their
 * reference identity and the chip projection skips re-rendering them.
 */

export type NodeId = string;

export type AstNodeKind = 'group' | 'condition' | 'fn';

/** Operator of a condition; `''` means "not picked yet" (partial while typing). */
export type PartialOperator = `${ConditionOperator}` | '';

interface AstNodeBase {
  readonly id: NodeId;
  readonly kind: AstNodeKind;
}

/** A connector between two adjacent group children. */
export type LogicalConnector = 'and' | 'or';

/**
 * A logical group, optionally negated. Parentheses are implied by depth > 0.
 *
 * Connectors are **per-gap**: `operators[i]` joins `children[i]` and `children[i + 1]`,
 * so a single group can mix `AND`/`OR` (e.g. `a AND b OR c`). Invariant:
 * `operators.length === max(0, children.length - 1)`.
 */
export interface GroupNode extends AstNodeBase {
  readonly kind: 'group';
  readonly not: boolean;
  readonly operators: readonly LogicalConnector[];
  readonly children: readonly AstNode[];
}

/** A leaf condition `field:operator:value`. */
export interface ConditionNode extends AstNodeBase {
  readonly kind: 'condition';
  readonly field: string;
  readonly operator: PartialOperator;
  readonly value: ConditionValue | null;
}

/** Supported function names. */
export type FnName = 'coalesce' | 'floor' | 'count' | 'sum' | 'avg' | 'min' | 'max';

/** Function arguments, discriminated by `fn`. */
export type FnArgs =
  | { readonly fn: 'coalesce'; readonly field1: string; readonly field2: string; readonly value: string }
  | { readonly fn: Exclude<FnName, 'coalesce'>; readonly field: string };

/**
 * A function chip such as `COALESCE(column1:column2:'value')` or `SUM(field)`.
 * A function may participate in a condition (`SUM(x) > 3`) via `operator`/`value`.
 */
export interface FnNode extends AstNodeBase {
  readonly kind: 'fn';
  readonly fn: FnName;
  readonly args: FnArgs;
  readonly operator: PartialOperator;
  readonly value: ConditionValue | null;
}

export type AstNode = GroupNode | ConditionNode | FnNode;

/** Root is always a group so the bar can always host children at depth 0. */
export interface QueryAst {
  readonly root: GroupNode;
}

export const isGroup = (node: AstNode): node is GroupNode => node.kind === 'group';
export const isCondition = (node: AstNode): node is ConditionNode => node.kind === 'condition';
export const isFn = (node: AstNode): node is FnNode => node.kind === 'fn';

export const isCoalesce = (
  node: AstNode,
): node is FnNode & { args: Extract<FnArgs, { fn: 'coalesce' }> } =>
  isFn(node) && node.fn === 'coalesce';
