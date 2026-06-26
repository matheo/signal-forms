import { ComplexFilterKind, ConditionOperator, SimpleFilterKind } from '../models';

/** Keys of {@link operatorsPerType}: every filter type plus the autocomplete-assisted string variant. */
export type OperatorTypeKey = SimpleFilterKind | ComplexFilterKind | 'enum' | 'stringWithAutocomplete';

/**
 * Defines operator options available for various data types in a structured format.
 * The configuration covers a wide range of types such as string, number, date, boolean, etc.,
 *
 * - `array`: Operations related to array elements
 * - `map`: Key-value pair checks in a map
 * - `struct`: Similar to 'map', for data structures
 * - `string`: String matching and comparison operations
 * - `stringWithAutocomplete`: String operations where user input is assisted with autocomplete
 * - `date`, `timestamp`: Date and time comparisons
 * - `boolean`: Boolean state checks
 * - `number`: Numeric comparisons and range checks
 * - `uuid`: Operations specific to UUID format strings
 * - `enum`: Enumerated type checks
 * - `ip`: IP address checks, including CIDR notations
 *
 */
export const operatorsPerType: Record<OperatorTypeKey, ConditionOperator[]> = {
  array: [
    ConditionOperator.anyMatch,
    ConditionOperator.allMatch,
  ],
  map: [
    ConditionOperator.contains,
    ConditionOperator.hasKey,
    ConditionOperator.hasValue,
  ],
  struct: [ConditionOperator.contains],
  string: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.startsWith,
    ConditionOperator.endsWith,
    ConditionOperator.contains,
    ConditionOperator.isIn,
    ConditionOperator.isNotIn,
    ConditionOperator.isEmpty,
    ConditionOperator.isNotEmpty,
    ConditionOperator.like,
    ConditionOperator.regexp,
  ],
  stringWithAutocomplete: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.isIn,
    ConditionOperator.isNotIn,
    ConditionOperator.isEmpty,
    ConditionOperator.isNotEmpty,
  ],
  date: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.greaterThan,
    ConditionOperator.greaterThanOrEqual,
    ConditionOperator.lessThan,
    ConditionOperator.lessThanOrEqual,
  ],
  timestamp: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.greaterThan,
    ConditionOperator.greaterThanOrEqual,
    ConditionOperator.lessThan,
    ConditionOperator.lessThanOrEqual,
  ],
  boolean: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
  ],
  number: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.greaterThanOrEqual,
    ConditionOperator.greaterThan,
    ConditionOperator.lessThan,
    ConditionOperator.lessThanOrEqual,
    ConditionOperator.isIn,
    ConditionOperator.isNotIn,
    // ConditionOperator.between,
    // ConditionOperator.notBetween,
  ],
  uuid: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.isIn,
    ConditionOperator.isNotIn,
    ConditionOperator.isEmpty,
    ConditionOperator.isNotEmpty,
  ],
  enum: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    // ConditionOperator.isIn,
    // ConditionOperator.isNotIn,
    ConditionOperator.isEmpty,
    ConditionOperator.isNotEmpty,
  ],
  ip: [
    ConditionOperator.equal,
    ConditionOperator.notEqual,
    ConditionOperator.isIn,
    ConditionOperator.isNotIn,
    ConditionOperator.isEmpty,
    ConditionOperator.isNotEmpty,
  ],
};
