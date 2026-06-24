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

/**
 * Collapse a per-gap group into the public single-operator tree. Because the public
 * model has one operator per level, mixed connectors are nested by precedence
 * (`AND` binds tighter than `OR`): `a AND b OR c` -> `OR( AND(a, b), c )`.
 */
function groupToLogical(group: GroupNode): LogicalExpression {
  const exprs = group.children.map(nodeToExpression);

  if (exprs.length <= 1) {
    return { not: group.not, operator: 'and', expressions: exprs };
  }

  // Split into OR-segments; within each segment children are joined by AND.
  const segments: Expression[][] = [[exprs[0]!]];
  group.operators.forEach((op, gap) => {
    const next = exprs[gap + 1]!;
    if (op === 'or') {
      segments.push([next]);
    } else {
      segments[segments.length - 1]!.push(next);
    }
  });

  const orChildren: Expression[] = segments.map((seg) =>
    seg.length === 1 ? seg[0]! : { not: false, operator: 'and', expressions: seg },
  );

  if (orChildren.length === 1) {
    const only = orChildren[0]!;
    return isLogicalExpr(only)
      ? { ...only, not: group.not }
      : { not: group.not, operator: 'and', expressions: [only] };
  }
  return { not: group.not, operator: 'or', expressions: orChildren };
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
