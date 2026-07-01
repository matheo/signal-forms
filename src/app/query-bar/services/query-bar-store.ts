import { computed, Injectable, signal } from '@angular/core';
import { ParseError, ParseResult, QueryNode } from '../models';
import { nodeAt, parse, print, replaceNode } from '../utils';

export type QueryBarMode = 'visual' | 'text';

/**
 * Signal-based state holder for a single query bar.
 *
 * ## Single source of truth
 * The canonical, editable state is the raw text buffer ({@link source}). The
 * AST ({@link ast}) is a *derived* value — `parse()` runs once per buffer
 * change and both `ast` and `errors` read from that memoized result. This
 * sidesteps the classic two-way-binding divergence: there is only ever one
 * thing to edit, and the "single JSON model" the two views share is the
 * computed AST.
 *
 * ## Bidirectional sync
 * - **Text mode** edits the buffer verbatim via {@link setSource} — the AST
 *   re-derives live as the user types (partial/invalid states are tolerated).
 * - **Visual mode** edits the model via {@link setAst} / {@link updateAst},
 *   which `print()` the new tree back into the buffer. The buffer then
 *   re-parses, refreshing spans so chips and caret mapping stay consistent.
 *
 * ## Mode gating
 * Switching to Visual is only allowed when the buffer is {@link isParseable}
 * (empty, or a clean parse to a non-null tree) — you can't render chips for
 * text that doesn't parse. Text mode is always reachable.
 *
 * Provide this at the component level (`providers: [QueryBarStore]`) so each
 * `<app-query-bar>` instance owns its state — do NOT provide it in root.
 */
@Injectable()
export class QueryBarStore {
  private readonly _source = signal<string>('');
  private readonly _mode = signal<QueryBarMode>('visual');

  /** Raw editable text buffer — the canonical state. */
  readonly source = this._source.asReadonly();
  /** Active UI mode. */
  readonly mode = this._mode.asReadonly();

  /** Memoized parse of the current buffer — computed once per source change. */
  private readonly parsed = computed<ParseResult>(() => parse(this._source()));

  /** The shared model both views read. Null when the buffer is empty/unparseable. */
  readonly ast = computed<QueryNode | null>(() => this.parsed().ast);
  /** Recoverable parse problems for the current buffer. */
  readonly errors = computed<ParseError[]>(() => this.parsed().errors);

  readonly isEmpty = computed(() => this._source().trim().length === 0);
  /** Whether the buffer can be shown in Visual mode. */
  readonly isParseable = computed(
    () => this.isEmpty() || (this.errors().length === 0 && this.ast() !== null),
  );

  // --- text-mode entry point ------------------------------------------------

  /** Set the raw buffer verbatim (bound to the contenteditable's text). */
  setSource(text: string): void {
    this._source.set(text);
  }

  // --- visual-mode entry points ---------------------------------------------

  /** Replace the whole model; the buffer is re-printed canonically. */
  setAst(node: QueryNode | null): void {
    this._source.set(print(node));
  }

  /** Apply a structural edit to the current tree, then re-print into the buffer. */
  updateAst(mutate: (ast: QueryNode | null) => QueryNode | null): void {
    this.setAst(mutate(this.ast()));
  }

  /** Replace a single node (matched by reference) — the primary chip-edit path. */
  replaceNode(target: QueryNode, next: QueryNode | null): void {
    this.updateAst((ast) => replaceNode(ast, target, next));
  }

  /** The innermost node under a caret offset — feeds text→visual selection sync. */
  nodeAtOffset(offset: number): QueryNode | null {
    return nodeAt(this.ast(), offset);
  }

  // --- mode control ---------------------------------------------------------

  /** Set the mode; refuses to enter Visual when unparseable. Returns success. */
  setMode(mode: QueryBarMode): boolean {
    if (mode === 'visual' && !this.isParseable()) return false;
    this._mode.set(mode);
    return true;
  }

  /** Flip between modes, honoring the Visual-mode parseability gate. */
  toggleMode(): boolean {
    return this.setMode(this._mode() === 'visual' ? 'text' : 'visual');
  }

  /** Reset to an empty buffer. */
  clear(): void {
    this._source.set('');
  }
}
