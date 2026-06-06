import { Component } from '@angular/core';
import { QbCondition } from '../qb-condition/qb-condition';

@Component({
  selector: 'app-qb-expression',
  templateUrl: './qb-expression.html',
  styleUrl: './qb-expression.scss',
  imports: [QbCondition],
})
export class QbExpression {}
