import { Component, ElementRef, computed, effect, input, output, viewChild } from '@angular/core';
import { Caret, ChipStream, ChipVm } from '../../models';
import { Chip } from '../chip/chip';

type BarItem =
  | { readonly kind: 'chip'; readonly key: string; readonly chip: ChipVm }
  | { readonly kind: 'caret'; readonly key: string; readonly caret: Caret };

@Component({
  selector: 'app-qf-chip-bar',
  templateUrl: './chip-bar.html',
  styleUrl: './chip-bar.scss',
  host: { class: 'block' },
  imports: [Chip],
})
export class ChipBar {
  readonly stream = input.required<ChipStream>();
  readonly selectedKey = input<string | null>(null);
  readonly activeCaret = input<Caret | null>(null);
  /** Text typed into the active caret's inline input (driven by the parent). */
  readonly draft = input('');

  readonly chipActivate = output<ChipVm>();
  readonly caretActivate = output<Caret>();
  readonly caretInput = output<string>();
  readonly caretKeydown = output<KeyboardEvent>();

  private readonly caretInputEl = viewChild<ElementRef<HTMLInputElement>>('caretInputEl');

  constructor() {
    // Focus the inline input the moment it appears (the viewChild ref only changes
    // when the element is created/destroyed, not on each keystroke — so this runs once).
    effect(() => {
      const el = this.caretInputEl()?.nativeElement;
      if (el) {
        el.focus();
        const end = el.value.length;
        el.setSelectionRange(end, end);
      }
    });
  }

  /** Interleave chips with the caret gaps so the cursor can sit between chips. */
  protected readonly items = computed<BarItem[]>(() => {
    const { chips, carets } = this.stream();
    const out: BarItem[] = [];
    for (let i = 0; i <= chips.length; i++) {
      for (const caret of carets) {
        if (caret.index === i) {
          out.push({ kind: 'caret', key: `caret:${caret.contextNodeId}:${caret.insertIndex}`, caret });
        }
      }
      const chip = chips[i];
      if (chip) {
        out.push({ kind: 'chip', key: chip.key, chip });
      }
    }
    return out;
  });

  protected isActiveCaret(caret: Caret): boolean {
    const active = this.activeCaret();
    return (
      !!active &&
      active.contextNodeId === caret.contextNodeId &&
      active.insertIndex === caret.insertIndex
    );
  }
}
