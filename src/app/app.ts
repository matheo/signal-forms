import { Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LogicalExpression, LogicalOperator, QbExpression } from './query-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MatCardModule, QbExpression],
})
export class App {
  readonly model = signal<LogicalExpression>({
    not: false,
    operator: LogicalOperator.AND,
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
  })
}
