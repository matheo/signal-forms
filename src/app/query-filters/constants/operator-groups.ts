import { ConditionOperator, FilterDefinition, operatorLabels } from '../../query-builder';
import { PartialOperator } from '../models';

const O = ConditionOperator;

const EQUALITY = [O.equal, O.notEqual];
const COMPARISON = [O.greaterThan, O.greaterThanOrEqual, O.lessThan, O.lessThanOrEqual];
const SET = [O.isIn, O.isNotIn];
const PRESENCE = [O.isEmpty, O.isNotEmpty];
const TEXT = [O.contains, O.startsWith, O.endsWith, O.like, O.regexp];

/** Valid operators per primitive/structural filter-type key. */
const OPERATORS_BY_TYPE: Record<string, ConditionOperator[]> = {
  string: [...EQUALITY, ...TEXT, ...SET, ...PRESENCE],
  uuid: [...EQUALITY, ...SET, ...PRESENCE],
  number: [...EQUALITY, ...COMPARISON, ...SET, ...PRESENCE],
  timestamp: [...EQUALITY, ...COMPARISON],
  boolean: [...EQUALITY],
  enum: [...EQUALITY, ...SET],
  array: [O.anyMatch, O.allMatch, ...PRESENCE],
  map: [O.hasKey, O.hasValue, ...PRESENCE],
  struct: [...EQUALITY],
};

const DEFAULT_OPERATORS = [...EQUALITY, ...TEXT, ...SET, ...PRESENCE];

/** Resolve the type discriminator of a `FilterType` (its `type` or function `input`). */
function typeKey(type: FilterDefinition['type']): string {
  if ('fn' in type) {
    // Functions (coalesce / aggregates) behave like their input scalar type.
    return type.input;
  }
  return type.type;
}

export function operatorsForFilter(filter: FilterDefinition): ConditionOperator[] {
  return OPERATORS_BY_TYPE[typeKey(filter.type)] ?? DEFAULT_OPERATORS;
}

const OPERATOR_VALUES = new Set<string>(Object.values(ConditionOperator));

/** Resolve user-typed operator text (canonical value, alias key, or symbol) to a canonical operator. */
export function resolveOperator(text: string): PartialOperator {
  const raw = text.trim();
  if (!raw) {
    return '';
  }
  if (OPERATOR_VALUES.has(raw)) {
    return raw as PartialOperator;
  }
  if (raw in ConditionOperator) {
    return ConditionOperator[raw as keyof typeof ConditionOperator];
  }
  for (const [op, label] of operatorLabels) {
    if (label === raw) {
      return op;
    }
  }
  return '';
}
