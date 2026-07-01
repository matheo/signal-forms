import { Component, effect, inject, model, output, untracked } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { QueryNode } from '../../models';
import { QueryBarMode, QueryBarStore } from '../../services';
import { QbEditor } from '../qb-editor/qb-editor';
import { QbVisual } from '../qb-visual/qb-visual';

/**
 * Two-mode query bar (Visual chips ⇄ editable text) over a single AST model.
 *
 * Owns a component-scoped {@link QueryBarStore} (state per instance). The
 * `query` model two-way-binds the raw text; `astChange` emits the parsed model.
 */
@Component({
  selector: 'app-query-bar',
  templateUrl: './query-bar.html',
  styleUrl: './query-bar.scss',
  host: { class: 'block' },
  providers: [QueryBarStore],
  imports: [QbEditor, QbVisual, MatButtonToggleModule],
})
export class QueryBar {
  private readonly store = inject(QueryBarStore);

  /** Two-way bound raw query text. */
  readonly query = model<string>('');
  /** Emits the parsed AST (the shared JSON model) whenever it changes. */
  readonly astChange = output<QueryNode | null>();

  readonly mode = this.store.mode;
  readonly ast = this.store.ast;
  readonly errors = this.store.errors;
  readonly isParseable = this.store.isParseable;

  constructor() {
    // External query input → store buffer.
    effect(() => {
      const incoming = this.query();
      untracked(() => {
        if (incoming !== this.store.source()) this.store.setSource(incoming);
      });
    });

    // Store buffer/AST → outputs.
    effect(() => {
      const source = this.store.source();
      const ast = this.store.ast();
      untracked(() => {
        if (source !== this.query()) this.query.set(source);
        this.astChange.emit(ast);
      });
    });
  }

  setMode(mode: QueryBarMode): void {
    this.store.setMode(mode);
  }
}
