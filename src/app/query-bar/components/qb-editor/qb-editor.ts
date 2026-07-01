import { Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { QueryBarStore } from '../../services';
import { highlight } from '../../utils';

/**
 * Editable (Text) mode: a true `contenteditable` whose text mirrors the store
 * buffer, re-colorized into per-token `<span>`s on every change.
 *
 * The DOM is a *projection* of `store.source`, not a competing source of truth:
 * - view → store: `input` reads `textContent` and calls `setSource` (one way).
 * - store → view: an effect re-renders highlighted HTML, preserving the caret
 *   as a plain character offset (survives re-highlighting since it's measured
 *   against text, not DOM nodes).
 */
@Component({
  selector: 'app-qb-editor',
  templateUrl: './qb-editor.html',
  styleUrl: './qb-editor.scss',
  host: { class: 'block' },
})
export class QbEditor {
  private readonly store = inject(QueryBarStore);
  private readonly editable = viewChild.required<ElementRef<HTMLDivElement>>('editable');

  constructor() {
    effect(() => {
      const source = this.store.source();
      const el = this.editable().nativeElement;
      const caret = captureCaret(el);
      render(el, source);
      if (caret !== null) restoreCaret(el, caret);
    });
  }

  onInput(): void {
    this.store.setSource(this.editable().nativeElement.textContent ?? '');
  }
}

/** Rebuild the editable's inner HTML from colorized segments. */
function render(el: HTMLElement, source: string): void {
  el.innerHTML = highlight(source)
    .map((seg) =>
      seg.kind === 'whitespace'
        ? escapeHtml(seg.text)
        : `<span class="seg seg--${seg.kind}">${escapeHtml(seg.text)}</span>`,
    )
    .join('');
}

/** Caret position as a character offset into `textContent`, or null if unfocused. */
function captureCaret(el: HTMLElement): number | null {
  const selection = document.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!el.contains(range.endContainer)) return null;

  const pre = range.cloneRange();
  pre.selectNodeContents(el);
  pre.setEnd(range.endContainer, range.endOffset);
  return pre.toString().length;
}

/** Place the caret at the given character offset within the (re-rendered) element. */
function restoreCaret(el: HTMLElement, offset: number): void {
  const selection = document.getSelection();
  if (!selection) return;

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node = walker.nextNode();
  while (node) {
    const length = node.textContent?.length ?? 0;
    if (remaining <= length) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= length;
    node = walker.nextNode();
  }

  // Offset past the end (or empty content): collapse to the end.
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
