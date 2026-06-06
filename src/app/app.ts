import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { QbExpression } from './query-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [MatCardModule, QbExpression],
})
export class App {}
