import { QueryNode } from '../models';

/**
 * Pure AST traversal helpers shared by the store and the view components.
 * Kept separate from parser/printer so both the caret↔node mapping (editor)
 * and structural chip edits (visual) draw from one implementation.
 */

/** Depth-first pre-order visit of every node in the tree. */
export function visit(node: QueryNode | null, fn: (node: QueryNode) => void): void {
  if (!node) return;
  fn(node);
  switch (node.type) {
    case 'logical':
      node.operands.forEach((operand) => visit(operand, fn));
      break;
    case 'not':
    case 'group':
      visit(node.operand, fn);
      break;
    // condition / function are leaves
  }
}

/**
 * Innermost node whose span contains `offset` — the node under the caret.
 * Ties (nested spans sharing an edge) resolve to the smallest span.
 */
export function nodeAt(root: QueryNode | null, offset: number): QueryNode | null {
  let found: QueryNode | null = null;
  let foundWidth = Number.MAX_SAFE_INTEGER;
  visit(root, (node) => {
    const span = node.span;
    if (!span || offset < span.start || offset > span.end) return;
    const width = span.end - span.start;
    if (width <= foundWidth) {
      found = node;
      foundWidth = width;
    }
  });
  return found;
}

/**
 * Structurally replace `target` (matched by reference) with `next`, returning a
 * new tree — object references are refreshed along the path so signal readers
 * re-render. Passing `next = null` prunes the node (and collapses now-empty
 * parents). Returns the (possibly new) root.
 */
export function replaceNode(
  root: QueryNode | null,
  target: QueryNode,
  next: QueryNode | null,
): QueryNode | null {
  if (!root) return root;
  if (root === target) return next;

  switch (root.type) {
    case 'logical': {
      const operands = root.operands
        .map((operand) => replaceNode(operand, target, next))
        .filter((operand): operand is QueryNode => operand !== null);
      if (operands.length === 0) return null;
      if (operands.length === 1) return operands[0]!;
      return { ...root, operands };
    }
    case 'not': {
      const operand = replaceNode(root.operand, target, next);
      return operand ? { ...root, operand } : null;
    }
    case 'group': {
      const operand = replaceNode(root.operand, target, next);
      return operand ? { ...root, operand } : null;
    }
    default:
      return root;
  }
}
