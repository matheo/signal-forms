import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormField, MaybeFieldTree } from '@angular/forms/signals';
import { ConditionExpression, Expression, LogicalExpression } from '../../models';
import { QbCondition } from '../qb-condition/qb-condition';

@Component({
  selector: 'app-qb-expression',
  templateUrl: './qb-expression.html',
  styleUrl: './qb-expression.scss',
  host: {
    class: 'block',
  },
  imports: [
    FormField,
    MatButtonToggleModule,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatMenuModule,
    QbCondition,
    QbExpression,
  ],
})
export class QbExpression {
  readonly form = input.required<
    MaybeFieldTree<LogicalExpression, string | number>
  >();

  readonly addExpression = output<void>();
  readonly addCondition = output<void>();
  readonly doDelete = output<void>();

  isCondition(expression: MaybeFieldTree<Expression, number>): expression is MaybeFieldTree<ConditionExpression, number> {
    const value = expression().value();
    return value && 'field_name' in value;
  }

  isLogical(expression: MaybeFieldTree<Expression, number>): expression is MaybeFieldTree<LogicalExpression, number> {
    const value = expression().value();
    return value && 'expressions' in value;
  }
}
