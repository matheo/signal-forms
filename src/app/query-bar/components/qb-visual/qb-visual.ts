import { Component, inject, input } from '@angular/core';
import { operatorLabels } from '../../constants';
import {
  ConditionNode,
  ConditionOperator,
  FunctionNode,
  GroupNode,
  IdentifierArg,
  LiteralValue,
  LogicalNode,
  NotNode,
  QueryNode,
} from '../../models';
import { QueryBarStore } from '../../services';

/**
 * Visual mode: renders the AST as color-coded, interactive chips. Recurses on
 * itself (a component is always in scope of its own template) to walk the tree.
 * Structural edits go through the shared {@link QueryBarStore}, which re-prints
 * the tree back into the text buffer.
 */
@Component({
  selector: 'app-qb-visual',
  templateUrl: './qb-visual.html',
  styleUrl: './qb-visual.scss',
  host: { class: 'qb-visual' },
})
export class QbVisual {
  private readonly store = inject(QueryBarStore);
  readonly node = input.required<QueryNode>();

  // Narrowing helpers — the `type` discriminant guarantees each cast's safety.
  asLogical(node: QueryNode): LogicalNode {
    return node as LogicalNode;
  }
  asNot(node: QueryNode): NotNode {
    return node as NotNode;
  }
  asGroup(node: QueryNode): GroupNode {
    return node as GroupNode;
  }
  asCondition(node: QueryNode): ConditionNode {
    return node as ConditionNode;
  }
  asFunction(node: QueryNode): FunctionNode {
    return node as FunctionNode;
  }

  operatorLabel(operator: ConditionOperator): string {
    return operatorLabels.get(operator) ?? operator;
  }

  conditionValues(node: ConditionNode): string[] {
    if (node.value === undefined) return [];
    const values = Array.isArray(node.value) ? node.value : [node.value];
    return values.map(formatLiteral);
  }

  argText(arg: IdentifierArg | LiteralValue): string {
    return arg.type === 'identifier' ? arg.name : formatLiteral(arg);
  }

  remove(node: QueryNode): void {
    this.store.replaceNode(node, null);
  }
}

function formatLiteral(value: LiteralValue): string {
  return value.type === 'string' ? `'${value.value}'` : String(value.value);
}
