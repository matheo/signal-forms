import {
  Component,
  ElementRef,
  computed,
  effect,
  input,
  model,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { SuggestionItem } from '../../models';

@Component({
  selector: 'app-qf-suggestion-list',
  templateUrl: './suggestion-list.html',
  styleUrl: './suggestion-list.scss',
  host: { class: 'block' },
})
export class SuggestionList {
  readonly items = input.required<SuggestionItem[]>();
  readonly placeholder = input('Search…');
  /** When false the built-in search box is hidden and `items` are shown as-is — the
   * query + keyboard nav are owned externally (e.g. the inline caret input in the bar). */
  readonly showSearch = input(true);

  readonly select = output<string>();
  readonly cancel = output<void>();

  protected readonly query = signal('');
  /** A `model` so the parent can drive/observe the highlight when `showSearch` is off. */
  readonly activeIndex = model(0);

  private readonly optionEls = viewChildren<ElementRef<HTMLElement>>('optionEl');

  constructor() {
    // Keep the highlighted option visible as the active index moves (arrow-key nav).
    effect(() => {
      this.optionEls()[this.activeIndex()]?.nativeElement.scrollIntoView({ block: 'nearest' });
    });
  }

  protected readonly filtered = computed(() => {
    if (!this.showSearch()) {
      return this.items(); // externally pre-filtered
    }
    const q = this.query().trim().toLowerCase();
    const items = this.items();
    if (!q) {
      return items;
    }
    return items.filter(
      (it) => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q),
    );
  });

  protected onInput(value: string): void {
    this.query.set(value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const items = this.filtered();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        event.preventDefault();
        const item = items[this.activeIndex()];
        if (item) {
          this.select.emit(item.value);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.cancel.emit();
        break;
    }
  }
}
