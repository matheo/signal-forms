import { Component, input, output } from '@angular/core';
import { FormField, MaybeFieldTree } from '@angular/forms/signals';
import { MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ConditionExpression } from '../../models';

@Component({
  selector: 'app-qb-condition',
  templateUrl: './qb-condition.html',
  styleUrl: './qb-condition.scss',
  imports: [
    FormField,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatInput,
  ],
})
export class QbCondition {
  readonly form = input.required<
    MaybeFieldTree<ConditionExpression, number>
  >();

  readonly doDelete = output<void>();
}
