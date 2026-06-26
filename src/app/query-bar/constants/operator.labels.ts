import { ConditionOperator } from '../models';

export const operatorLabels = new Map<ConditionOperator, string>([
  [ConditionOperator.equal, '='],
  [ConditionOperator.notEqual, '!='],
  [ConditionOperator.greaterThan, '>'],
  [ConditionOperator.greaterThanOrEqual, '>='],
  [ConditionOperator.lessThan, '<'],
  [ConditionOperator.lessThanOrEqual, '<='],

  [ConditionOperator.isIn, 'IN'],
  [ConditionOperator.isNotIn, 'NOT IN'],
  [ConditionOperator.isEmpty, 'IS EMPTY'],
  [ConditionOperator.isNotEmpty, 'IS NOT EMPTY'],

  [ConditionOperator.startsWith, 'STARTS WITH'],
  [ConditionOperator.endsWith, 'ENDS WITH'],
  [ConditionOperator.contains, 'CONTAINS'],
  [ConditionOperator.like, 'LIKE'],
  [ConditionOperator.regexp, 'REGEXP'],

  // array operators
  [ConditionOperator.anyMatch, 'ANY OBJECT'],
  [ConditionOperator.allMatch, 'ALL OBJECTS'],

  // map operators
  [ConditionOperator.hasKey, 'HAS KEY'],
  [ConditionOperator.hasValue, 'HAS VALUE'],
]);

export const multipleValueOperators = [
  ConditionOperator.isIn,
  ConditionOperator.isNotIn,
];
export const noValueOperators = [
  ConditionOperator.isEmpty,
  ConditionOperator.isNotEmpty,
];
