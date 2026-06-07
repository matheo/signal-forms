import { Component, inject, input } from '@angular/core';
import { LogicalExpression } from '../../models';
import { ExpressionsStore } from '../../state';
import { QbExpression } from '../qb-expression/qb-expression';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.html',
  styleUrl: './query-builder.scss',
  imports: [QbExpression],
  providers: [ExpressionsStore],
})
export class QueryBuilder {
  readonly #store = inject(ExpressionsStore);

  readonly expressions = input.required<LogicalExpression, LogicalExpression>({
    transform: (value) => {
      this.#store.init(value);
      return value;
    },
  });

  readonly model = this.#store.model;
}
