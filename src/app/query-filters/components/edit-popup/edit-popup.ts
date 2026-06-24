import { Component, input, output } from '@angular/core';
import { FilterDefinition } from '../../../query-builder';
import { CoalesceModel, EditMode, SuggestionItem } from '../../models';
import { CoalesceEditor } from '../coalesce-editor/coalesce-editor';
import { SuggestionList } from '../suggestion-list/suggestion-list';

@Component({
  selector: 'app-qf-edit-popup',
  templateUrl: './edit-popup.html',
  styleUrl: './edit-popup.scss',
  host: { class: 'block' },
  imports: [CoalesceEditor, SuggestionList],
})
export class EditPopup {
  readonly mode = input.required<EditMode>();
  readonly filters = input.required<FilterDefinition[]>();
  /** True/false options for boolean value editing (the only `edit-value` shown in the popup). */
  readonly booleanOptions = input<SuggestionItem[]>([]);
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
}
