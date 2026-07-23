import {
  ListAnalysis,
  ListItem,
  ListKind,
  OrderByItem,
  SelectFunction,
  SelectItem,
} from '../models';
import { serializeArg } from './expr-serialize';

/**
 * Serialize an analyzed list into the wire SELECT / GROUP BY / ORDER BY shapes.
 * Ported from the prototype's `serializeSelectItem` / `serializeList`.
 *
 * Only *valid* items are emitted; the rest surface as errors via
 * {@link listErrors} (shown on blur).
 */

/**
 * A single SELECT item: a bare column serializes to its name string (an object
 * only when aliased); a function to `{type, name, args, alias?}` — `window_function`
 * for analytic-kind functions, otherwise `function`.
 */
export function serializeSelectItem(item: ListItem): SelectItem {
  const n = item.node!;
  if (n.t === 'col') {
    return item.alias ? { type: 'column', name: n.name, alias: item.alias } : n.name;
  }
  if (n.t === 'fn') {
    const out: SelectFunction = {
      type: n.fn && n.fn.kind === 'analytic' ? 'window_function' : 'function',
      name: n.name,
      args: n.args.map(serializeArg),
    };
    if (item.alias) out.alias = item.alias;
    return out;
  }
  // A literal is never a valid select item; complete the type.
  return String(n.value);
}

/** Serialize all valid items to the profile's wire array (select / groupBy / orderBy). */
export function serializeList(analysis: ListAnalysis, kind: 'select'): SelectItem[];
export function serializeList(analysis: ListAnalysis, kind: 'groupby'): string[];
export function serializeList(analysis: ListAnalysis, kind: 'orderby'): OrderByItem[];
export function serializeList(
  analysis: ListAnalysis,
  kind: ListKind,
): SelectItem[] | string[] | OrderByItem[];
export function serializeList(
  analysis: ListAnalysis,
  kind: ListKind,
): SelectItem[] | string[] | OrderByItem[] {
  const good = analysis.items.filter((it) => it.valid);
  if (kind === 'select') return good.map(serializeSelectItem);
  if (kind === 'groupby') {
    return good.map((it) => (it.node && it.node.t === 'col' ? it.node.name : it.name ?? ''));
  }
  return good.map((it) => ({ column: it.name ?? '', direction: it.direction ?? 'asc' }));
}

/** All distinct error reasons across the invalid items — the blur summary. */
export function listErrors(analysis: ListAnalysis): string[] {
  return analysis.items.filter((it) => !it.valid && it.reason).map((it) => it.reason);
}
