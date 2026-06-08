import { Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { FormField, MaybeFieldTree } from '@angular/forms/signals';
import { ConditionExpression, Expression, LogicalExpression } from '../../models';
import { QbCondition } from '../qb-condition/qb-condition';

@Component({
  selector: 'app-qb-expression',
  templateUrl: './qb-expression.html',
  styleUrl: './qb-expression.scss',
  imports: [
    FormField,
    MatButtonToggleModule,
    MatIcon,
    MatIconButton,
    QbCondition,
    QbExpression,
  ],
})
export class QbExpression {
  readonly form = input.required<
    MaybeFieldTree<LogicalExpression, string | number>
  >();

  isCondition(expression: MaybeFieldTree<Expression, number>): expression is MaybeFieldTree<ConditionExpression, number> {
    const value = expression().value();
    return value && 'field_name' in value;
  }

  isLogical(expression: MaybeFieldTree<Expression, number>): expression is MaybeFieldTree<LogicalExpression, number> {
    const value = expression().value();
    return value && 'expressions' in value;
  }
}
