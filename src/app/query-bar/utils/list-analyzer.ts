import { EditorToken, ListAnalysis, ListItem, ListKind, SortDirection } from '../models';
import { CatalogIndex } from './catalog-index';
import { lexExpr } from './expr-lexer';
import { stripQuotes } from './value-coerce';

/** Whether `w` is a non-empty prefix of `asc` or `desc` (order-by direction typing). */
export function isDirPrefix(w: string): boolean {
  w = w.toLowerCase();
  return !!w && ('asc'.startsWith(w) || 'desc'.startsWith(w));
}

/**
 * List-grammar analyzer for the v2 SELECT / GROUP BY / ORDER BY editors.
 *
 * A comma-separated list of items, each an inline chip. Reuses the shared
 * {@link lexExpr} for column/function items; ORDER BY has its own light scan for
 * the `column[:dir]` / `column dir` forms. Ported from the prototype's
 * `analyzeList` / `validateListItem`, with the mutable `Catalog` global replaced
 * by an injected {@link CatalogIndex}.
 */
export class ListAnalyzer {
  constructor(private readonly catalog: CatalogIndex) {}

  /** Analyze `source` under the given list profile into tokens + items. */
  analyze(source: string, kind: ListKind): ListAnalysis {
    const s = source;
    const tokens: EditorToken[] = [];
    const items: ListItem[] = [];
    const N = s.length;
    let i = 0;
    let cid = 0;

    while (i < N) {
      if (s[i] === ' ') {
        tokens.push({ start: i, end: i + 1, role: 'ws', text: ' ' });
        i++;
        continue;
      }
      if (s[i] === ',') {
        tokens.push({ start: i, end: i + 1, role: 'comma', text: ',' });
        i++;
        continue;
      }

      const item: ListItem = { cid: ++cid, start: i, valid: false, reason: '' };

      if (kind === 'orderby') {
        i = this.scanOrderBy(s, i, item, tokens);
        items.push(item);
        continue;
      }

      const ex = lexExpr(this.catalog, s, i);
      if (!ex) {
        tokens.push({ start: i, end: i + 1, role: 'bad', text: s[i] });
        i++;
        continue;
      }
      const owner = item;
      ex.tokens.forEach((t) => {
        t.compId = owner.cid;
        tokens.push(t);
      });
      item.node = ex.node;
      i = ex.end;

      if (kind === 'select') {
        // optional `as alias` — bareword or quoted (quoted may contain spaces)
        let k = i;
        while (s[k] === ' ') k++;
        const am = /^as\s+("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[A-Za-z_][A-Za-z0-9_]*)/i.exec(s.slice(k));
        if (am) {
          if (k > i) tokens.push({ start: i, end: k, role: 'ws', text: s.slice(i, k), compId: item.cid });
          tokens.push({ start: k, end: k + am[0].length, role: 'alias', text: am[0], compId: item.cid });
          item.alias = stripQuotes(am[1]!);
          i = k + am[0].length;
        }
      }

      this.validateListItem(item, kind);
      items.push(item);
    }

    const compById: Record<number, ListItem> = {};
    items.forEach((it) => (compById[it.cid] = it));
    return { tokens, items, compById };
  }

  /**
   * Scan one ORDER BY item: `column`, `column:dir`, or `column dir`. A trailing
   * word that is a prefix of asc/desc stays in this chip (the suggestion keeps
   * the chip open); anything else is the next column. Returns the new offset.
   */
  private scanOrderBy(s: string, i: number, item: ListItem, tokens: EditorToken[]): number {
    const m = /^[A-Za-z_@][A-Za-z0-9_.]*/.exec(s.slice(i));
    if (!m) {
      tokens.push({ start: i, end: i + 1, role: 'bad', text: s[i] });
      return i + 1;
    }
    const name = m[0];
    let j = i + name.length;
    const known = !!this.catalog.fieldByName(name);
    tokens.push({ start: i, end: j, role: 'field', text: name, known, compId: item.cid });

    let dir: SortDirection = 'asc';
    if (s[j] === ':') {
      const dm = /^:(asc|desc)/i.exec(s.slice(j));
      if (dm) {
        tokens.push({ start: j, end: j + dm[0].length, role: 'dir', text: dm[0], compId: item.cid });
        dir = dm[1]!.toLowerCase() as SortDirection;
        j += dm[0].length;
      } else {
        tokens.push({ start: j, end: j + 1, role: 'bad', text: ':' });
        j++;
      }
    } else {
      let p = j;
      while (s[p] === ' ') p++;
      if (p > j) {
        const wm = /^[A-Za-z]+/.exec(s.slice(p));
        if (wm && isDirPrefix(wm[0])) {
          tokens.push({ start: j, end: p, role: 'ws', text: s.slice(j, p), compId: item.cid });
          tokens.push({ start: p, end: p + wm[0].length, role: 'dir', text: wm[0], compId: item.cid });
          dir = /^(asc|desc)$/i.test(wm[0]) ? (wm[0].toLowerCase() as SortDirection) : 'asc';
          j = p + wm[0].length;
        }
      }
    }

    item.name = name;
    item.direction = dir;
    item.valid = known;
    item.reason = known ? '' : 'unknown field';
    item.node = { t: 'col', name, known };
    return j;
  }

  /** Validate a SELECT / GROUP BY item in place (ORDER BY validates inline in the scan). */
  private validateListItem(item: ListItem, kind: ListKind): void {
    const n = item.node!;
    if (n.t === 'col' && !n.known) {
      item.reason = 'unknown field';
      return;
    }
    if (n.t === 'fn' && !n.fn) {
      item.reason = 'unknown function';
      return;
    }
    if (kind === 'groupby' && n.t !== 'col') {
      item.reason = 'group-by takes columns only';
      return;
    }
    item.valid = true;
  }
}
