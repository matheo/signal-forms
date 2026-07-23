import {
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { EditorProfile, Suggestion, SuggestionResult } from '../../models';
import { CatalogStore } from '../../services';
import {
  analyzeProfile,
  chipInfo,
  profileErrors,
  suggestFor,
  tokensToHtml,
} from '../../utils';

/**
 * The reusable syntax-highlighting query editor — one `contenteditable` reused
 * across all five grammar profiles (Where / Having / Select / Group By /
 * Order By). Ported from the prototype's `QueryEditor` factory.
 *
 * The element shows a *styled view of the real text*: the analyzer re-tokenizes
 * on every keystroke and {@link tokensToHtml} rebuilds the highlighted markup,
 * with the caret saved and restored around each re-render. A caret-anchored
 * dropdown offers profile-aware suggestions ({@link suggestFor}); validation
 * errors surface only after blur (the user is assumed to complete each chip
 * while typing). Reads the shared {@link CatalogStore} provided by the container,
 * so every section resolves fields/functions/operators against one index.
 */
@Component({
  selector: 'app-query-editor',
  templateUrl: './query-editor.html',
  styleUrl: './query-editor.scss',
  host: { class: 'block' },
})
export class QueryEditor {
  private readonly catalog = inject(CatalogStore);

  /** Which grammar this instance edits (required). */
  readonly profile = input.required<EditorProfile>();
  /** The section text buffer (two-way with the container). */
  readonly value = model('');
  /** Placeholder shown while empty. */
  readonly placeholder = input('');
  /** When true the editor is read-only and dimmed. */
  readonly disabled = input(false);

  private readonly ceRef = viewChild.required<ElementRef<HTMLElement>>('ce');

  /** Errors are gated behind blur — only shown once the field has been "validated". */
  private readonly validated = signal(false);

  /** Re-analyzed on every text or catalog change; drives highlighting + errors. */
  readonly analysis = computed(() =>
    analyzeProfile(this.catalog.index(), this.profile(), this.value()),
  );

  /** Deduplicated errors, surfaced only after blur. */
  readonly errors = computed(() => (this.validated() ? profileErrors(this.analysis()) : []));

  // --- suggestion dropdown state ---------------------------------------------
  readonly sugData = signal<SuggestionResult | null>(null);
  readonly sugSelected = signal(0);
  readonly sugPos = signal<{ left: number; top: number }>({ left: 0, top: 0 });
  /** Flattened suggestion items in display order, for keyboard navigation. */
  private sugFlat: Suggestion[] = [];

  /** Caret offset to restore after the next re-render (set by edits). */
  private pendingCaret: number | null = null;
  /** Re-open suggestions once the pending re-render has landed (after `pick`). */
  private reopenSuggest = false;

  constructor() {
    // Keep the contenteditable's HTML in sync with the analysis, preserving the
    // caret. Runs for user input (via `pendingCaret`) and external value changes.
    effect(() => {
      const ce = this.ceRef().nativeElement;
      const analysis = this.analysis();
      const validated = this.validated();
      const empty = this.value().length === 0;
      const html = tokensToHtml(analysis.analysis.tokens, chipInfo(analysis));

      const focused = typeof document !== 'undefined' && document.activeElement === ce;
      const caret =
        this.pendingCaret != null ? this.pendingCaret : focused ? this.getCaret(ce) : null;

      if (ce.innerHTML !== html) {
        ce.innerHTML = html;
        if (caret != null) this.setCaret(ce, caret);
      }
      this.pendingCaret = null;
      ce.classList.toggle('empty', empty);
      ce.classList.toggle('validated', validated);

      if (this.reopenSuggest) {
        this.reopenSuggest = false;
        this.showSuggest();
      }
    });
  }

  // --- editor events ----------------------------------------------------------

  onInput(): void {
    const ce = this.ceRef().nativeElement;
    this.validated.set(false);
    this.pendingCaret = this.getCaret(ce);
    this.value.set(this.getText(ce));
    this.showSuggest();
  }

  onKeydown(e: KeyboardEvent): void {
    const open = this.sugData() != null;
    if (open && e.key === 'ArrowDown') {
      e.preventDefault();
      this.moveSel(1);
      return;
    }
    if (open && e.key === 'ArrowUp') {
      e.preventDefault();
      this.moveSel(-1);
      return;
    }
    if (open && (e.key === 'Enter' || e.key === 'Tab')) {
      e.preventDefault();
      const it = this.sugFlat[this.sugSelected()];
      if (it) this.pick(it);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault(); // stay a single logical line
      return;
    }
    if (e.key === 'Escape') this.closeSug();
  }

  onKeyup(e: KeyboardEvent): void {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) this.showSuggest();
  }

  onMouseup(): void {
    this.showSuggest();
  }

  onFocus(): void {
    this.validated.set(false);
  }

  onBlur(): void {
    this.validated.set(true);
    // Let a suggestion mousedown resolve before tearing the dropdown down.
    setTimeout(() => this.closeSug(), 150);
  }

  onPaste(e: ClipboardEvent): void {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\s+/g, ' ');
    const ce = this.ceRef().nativeElement;
    const caret = this.getCaret(ce);
    const text = this.getText(ce);
    this.pendingCaret = caret + pasted.length;
    this.value.set(text.slice(0, caret) + pasted + text.slice(caret));
  }

  // --- suggestions ------------------------------------------------------------

  /** Accept a suggestion: replace the typed fragment and reposition the caret. */
  pick(it: Suggestion): void {
    const ce = this.ceRef().nativeElement;
    const caret = this.getCaret(ce);
    const text = this.getText(ce);
    const frag = suggestFor(this.catalog.index(), text, caret, this.profile()).frag || '';
    const start = caret - frag.length;
    this.closeSug();
    this.pendingCaret = start + it.insert.length - (it.caretBack || 0);
    this.reopenSuggest = true;
    this.value.set(text.slice(0, start) + it.insert + text.slice(caret));
    ce.focus();
  }

  private showSuggest(): void {
    if (this.disabled()) {
      this.closeSug();
      return;
    }
    const ce = this.ceRef().nativeElement;
    const text = this.getText(ce);
    const caret = this.getCaret(ce);
    const data = suggestFor(this.catalog.index(), text, caret, this.profile());
    const groups = data.groups.filter((g) => g.items.length);
    if (!groups.length) {
      this.closeSug();
      return;
    }
    this.sugFlat = groups.flatMap((g) => g.items);
    this.sugData.set({ ...data, groups });
    this.sugSelected.set(0);

    const rect = text.length ? this.caretRect() : null;
    const box = ce.getBoundingClientRect();
    let left = rect ? rect.left : box.left + 8;
    const top = (rect ? rect.bottom : box.bottom) + 4;
    left = Math.max(box.left, Math.min(left, window.innerWidth - 262));
    this.sugPos.set({ left, top });
  }

  private closeSug(): void {
    this.sugData.set(null);
    this.sugFlat = [];
  }

  private moveSel(delta: number): void {
    const n = this.sugFlat.length;
    if (!n) return;
    this.sugSelected.set((this.sugSelected() + delta + n) % n);
  }

  /** The flat index of the first item in group `g` (for template selection sync). */
  flatIndex(groupIndex: number, itemIndex: number): number {
    const groups = this.sugData()?.groups ?? [];
    let base = 0;
    for (let i = 0; i < groupIndex; i++) base += groups[i]!.items.length;
    return base + itemIndex;
  }

  // --- caret helpers (contenteditable, char-offset based) ---------------------

  private getText(ce: HTMLElement): string {
    return (ce.textContent ?? '').replace(/ /g, ' ');
  }

  private getCaret(ce: HTMLElement): number {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return 0;
    const r = sel.getRangeAt(0);
    if (!ce.contains(r.endContainer)) return this.getText(ce).length;
    const pre = r.cloneRange();
    pre.selectNodeContents(ce);
    pre.setEnd(r.endContainer, r.endOffset);
    return pre.toString().length;
  }

  private setCaret(ce: HTMLElement, offset: number): void {
    const walk = document.createTreeWalker(ce, NodeFilter.SHOW_TEXT);
    let node: Node | null = null;
    let rem = offset;
    let n: Node | null;
    while ((n = walk.nextNode())) {
      const len = (n.textContent ?? '').length;
      if (rem <= len) {
        node = n;
        break;
      }
      rem -= len;
    }
    const sel = window.getSelection();
    if (!sel) return;
    const r = document.createRange();
    if (node) {
      r.setStart(node, Math.max(0, Math.min(rem, (node.textContent ?? '').length)));
    } else {
      r.selectNodeContents(ce);
      r.collapse(false);
    }
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
  }

  private caretRect(): DOMRect | null {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;
    const r = sel.getRangeAt(0).cloneRange();
    r.collapse(true);
    const rect = r.getClientRects()[0];
    if (rect) return rect;
    // Empty text node: measure via a temporary zero-width marker.
    const marker = document.createElement('span');
    marker.textContent = '​';
    r.insertNode(marker);
    const mrect = marker.getBoundingClientRect();
    marker.remove();
    return mrect;
  }
}
