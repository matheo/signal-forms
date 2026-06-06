import { Component, model } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { ConditionExpression, Expression, LogicalExpression } from '../../models';
import { QbCondition } from '../qb-condition/qb-condition';

@Component({
  selector: 'app-qb-expression',
  templateUrl: './qb-expression.html',
  styleUrl: './qb-expression.scss',
  imports: [
    MatButtonToggleModule,
    MatIcon,
    MatIconButton,
    QbCondition,
    QbExpression,
  ],
})
export class QbExpression {
  readonly model = model.required<LogicalExpression>();

  isCondition(expression: Expression): expression is ConditionExpression {
    return expression && 'field_name' in expression;
  }

  isLogical(expression: Expression): expression is LogicalExpression {
    return expression && 'expressions' in expression;
  }
}
