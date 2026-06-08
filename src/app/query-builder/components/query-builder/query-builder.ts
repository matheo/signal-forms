import { Component, model } from '@angular/core';
import { MaybeFieldTree, form } from '@angular/forms/signals';
import { LogicalExpression } from '../../models';
import { QbExpression } from '../qb-expression/qb-expression';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.html',
  styleUrl: './query-builder.scss',
  imports: [QbExpression],
})
export class QueryBuilder {
  readonly model = model.required<LogicalExpression>();

  readonly form: MaybeFieldTree<LogicalExpression, string | number> = form(this.model);
}
