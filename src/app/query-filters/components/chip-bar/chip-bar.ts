import { Component, computed, input, output } from '@angular/core';
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

  readonly chipActivate = output<ChipVm>();
  readonly caretActivate = output<Caret>();

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
