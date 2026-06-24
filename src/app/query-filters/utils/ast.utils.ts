import { ConditionValue } from '../../query-builder';
import {
  AstNode,
  ConditionNode,
  FnArgs,
  FnName,
  FnNode,
  GroupNode,
  LogicalConnector,
  NodeId,
  PartialOperator,
  QueryAst,
  isGroup,
} from '../models';

const uid = (): NodeId => crypto.randomUUID();

// --- factories: always mint fresh ids so nodes never share references ---------

export const newCondition = (
  field = '',
  operator: PartialOperator = '',
  value: ConditionValue | null = null,
): ConditionNode => ({ id: uid(), kind: 'condition', field, operator, value });

export const newGroup = (
  children: readonly AstNode[] = [],
  operator: LogicalConnector = 'and',
  not = false,
): GroupNode => ({
  id: uid(),
  kind: 'group',
  not,
  // Seed every gap with the same connector; per-gap edits diverge them later.
  operators: Array.from({ length: Math.max(0, children.length - 1) }, () => operator),
  children,
});

export const newFn = (
  args: FnArgs,
  operator: PartialOperator = '',
  value: ConditionValue | null = null,
): FnNode => ({ id: uid(), kind: 'fn', fn: args.fn as FnName, args, operator, value });

export const newCoalesce = (field1 = '', field2 = '', value = ''): FnNode =>
  newFn({ fn: 'coalesce', field1, field2, value });

export const emptyAst = (): QueryAst => ({ root: newGroup([], 'and') });

// --- structural-sharing mutations --------------------------------------------

/**
 * Replace the node with `id` by `patch(node)`, rebuilding only the spine to it.
 * Untouched subtrees keep their reference identity (no per-level hand-spreading,
 * unlike the legacy query-builder `updateModel` footgun).
 */
export function updateNode(
  ast: QueryAst,
  id: NodeId,
  patch: (node: AstNode) => AstNode,
): QueryAst {
  const root = mapNode(ast.root, id, patch);
  return root === ast.root ? ast : { root: root as GroupNode };
}

function mapNode(node: AstNode, id: NodeId, patch: (node: AstNode) => AstNode): AstNode {
  if (node.id === id) {
    return patch(node);
  }
  if (isGroup(node)) {
    let changed = false;
    const children = node.children.map((child) => {
      const next = mapNode(child, id, patch);
      if (next !== child) {
        changed = true;
      }
      return next;
    });
    return changed ? { ...node, children } : node;
  }
  return node;
}

/**
 * Insert `child` into the group `parentId` at `index`, joined to its new neighbour by
 * `connector` (the gap immediately left of the child, or right of it when inserted first).
 */
export function insertChild(
  ast: QueryAst,
  parentId: NodeId,
  index: number,
  child: AstNode,
  connector: LogicalConnector = 'and',
): QueryAst {
  return updateNode(ast, parentId, (node) => {
    if (!isGroup(node)) {
      return node;
    }
    const at = Math.max(0, Math.min(index, node.children.length));
    const children = [...node.children];
    children.splice(at, 0, child);
    const operators = [...node.operators];
    // A new child adds a gap only when it now has a neighbor. Place the connector to
    // its left (gap `at - 1`), or to its right (gap 0) when it became the first child.
    if (node.children.length > 0) {
      operators.splice(at === 0 ? 0 : at - 1, 0, connector);
    }
    return { ...node, children, operators };
  });
}

/** Remove the node with `id` from wherever it lives (the root cannot be removed). */
export function removeNode(ast: QueryAst, id: NodeId): QueryAst {
  if (ast.root.id === id) {
    return ast;
  }
  const root = pruneNode(ast.root, id);
  return root === ast.root ? ast : { root: root as GroupNode };
}

function pruneNode(node: AstNode, id: NodeId): AstNode {
  if (!isGroup(node)) {
    return node;
  }
  let changed = false;
  const children: AstNode[] = [];
  const operators = [...node.operators];
  node.children.forEach((child, i) => {
    if (child.id === id) {
      changed = true;
      // Drop the gap that joined this child: its left connector, or the right one when first.
      operators.splice(i === 0 ? 0 : i - 1, 1);
      return;
    }
    const next = pruneNode(child, id);
    if (next !== child) {
      changed = true;
    }
    children.push(next);
  });
  return changed ? { ...node, children, operators } : node;
}

// --- lookups -----------------------------------------------------------------

export function findNode(ast: QueryAst, id: NodeId): AstNode | undefined {
  return findIn(ast.root, id);
}

function findIn(node: AstNode, id: NodeId): AstNode | undefined {
  if (node.id === id) {
    return node;
  }
  if (isGroup(node)) {
    for (const child of node.children) {
      const hit = findIn(child, id);
      if (hit) {
        return hit;
      }
    }
  }
  return undefined;
}

/** The nearest enclosing group of `id`, or `undefined` for the root. */
export function findParent(ast: QueryAst, id: NodeId): GroupNode | undefined {
  return findParentIn(ast.root, id);
}

function findParentIn(node: AstNode, id: NodeId): GroupNode | undefined {
  if (!isGroup(node)) {
    return undefined;
  }
  for (const child of node.children) {
    if (child.id === id) {
      return node;
    }
    const hit = findParentIn(child, id);
    if (hit) {
      return hit;
    }
  }
  return undefined;
}

/** Derived id → node index for O(1) lookups (rebuild in a `computed`). */
export function buildIndex(ast: QueryAst): Map<NodeId, AstNode> {
  const index = new Map<NodeId, AstNode>();
  const visit = (node: AstNode): void => {
    index.set(node.id, node);
    if (isGroup(node)) {
      node.children.forEach(visit);
    }
  };
  visit(ast.root);
  return index;
}
