import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FilterDefinition, LogicalExpression, LogicalOperator } from './query-builder';
import { FunctionDefinition, OperatorCatalog, QueryComposer, QueryDefinition } from './query-bar';
import { filters } from './app.filters';
import { functions } from './app.functions';
import { operators } from './app.operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [JsonPipe, MatCardModule, QueryComposer],
})
export class App {
  readonly filters = signal<FilterDefinition[]>(filters);
  readonly functions = signal<FunctionDefinition[]>(functions);
  readonly operators = signal<OperatorCatalog>(operators);

  /** Latest assembled query emitted by the v2 composer. */
  readonly query = signal<QueryDefinition>({});

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
