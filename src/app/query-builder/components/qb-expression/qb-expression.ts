import { Component } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { QbCondition } from '../qb-condition/qb-condition';

@Component({
  selector: 'app-qb-expression',
  templateUrl: './qb-expression.html',
  styleUrl: './qb-expression.scss',
  imports: [MatButtonToggleModule, MatIcon, MatIconButton, QbCondition],
})
export class QbExpression {}
