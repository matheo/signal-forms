import {
  BoolAnalysis,
  BoolMode,
  BoolTree,
  Comparison,
  FieldRef,
  FunctionRef,
  HavingNode,
  WhereGroup,
  WhereNode,
} from '../models';
import { serializeArg } from './expr-serialize';

/**
 * Serialize an analyzed boolean tree into the wire {@link WhereNode} /
 * {@link HavingNode} shapes. Ported from the prototype's `leafField` /
 * `toWhere` / `toHaving` / `whereErrors`.
 *
 * Only *valid* comparison leaves are emitted; incomplete/invalid ones are
 * dropped (they surface as errors via {@link boolErrors}, shown on blur). The
 * tree is pure data, so these serializers need no catalog.
 */

/** The comparison LHS as a wire {@link FieldRef}: a column name or a function ref. */
function leafField(comp: Comparison, mode: BoolMode): FieldRef {
  const lhs = comp.lhs;
  if (lhs.t === 'fn') {
    return {
      type: mode === 'having' ? 'agg_function' : 'function',
      name: lhs.name,
      args: lhs.args.map(serializeArg),
    };
  }
  if (lhs.t === 'col') return lhs.name;
  // A literal LHS never survives validation (only col/fn do); complete the type.
  return String(lhs.value);
}

/** Whether a serialized WHERE node is a group (vs. a bare rule). */
function isWhereGroup(node: WhereNode): node is WhereGroup {
  return 'condition' in node;
}

/**
 * Serialize a boolean tree to a WHERE node, or null when nothing valid remains.
 * A lone comparison returns a bare {@link WhereRule}; callers that need the
 * always-a-group form should use {@link toWhereGroup}.
 */
export function toWhere(node: BoolTree | null): WhereNode | null {
  if (!node || node.t === 'empty') return null;
  if (node.t === 'leaf') {
    return node.comp.valid
      ? { field: leafField(node.comp, 'where'), operator: node.comp.opCanon!, value: node.comp.value! }
      : null;
  }
  if (node.t === 'group') return toWhere(node.kid);
  if (node.t === 'not') {
    const inner = toWhere(node.kid);
    if (!inner) return null;
    if (isWhereGroup(inner)) return { ...inner, not: !inner.not };
    return { condition: 'and', not: true, rules: [inner] };
  }
  const rules = node.kids.map(toWhere).filter((r): r is WhereNode => !!r);
  if (!rules.length) return null;
  if (rules.length === 1) return rules[0];
  return { condition: node.t, not: false, rules };
}

/**
 * Serialize to a WHERE group, wrapping a lone comparison in `{condition: 'and',
 * not: false, rules: [rule]}` — the API always expects a logical node here (see
 * `filter-ui-v2.md`). Returns null when the tree yields nothing valid.
 */
export function toWhereGroup(node: BoolTree | null): WhereGroup | null {
  const w = toWhere(node);
  if (!w) return null;
  return isWhereGroup(w) ? w : { condition: 'and', not: false, rules: [w] };
}

/**
 * Serialize a boolean tree to a HAVING node. HAVING's wrapper uses the
 * `operator`/`expressions` spelling, `NOT` is dropped (unsupported server-side),
 * and a bare comparison is a valid root (no wrapping needed).
 */
export function toHaving(node: BoolTree | null): HavingNode | null {
  if (!node || node.t === 'empty') return null;
  if (node.t === 'leaf') {
    return node.comp.valid
      ? { field: havingField(node.comp), operator: node.comp.opCanon!, value: node.comp.value! }
      : null;
  }
  if (node.t === 'group') return toHaving(node.kid);
  if (node.t === 'not') return toHaving(node.kid);
  const expressions = node.kids.map(toHaving).filter((e): e is HavingNode => !!e);
  if (!expressions.length) return null;
  if (expressions.length === 1) return expressions[0];
  return { operator: node.t, expressions };
}

/** All distinct error reasons across the invalid comparisons — the blur summary. */
export function boolErrors(analysis: BoolAnalysis): string[] {
  return Object.values(analysis.compById)
    .filter((c) => !c.valid && c.reason)
    .map((c) => c.reason!);
}

/**
 * A HAVING leaf's LHS as an aggregate {@link FunctionRef}. A valid HAVING
 * comparison always has an aggregate-function LHS (enforced by `finalizeComp`);
 * the non-function fallback is unreachable but keeps the return type total.
 */
function havingField(comp: Comparison): FunctionRef {
  const lhs = comp.lhs;
  return {
    type: 'agg_function',
    name: lhs.t === 'fn' ? lhs.name : lhs.t === 'col' ? lhs.name : String(lhs.value),
    args: lhs.t === 'fn' ? lhs.args.map(serializeArg) : [],
  };
}
