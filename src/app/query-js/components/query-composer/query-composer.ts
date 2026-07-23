import { Component, computed, effect, inject, input, model, output, untracked } from '@angular/core';
import { FilterDefinition, FunctionDefinition } from '../../../query-bar';
import {
  CatalogSource,
  OperatorCatalog,
  QueryDefinition,
} from '../../models';
import { CatalogStore } from '../../services';
import { analyzeAll, assembleQuery, nonGroupedSelectColumns } from '../../utils';
import { QueryEditor } from '../query-editor/query-editor';

/**
 * v2 query composer — the container for the five section editors (Where,
 * Having, Select, Group By, Order By) that together produce one
 * {@link QueryDefinition}.
 *
 * Owns a component-scoped {@link CatalogStore} (`providers`), fed from the three
 * catalog inputs, so every section shares one immutable `CatalogIndex`. Each
 * section is a raw text buffer today; the next stage swaps the textareas for the
 * reusable `<app-query-editor>` contenteditable without changing this wiring.
 *
 * The assembled payload and per-section errors are pure derivations
 * ({@link analyzeAll} → {@link assembleQuery}) recomputed on every keystroke.
 */
@Component({
  selector: 'app-query-composer',
  templateUrl: './query-composer.html',
  styleUrl: './query-composer.scss',
  host: { class: 'block' },
  providers: [CatalogStore],
  imports: [QueryEditor],
})
export class QueryComposer {
  private readonly catalog = inject(CatalogStore);

  // --- catalog inputs (static per deployment) -------------------------------
  readonly fields = input<readonly FilterDefinition[]>([]);
  readonly functions = input<readonly FunctionDefinition[]>([]);
  readonly operators = input<OperatorCatalog>([]);

  // --- section buffers (two-way) --------------------------------------------
  readonly where = model('');
  readonly having = model('');
  readonly select = model('');
  readonly groupBy = model('');
  readonly orderBy = model('');

  /** Emits the assembled query on every change. */
  readonly queryChange = output<QueryDefinition>();

  /** All five analyses, recomputed together per keystroke against the catalog. */
  private readonly analyses = computed(() =>
    analyzeAll(this.catalog.index(), {
      where: this.where(),
      having: this.having(),
      select: this.select(),
      groupby: this.groupBy(),
      orderby: this.orderBy(),
    }),
  );

  /** The live, assembled payload — only valid parts of each section. */
  readonly query = computed(() => assembleQuery(this.analyses()));

  /** Non-aggregate select columns missing from group-by (live server-rule warning). */
  readonly groupByGaps = computed(() => nonGroupedSelectColumns(this.analyses()));

  /** Having is only meaningful once a group-by exists. */
  readonly havingEnabled = computed(() => this.groupBy().trim().length > 0);

  constructor() {
    // Catalog inputs → shared store.
    effect(() => {
      const src: Partial<CatalogSource> = {
        fields: this.fields(),
        functions: this.functions(),
        operators: this.operators(),
      };
      untracked(() => this.catalog.set(src));
    });

    // Assembled payload → output.
    effect(() => {
      const q = this.query();
      untracked(() => this.queryChange.emit(q));
    });
  }
}
