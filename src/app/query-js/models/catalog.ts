import { FilterDefinition, FunctionDefinition } from '../../query-bar';
import { WireOperator } from './query-definition';

/**
 * Catalog contracts for the v2 editor — the three static-per-deployment inputs
 * that drive autocomplete, operator resolution, and validation:
 *
 * 1. fields — {@link FilterDefinition}[] (`GET /v1/tables/{id}/filter-schema`)
 * 2. functions — {@link FunctionDefinition}[] (`GET /v1/functions`)
 * 3. operators — {@link OperatorCatalog} (`GET /v1/operators`)
 */

/**
 * Generic filter-schema type names. These are the keys of the operator catalog
 * and the targets of the class→generic bridge (`toGeneric`). Field types in the
 * filter-schema are already generic; function param/output types are class-level
 * and must be bridged.
 */
export type GenericType =
  | 'any'
  | 'array'
  | 'binary'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'ip'
  | 'map'
  | 'number'
  | 'string'
  | 'struct'
  | 'timestamp'
  | 'union'
  | 'uuid';

/** One entry of the `/v1/operators` response: operators valid for a generic type. */
export interface OperatorSet {
  type: GenericType;
  operators: WireOperator[];
}

/** The `/v1/operators` response — operators grouped by generic type. */
export type OperatorCatalog = OperatorSet[];

/** Indexed form of {@link OperatorCatalog} for O(1) lookup (`binary` maps to `[]`). */
export type OperatorsByType = Partial<Record<GenericType, WireOperator[]>>;

/**
 * The three source catalogs together — the bulk input to the reactive store
 * (`CatalogStore`). Each is static per deployment; a section editor never
 * mutates them, only reads the derived `CatalogIndex`.
 */
export interface CatalogSource {
  fields: readonly FilterDefinition[];
  functions: readonly FunctionDefinition[];
  operators: OperatorCatalog;
}
