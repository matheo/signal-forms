import { Component, computed, input, output } from '@angular/core';
import { chipClasses } from '../../constants';
import { ChipVm } from '../../models';

@Component({
  selector: 'app-qf-chip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  host: { class: 'contents' },
})
export class Chip {
  readonly chip = input.required<ChipVm>();
  readonly selected = input(false);

  readonly activate = output<void>();

  protected readonly classes = computed(() => chipClasses(this.chip().kind, this.selected()));
}
