import { EditorToken, EditorTokenRole } from '../models';

/**
 * Pure `EditorToken[]` → HTML renderer for the v2 contenteditable editor.
 *
 * The editor is a *styled view of the real text*: every token becomes an inline
 * `<span>` whose text is exactly what the user typed, so the caret still walks
 * character-by-character. Consecutive tokens sharing a `compId` are wrapped in a
 * `.chip` (an inline comparison / list item) that can be flagged invalid once the
 * field is validated. Ported from the prototype's `ROLE_CLASS` / `tokenHtml` /
 * `highlight`, kept framework-free so it stays harness-testable.
 */

/** Token role → CSS class (empty for whitespace, which renders as bare text). */
export const ROLE_CLASS: Record<EditorTokenRole, string> = {
  field: 't-field',
  func: 't-func',
  op: 't-op',
  str: 't-str',
  num: 't-num',
  bare: 't-bare',
  val: 't-val',
  kw: 't-kw',
  paren: 't-paren',
  comma: 't-comma',
  bad: 't-bad',
  alias: 't-alias',
  dir: 't-dir',
  ws: '',
};

/** Minimal validity/reason view of a comparison or list item, keyed by `compId`. */
export type ChipInfo = Record<number, { valid?: boolean; reason?: string } | undefined>;

/** Escape text for safe insertion as element content. */
export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escape text for safe insertion inside a double-quoted attribute value. */
function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, '&quot;');
}

function tokenHtml(tk: EditorToken): string {
  let cls = ROLE_CLASS[tk.role] || '';
  if (tk.role === 'field' && tk.known === false) cls += ' unknown';
  const text = escapeHtml(tk.text);
  return cls ? `<span class="${cls}">${text}</span>` : text;
}

/**
 * Render the analyzer's tokens to a highlighted HTML string, grouping each
 * comparison / list item (`compId`) into a `.chip` span carrying its source span
 * (`data-s` / `data-e`) and validity for blur-gated error styling.
 */
export function tokensToHtml(tokens: readonly EditorToken[], compById: ChipInfo | null): string {
  let html = '';
  let n = 0;
  while (n < tokens.length) {
    const cid = tokens[n]!.compId;
    if (cid == null) {
      html += tokenHtml(tokens[n]!);
      n++;
      continue;
    }
    let m = n;
    while (m < tokens.length && tokens[m]!.compId === cid) m++;
    const run = tokens.slice(n, m);
    const info = compById ? compById[cid] : null;
    const invalid = info ? info.valid === false : false;
    const s = run[0]!.start;
    const e = run[run.length - 1]!.end;
    const title = info && info.reason ? ` title="${escapeAttr(info.reason)}"` : '';
    html += `<span class="chip${invalid ? ' invalid' : ''}" data-s="${s}" data-e="${e}"${title}>`;
    for (const tk of run) html += tokenHtml(tk);
    html += '</span>';
    n = m;
  }
  return html;
}
