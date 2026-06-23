import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FilterDefinition, LogicalExpression, LogicalOperator, QueryBuilder } from './query-builder';
import { filters } from './app.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [JsonPipe, MatCardModule, QueryBuilder],
})
export class App {
  readonly filters = signal<FilterDefinition[]>(filters);

  readonly model = signal<LogicalExpression>({
    not: false,
    operator: LogicalOperator.OR,
    expressions: [
      {
        field_name: 'Field1',
        operator: 'equal',
        value: 'Value1'
      },
      {
        not: true,
        operator: LogicalOperator.AND,
        expressions: [
          {
            field_name: 'Field2',
            operator: 'notEqual',
            value: 'Value2'
          },
        ]
      }
    ]
  });
}
