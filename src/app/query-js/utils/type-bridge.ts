import { FunctionDataType } from '../../query-bar';
import { GenericType } from '../models';

/**
 * Type-name bridging (see `filter-ui-v2.md` §"Type-name bridging").
 *
 * Function parameter/output types use query-builder class names (`decimal`,
 * `bool`, `literal_int`, …) while fields and the operator catalog use generic
 * filter-schema names (`number`, `boolean`, …). This maps class names to
 * generic names so argument candidates can be filtered by a parameter's
 * accepted types and a function's output type can resolve to an operator set.
 *
 * Mirrors the prototype's `CLASS_TO_GENERIC` / `toGeneric` / `acceptedGenerics`.
 */
export const CLASS_TO_GENERIC: Record<string, GenericType> = {
  decimal: 'number',
  double: 'number',
  float: 'number',
  tinyint: 'number',
  int: 'number',
  long: 'number',
  smallint: 'number',
  literal_int: 'number',
  literal_numeric: 'number',
  string: 'string',
  literal_string: 'string',
  bool: 'boolean',
  boolean: 'boolean',
  date: 'date',
  timestamp: 'timestamp',
  ip: 'ip',
  uuid: 'uuid',
  enum: 'enum',
  array: 'array',
  map: 'map',
  struct: 'struct',
  union: 'union',
  binary: 'binary',
  any: 'any',
};

/** Bridge a class-level (or already-generic) type name to its generic name. */
export function toGeneric(type: string): GenericType {
  return (CLASS_TO_GENERIC[type] ?? type) as GenericType;
}

/**
 * The set of generic types a function parameter accepts. `types` may be a single
 * name or an array; `any` (widened from unions too) is a member callers check
 * for explicitly to short-circuit acceptance of every candidate.
 */
export function acceptedGenerics(types: FunctionDataType | FunctionDataType[]): Set<GenericType> {
  const list = Array.isArray(types) ? types : [types];
  return new Set(list.map(toGeneric));
}
