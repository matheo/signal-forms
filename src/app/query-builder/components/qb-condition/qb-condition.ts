import { Component, input } from '@angular/core';
import { FormField, MaybeFieldTree } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ConditionExpression, Expression } from '../../models';

@Component({
  selector: 'app-qb-condition',
  templateUrl: './qb-condition.html',
  styleUrl: './qb-condition.scss',
  imports: [FormField, MatFormFieldModule, MatInput],
})
export class QbCondition {
  readonly form = input.required<
    MaybeFieldTree<ConditionExpression, number>
  >();
}
