import { Component, model } from '@angular/core';
import { ConditionExpression } from '../../models';

@Component({
  selector: 'app-qb-condition',
  templateUrl: './qb-condition.html',
  styleUrl: './qb-condition.scss',
  imports: [],
})
export class QbCondition {
  readonly model = model.required<ConditionExpression>();
}
