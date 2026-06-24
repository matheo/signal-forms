import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { form, FormField } from '@angular/forms/signals';
import { FilterDefinition } from '../../../query-builder';
import { CoalesceModel } from '../../models';

@Component({
  selector: 'app-qf-coalesce-editor',
  templateUrl: './coalesce-editor.html',
  styleUrl: './coalesce-editor.scss',
  host: { class: 'block' },
  imports: [FormField, MatAutocompleteModule, MatButtonModule, MatFormFieldModule, MatInput],
})
export class CoalesceEditor {
  readonly filters = input.required<FilterDefinition[]>();
  readonly initial = input.required<CoalesceModel>();

  readonly commitArgs = output<CoalesceModel>();
  readonly cancel = output<void>();

  /**
   * Local Signal Forms state. The value field is keyed `compareTo` (not `value`)
   * because `value` collides with the reserved `FieldTree.value` accessor.
   */
  protected readonly state = linkedSignal(() => {
    const { field1, field2, value } = this.initial();
    return { field1, field2, compareTo: value };
  });
  protected readonly form = form(this.state);

  protected readonly field1Options = computed(() => this.matchFields(this.state().field1));
  protected readonly field2Options = computed(() => this.matchFields(this.state().field2));

  private matchFields(query: string): FilterDefinition[] {
    const q = (query ?? '').trim().toLowerCase();
    const list = this.filters();
    if (!q) {
      return list.slice(0, 20);
    }
    return list
      .filter((f) => f.field.toLowerCase().includes(q) || f.label.toLowerCase().includes(q))
      .slice(0, 20);
  }

  protected commit(): void {
    const { field1, field2, compareTo } = this.state();
    this.commitArgs.emit({ field1, field2, value: compareTo });
  }
}
