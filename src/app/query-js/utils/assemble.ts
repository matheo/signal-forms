import { BoolAnalysis, ListAnalysis, QueryDefinition } from '../models';
import { BoolAnalyzer } from './bool-analyzer';
import { toHaving, toWhereGroup } from './bool-serialize';
import { CatalogIndex } from './catalog-index';
import { ListAnalyzer } from './list-analyzer';
import { serializeList } from './list-serialize';

/**
 * Cross-section assembly: run the five per-profile analyzers and combine their
 * results into the single {@link QueryDefinition} the query API accepts.
 *
 * This is the one place the five independent pipelines meet, so it stays pure
 * and framework-free (the container component just wraps it in a `computed`).
 * Mirrors the prototype's `refresh()` payload assembly (see `filter-ui-v2.md`
 * "Assembled payload"): keys are emitted only when non-empty; `where` is always
 * a {@link import('../models').WhereGroup} (lone comparison wrapped); `having`
 * is suppressed unless a group-by exists.
 */

/** The five section text buffers, one per profile. */
export interface QuerySources {
  where: string;
  having: string;
  select: string;
  groupby: string;
  orderby: string;
}

/** The five analyses, produced together by {@link analyzeAll}. */
export interface QueryAnalyses {
  where: BoolAnalysis;
  having: BoolAnalysis;
  select: ListAnalysis;
  groupby: ListAnalysis;
  orderby: ListAnalysis;
}

/** Analyze every section buffer under its profile against the shared catalog. */
export function analyzeAll(catalog: CatalogIndex, src: QuerySources): QueryAnalyses {
  const bool = new BoolAnalyzer(catalog);
  const list = new ListAnalyzer(catalog);
  return {
    where: bool.analyze(src.where, 'where'),
    having: bool.analyze(src.having, 'having'),
    select: list.analyze(src.select, 'select'),
    groupby: list.analyze(src.groupby, 'groupby'),
    orderby: list.analyze(src.orderby, 'orderby'),
  };
}

/** Combine pre-computed analyses into the submitted query payload. */
export function assembleQuery(a: QueryAnalyses): QueryDefinition {
  const payload: QueryDefinition = {};

  const select = serializeList(a.select, 'select');
  if (select.length) payload.select = select;

  const where = toWhereGroup(a.where.tree);
  if (where) payload.where = where;

  const groupBy = serializeList(a.groupby, 'groupby');
  if (groupBy.length) payload.groupBy = groupBy;

  // Having only applies when grouping — suppressed otherwise.
  if (groupBy.length) {
    const having = toHaving(a.having.tree);
    if (having) payload.having = having;
  }

  const orderBy = serializeList(a.orderby, 'orderby');
  if (orderBy.length) payload.orderBy = orderBy;

  return payload;
}

/**
 * Non-aggregate select columns that are absent from group-by — the live
 * server-rule warning ("every non-aggregate select item must be grouped").
 * Empty when there is no group-by. Mirrors the prototype's `groupby-warn`.
 */
export function nonGroupedSelectColumns(a: QueryAnalyses): string[] {
  const grouped = new Set(serializeList(a.groupby, 'groupby'));
  if (!grouped.size) return [];
  const missing: string[] = [];
  for (const item of a.select.items) {
    if (item.valid && item.node && item.node.t === 'col' && !grouped.has(item.node.name)) {
      missing.push(item.node.name);
    }
  }
  return missing;
}
