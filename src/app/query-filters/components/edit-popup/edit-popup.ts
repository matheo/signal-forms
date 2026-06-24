import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FilterDefinition, operatorLabels } from '../../../query-builder';
import { operatorsForFilter } from '../../constants';
import { CoalesceModel, EditMode, SuggestionItem } from '../../models';
import { CoalesceEditor } from '../coalesce-editor/coalesce-editor';
import { SuggestionList } from '../suggestion-list/suggestion-list';

@Component({
  selector: 'app-qf-edit-popup',
  templateUrl: './edit-popup.html',
  styleUrl: './edit-popup.scss',
  host: { class: 'block' },
  imports: [MatButtonModule, CoalesceEditor, SuggestionList],
})
export class EditPopup {
  readonly mode = input.required<EditMode>();
  readonly filters = input.required<FilterDefinition[]>();
  /** The FilterDefinition of the active node (for operator suggestions / value typing). */
  readonly contextFilter = input<FilterDefinition | null>(null);
  readonly initialValue = input('');
  readonly initialCoalesce = input.required<CoalesceModel>();
  /** Inline suggestions (fields, plus logical/grouping when at a caret), already filtered
   * by the bar input. The query + keyboard nav are owned by the inline input in the bar. */
  readonly inlineSuggestions = input<SuggestionItem[]>([]);
  readonly inlineActiveIndex = input(0);

  readonly pickOperator = output<string>();
  readonly commitValue = output<string>();
  readonly commitCoalesce = output<CoalesceModel>();
  readonly inlineSelect = output<string>();
  readonly inlineActiveIndexChange = output<number>();
  readonly cancel = output<void>();

  protected readonly operatorSuggestions = computed<SuggestionItem[]>(() => {
    const filter = this.contextFilter();
    if (!filter) {
      return [];
    }
    return operatorsForFilter(filter).map((op) => ({
      value: op,
      label: operatorLabels.get(op) ?? op,
      hint: op,
    }));
  });

  protected readonly valueText = linkedSignal(() => this.initialValue());

  protected onValueKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.commitValue.emit(this.valueText());
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancel.emit();
    }
  }
}
