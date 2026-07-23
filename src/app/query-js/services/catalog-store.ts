import { computed, Injectable, signal } from '@angular/core';
import { FilterDefinition, FunctionDefinition } from '../../query-bar';
import { CatalogSource, OperatorCatalog } from '../models';
import { CatalogIndex } from '../utils';

/**
 * Reactive holder for the three static-per-deployment catalogs (fields,
 * functions, operators) that drive v2 autocomplete, operator resolution, and
 * validation.
 *
 * ## Why a store
 * The prototype kept a single mutable `Catalog` global with setters. The
 * Angular-native equivalent is to hold each source catalog in a signal and
 * expose a *derived* {@link CatalogIndex} ({@link index}) rebuilt only when a
 * source changes. Every analyzer / autocomplete function takes a plain
 * `CatalogIndex`, so consumers read `store.index()` inside their own `computed`
 * and stay reactive to catalog changes for free.
 *
 * ## Scope
 * Unlike `QueryBarStore` (per-instance editing state), the catalog is shared,
 * read-only reference data. Provide ONE instance at the v2 editor container
 * (`providers: [CatalogStore]`) so all five section editors — Where, Having,
 * Select, Group By, Order By — share the same index. It could equally live in
 * root if the catalogs are truly app-global.
 */
@Injectable()
export class CatalogStore {
  private readonly _fields = signal<readonly FilterDefinition[]>([]);
  private readonly _functions = signal<readonly FunctionDefinition[]>([]);
  private readonly _operators = signal<OperatorCatalog>([]);

  /** Raw filter-schema fields (`GET /v1/tables/{id}/filter-schema`). */
  readonly fields = this._fields.asReadonly();
  /** Raw function catalog (`GET /v1/functions`). */
  readonly functions = this._functions.asReadonly();
  /** Raw operator catalog (`GET /v1/operators`). */
  readonly operators = this._operators.asReadonly();

  /**
   * The immutable, indexed view every analyzer and the autocomplete layer
   * consume. Recomputed lazily whenever any source catalog changes.
   */
  readonly index = computed<CatalogIndex>(
    () => new CatalogIndex(this._fields(), this._functions(), this._operators()),
  );

  /** Replace all three catalogs at once — the usual entry point after fetching. */
  set(source: Partial<CatalogSource>): void {
    if (source.fields) this._fields.set(source.fields);
    if (source.functions) this._functions.set(source.functions);
    if (source.operators) this._operators.set(source.operators);
  }

  setFields(fields: readonly FilterDefinition[]): void {
    this._fields.set(fields);
  }

  setFunctions(functions: readonly FunctionDefinition[]): void {
    this._functions.set(functions);
  }

  setOperators(operators: OperatorCatalog): void {
    this._operators.set(operators);
  }
}
