import {
  ArrayFilterType,
  FilterDefinition,
  FunctionDefinition,
  GenericType,
  MapFilterType,
  OperatorCatalog,
  OperatorsByType,
  StructFilterType,
  WireOperator,
} from '../models';
import { toGeneric } from './type-bridge';

/** A field type that needs a nested value/key/field to compare against. */
export type ContainerFilterType = ArrayFilterType | MapFilterType | StructFilterType;

/**
 * Immutable, indexed view over the three static catalogs (fields, functions,
 * operators) that drive v2 autocomplete, operator resolution, and validation.
 *
 * The prototype kept a single mutable `Catalog` singleton with setters; the
 * Angular equivalent is to build a fresh index whenever the source catalogs
 * change (a reactive store can wrap this in a `computed`). Lookups mirror the
 * prototype's `opsFor` / `fieldByName` / `fnByName` / `fnsByKind` /
 * `filterableFields` / `outputGeneric`.
 */
export class CatalogIndex {
  private readonly operatorsByType: OperatorsByType = {};
  private readonly fieldsByName = new Map<string, FilterDefinition>();
  private readonly functionsByName = new Map<string, FunctionDefinition>();

  constructor(
    readonly fields: readonly FilterDefinition[] = [],
    readonly functions: readonly FunctionDefinition[] = [],
    operators: OperatorCatalog = [],
  ) {
    for (const set of operators) this.operatorsByType[set.type] = set.operators;
    for (const f of fields) this.fieldsByName.set(f.field, f);
    for (const fn of functions) this.functionsByName.set(fn.name, fn);
  }

  /** Operators valid for a generic type. `[]` for unknown/operatorless types (e.g. `binary`). */
  opsFor(type: GenericType | string): WireOperator[] {
    return this.operatorsByType[type as GenericType] ?? [];
  }

  fieldByName(name: string): FilterDefinition | undefined {
    return this.fieldsByName.get(name);
  }

  fnByName(name: string): FunctionDefinition | undefined {
    return this.functionsByName.get(name);
  }

  fnsByKind(kind: FunctionDefinition['kind']): FunctionDefinition[] {
    return this.functions.filter((f) => f.kind === kind);
  }

  /** Fields whose type resolves to ≥1 operator — drops unusable types like `binary`. */
  filterableFields(): FilterDefinition[] {
    return this.fields.filter((f) => this.opsFor(f.type.type).length > 0);
  }

  /** A function's bridged output type — the LHS type when a function is the comparison target. */
  outputGeneric(fn: FunctionDefinition): GenericType {
    return toGeneric(fn.output.types);
  }

  // --- LHS operator resolution ----------------------------------------------

  /**
   * Operators to offer for an LHS of the given resolved type, with the
   * prototype's `any` fallback: a type the catalog doesn't cover borrows
   * `any`'s (permissive) operator set for display. Use for the dropdown.
   */
  operatorsForDisplay(type: GenericType | string): WireOperator[] {
    const ops = this.opsFor(type);
    return ops.length ? ops : this.opsFor('any');
  }

  /**
   * Validator semantics: an operator is valid for a type when the type has no
   * known operator set (permissive — server still validates) or the set
   * includes it. Mirrors the prototype's `if (ops.length && !ops.includes(op))`.
   */
  isOperatorValid(type: GenericType | string, op: WireOperator): boolean {
    const ops = this.opsFor(type);
    return ops.length === 0 || ops.includes(op);
  }
}

/**
 * The container filter type of a field, or null. Container operators
 * (`any_match`, `has_key`, …) resolve against this rather than the generic
 * type. Mirrors the prototype's `containerTypeOf` (minus `union`, which the
 * filter model does not represent).
 */
export function containerFilterType(field: FilterDefinition): ContainerFilterType | null {
  const t = field.type;
  return t.type === 'array' || t.type === 'map' || t.type === 'struct' ? t : null;
}
