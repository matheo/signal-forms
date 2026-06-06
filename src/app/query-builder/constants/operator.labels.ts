import { ConditionOperator } from '../models';

export const operatorLabels = new Map<ConditionOperator, string>([
  [ConditionOperator.equal, '='],
  [ConditionOperator.greaterThan, '>'],
  [ConditionOperator.greaterThanOrEqual, '>='],
  [ConditionOperator.lessThan, '<'],
  [ConditionOperator.lessThanOrEqual, '<='],
  [ConditionOperator.notEqual, '!='],

  [ConditionOperator.isIn, 'In'],
  [ConditionOperator.isNotIn, 'Not In'],
  [ConditionOperator.isEmpty, 'Is Empty'],
  [ConditionOperator.isNotEmpty, 'Is Not Empty'],

  [ConditionOperator.startsWith, 'Starts With'],
  [ConditionOperator.endsWith, 'Ends With'],
  [ConditionOperator.contains, 'Contains'],
  [ConditionOperator.like, 'Like'],
  [ConditionOperator.regexp, 'Regexp'],

  // array operators
  [ConditionOperator.anyMatch, 'Any Object'],
  [ConditionOperator.allMatch, 'All Objects'],

  // map operators
  [ConditionOperator.hasKey, 'Has Key'],
  [ConditionOperator.hasValue, 'Has Value'],
]);
