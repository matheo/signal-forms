import { Component, input, model } from '@angular/core';
import { MaybeFieldTree, form } from '@angular/forms/signals';
import { FilterDefinition, LogicalExpression } from '../../models';
import { newCondition, newExpression } from '../../utils';
import { QbExpression } from '../qb-expression/qb-expression';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.html',
  styleUrl: './query-builder.scss',
  imports: [QbExpression],
})
export class QueryBuilder {
  readonly filters = input.required<FilterDefinition[]>();
  readonly model = model.required<LogicalExpression>();

  readonly form: MaybeFieldTree<LogicalExpression, string | number> = form(this.model);

  addExpression(path: number[]) {
    this.updateModel(
      path,
      (expr) => {
        expr.expressions = [...expr.expressions, newExpression()];
        return expr;
      },
    );
  }

  addCondition(path: number[]) {
    this.updateModel(
      path,
      (expr) => {
        expr.expressions = [...expr.expressions, newCondition()];
        return expr;
      },
    );
  }

  doDelete(path: number[]) {
    const remove = path.pop();

    this.updateModel(
      path,
      (expr) => {
        expr.expressions = [
          ...expr.expressions.filter((_, i) => i !== remove),
        ];
        return expr;
      },
    );
  }

  private updateModel(
    path: number[],
    callback: (model: LogicalExpression) => LogicalExpression,
  ) {
    this.model.update((root) => {
      const indexes = path.filter((index) => index !== -1);

      if (indexes.length) {
        let model = root;

        indexes.forEach((i, current) => {
          model.expressions = [...model.expressions]; // refresh items ref
          if (current === indexes.length - 1) { // isLast
            // refresh node ref
            model.expressions[i] = {
              ...callback(model.expressions[i] as LogicalExpression)
            };
          } else {
            model.expressions[i] = { ...model.expressions[i] }; // refresh node ref
            model = model.expressions[i] as LogicalExpression;
          }
        });

        return { ...root };
      }

      return { ...callback(root) }; // refresh node ref
    });
  }
}
