import { Component, input, linkedSignal, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FilterDefinition } from '../../../query-builder';
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
  readonly initialValue = input('');
  readonly initialCoalesce = input.required<CoalesceModel>();
  /** Inline suggestions (fields/operators, plus logical/grouping when at a caret), already
   * filtered by the bar input. The query + keyboard nav are owned by the inline bar input. */
  readonly inlineSuggestions = input<SuggestionItem[]>([]);
  readonly inlineActiveIndex = input(0);

  readonly commitValue = output<string>();
  readonly commitCoalesce = output<CoalesceModel>();
  readonly inlineSelect = output<string>();
  readonly inlineActiveIndexChange = output<number>();
  readonly cancel = output<void>();

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
