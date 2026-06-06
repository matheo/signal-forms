import { Component } from '@angular/core';
import { QbExpression } from './query-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [QbExpression],
})
export class App {}
