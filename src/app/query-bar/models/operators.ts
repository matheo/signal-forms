export enum ConditionOperator {
  equal = 'equal',
  greaterThan = 'greaterThan',
  greaterThanOrEqual = 'greaterThanOrEqual',
  lessThan = 'lessThan',
  lessThanOrEqual = 'lessThanOrEqual',
  notEqual = 'notEqual',

  isIn = 'isIn',
  isNotIn = 'isNotIn',
  isEmpty = 'isEmpty',
  isNotEmpty = 'isNotEmpty',

  startsWith = 'startsWith',
  endsWith = 'endsWith',
  contains = 'contains',
  like = 'like',
  regexp = 'regexp',

  // array operators
  anyMatch = 'anyMatch',
  allMatch = 'allMatch',

  // map operators
  hasKey = 'hasKey',
  hasValue = 'hasValue',

  // aliases
  // eq = equal,
  // ne = notEqual,
  // gt = greaterThan,
  // gte = greaterThanOrEqual,
  // lt = lessThan,
  // lte = lessThanOrEqual,

  // In = isIn,
  // notIn = isNotIn,
}
