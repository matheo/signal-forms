import { ConditionExpression, Expression, LogicalExpression, LogicalOperator } from '../models';

export function isCondition(expression: Expression): expression is ConditionExpression {
  return expression && 'field_name' in expression;
}

export function isLogical(expression: Expression): expression is LogicalExpression {
  return expression && 'expressions' in expression;
}

/**
 * Create fresh objects to not introduce the same reference in the model.
 */

export const newCondition = () => ({
  field_name: '',
  operator: '',
  value: '',
} as unknown as ConditionExpression);

export const newExpression= (): LogicalExpression => ({
  not: false,
  operator: LogicalOperator.AND,
  expressions: [newCondition()],
});
