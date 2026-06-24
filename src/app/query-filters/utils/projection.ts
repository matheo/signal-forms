import { ConditionOperator, ConditionValue, operatorLabels } from '../../query-builder';
import {
  AstNode,
  Caret,
  ChipStream,
  ChipVm,
  ConditionNode,
  FnNode,
  GroupNode,
  QueryAst,
} from '../models';
import { formatFnArgs } from './fn-codec';

const FIELD_PLACEHOLDER = 'field';
const OP_PLACEHOLDER = ':';
const VALUE_PLACEHOLDER = 'value';

export function operatorLabel(operator: string): string {
  return operatorLabels.get(operator as ConditionOperator) ?? operator;
}

export function valueToText(value: ConditionValue | null): string {
  if (value === null || value === '') {
    return VALUE_PLACEHOLDER;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return typeof value === 'object' ? JSON.stringify(value) : String(value);
}

/** Flatten the AST into an ordered chip stream plus the caret gaps for inserts. */
export function project(ast: QueryAst): ChipStream {
  const chips: ChipVm[] = [];
  const carets: Caret[] = [];
  emitGroup(ast.root, 0, true, chips, carets);
  return { chips, carets };
}

function emitGroup(
  group: GroupNode,
  depth: number,
  isRoot: boolean,
  chips: ChipVm[],
  carets: Caret[],
): void {
  if (group.not) {
    chips.push({
      key: `${group.id}:not`,
      nodeId: group.id,
      kind: 'logical',
      text: 'NOT',
      editable: true,
      depth,
    });
  }

  if (!isRoot) {
    chips.push({
      key: `${group.id}:lparen`,
      nodeId: group.id,
      kind: 'paren-open',
      text: '(',
      editable: false,
      depth,
    });
  }

  const childDepth = isRoot ? depth : depth + 1;
  group.children.forEach((child, i) => {
    if (i > 0) {
      const gap = i - 1; // operators[gap] joins children[gap] and children[gap + 1]
      chips.push({
        key: `${group.id}:op:${gap}`,
        nodeId: group.id,
        kind: 'logical',
        text: (group.operators[gap] ?? 'and').toUpperCase(),
        editable: true,
        depth,
      });
    }
    carets.push({ index: chips.length, contextNodeId: group.id, insertIndex: i });
    emitNode(child, childDepth, chips, carets);
  });
  carets.push({ index: chips.length, contextNodeId: group.id, insertIndex: group.children.length });

  if (!isRoot) {
    chips.push({
      key: `${group.id}:rparen`,
      nodeId: group.id,
      kind: 'paren-close',
      text: ')',
      editable: false,
      depth,
    });
  }
}

function emitNode(node: AstNode, depth: number, chips: ChipVm[], carets: Caret[]): void {
  switch (node.kind) {
    case 'group':
      emitGroup(node, depth, false, chips, carets);
      return;
    case 'condition':
      emitCondition(node, depth, chips);
      return;
    case 'fn':
      emitFn(node, depth, chips);
      return;
  }
}

function emitCondition(node: ConditionNode, depth: number, chips: ChipVm[]): void {
  chips.push({
    key: `${node.id}:field`,
    nodeId: node.id,
    kind: 'cond-field',
    segment: 'field',
    text: node.field || FIELD_PLACEHOLDER,
    editable: true,
    depth,
  });
  chips.push({
    key: `${node.id}:operator`,
    nodeId: node.id,
    kind: 'cond-op',
    segment: 'operator',
    text: node.operator ? operatorLabel(node.operator) : OP_PLACEHOLDER,
    editable: true,
    depth,
  });
  chips.push({
    key: `${node.id}:value`,
    nodeId: node.id,
    kind: 'cond-value',
    segment: 'value',
    text: valueToText(node.value),
    editable: true,
    depth,
  });
}

function emitFn(node: FnNode, depth: number, chips: ChipVm[]): void {
  chips.push({
    key: `${node.id}:fn`,
    nodeId: node.id,
    kind: 'fn',
    text: formatFnArgs(node.args),
    editable: true,
    depth,
  });

  // A function can also participate in a condition (e.g. SUM(x) > 3).
  if (node.operator) {
    chips.push({
      key: `${node.id}:operator`,
      nodeId: node.id,
      kind: 'cond-op',
      segment: 'operator',
      text: operatorLabel(node.operator),
      editable: true,
      depth,
    });
    chips.push({
      key: `${node.id}:value`,
      nodeId: node.id,
      kind: 'cond-value',
      segment: 'value',
      text: valueToText(node.value),
      editable: true,
      depth,
    });
  }
}
