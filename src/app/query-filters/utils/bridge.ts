import {
  ConditionExpression,
  Expression,
  LogicalExpression,
  isLogical as isLogicalExpr,
} from '../../query-builder';
import { AstNode, ConditionNode, FnNode, GroupNode, QueryAst, isFn, isGroup } from '../models';
import { newCondition, newFn, newGroup } from './ast.utils';
import { formatFnArgs, parseFnText } from './fn-codec';

/** Default operator used when serializing a condition that has none chosen yet. */
const DEFAULT_OPERATOR: ConditionExpression['operator'] = 'equal';

// --- public LogicalExpression -> internal AST --------------------------------

export function parse(expr: LogicalExpression): QueryAst {
  return { root: toGroup(expr) };
}

function toGroup(expr: LogicalExpression): GroupNode {
  return newGroup(expr.expressions.map(toNode), expr.operator, expr.not);
}

function toNode(expr: Expression): AstNode {
  if (isLogicalExpr(expr)) {
    return toGroup(expr);
  }
  // A function-encoded condition stores its call in `field_name`.
  const fnArgs = parseFnText(expr.field_name);
  if (fnArgs) {
    return newFn(fnArgs, expr.operator, expr.value);
  }
  return newCondition(expr.field_name, expr.operator, expr.value);
}

// --- internal AST -> public LogicalExpression --------------------------------

export function serialize(ast: QueryAst): LogicalExpression {
  return groupToLogical(ast.root);
}

function groupToLogical(group: GroupNode): LogicalExpression {
  return {
    not: group.not,
    operator: group.operator,
    expressions: group.children.map(nodeToExpression),
  };
}

function nodeToExpression(node: AstNode): Expression {
  if (isGroup(node)) {
    return groupToLogical(node);
  }
  return isFn(node) ? fnToCondition(node) : conditionToExpression(node);
}

function conditionToExpression(node: ConditionNode): ConditionExpression {
  return {
    field_name: node.field,
    operator: node.operator || DEFAULT_OPERATOR,
    value: node.value ?? '',
  };
}

function fnToCondition(node: FnNode): ConditionExpression {
  return {
    field_name: formatFnArgs(node.args),
    operator: node.operator || DEFAULT_OPERATOR,
    value: node.value ?? '',
  };
}
