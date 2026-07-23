import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FilterDefinition, LogicalExpression, LogicalOperator } from './query-builder';
import { FunctionDefinition } from './query-bar';
import { QueryFilters } from "./query-filters";
import { filters } from './app.filters';
import { functions } from './app.functions';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [JsonPipe, MatCardModule, QueryFilters],
})
export class App {
  readonly filters = signal<FilterDefinition[]>(filters);
  readonly functions = signal<FunctionDefinition[]>(functions);

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
          {
            field_name: 'COALESCE',
            operator: 'equal',
            value: {
              field_name: 'serial_number',
              field_default: 'sn',
              value: 'unknown',
            },
          },
        ]
      }
    ]
  });
}
