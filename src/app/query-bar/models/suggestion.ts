import { BoolMode, ExprNode } from './bool-ast';
import { ListKind } from './list-ast';

/** Any of the five editor profiles. */
export type EditorProfile = BoolMode | ListKind;

/**
 * Autocomplete data model for the v2 editor — the *pure* description of what to
 * suggest at the caret, with no DOM/rendering. The editor component maps these
 * descriptors to Material list items. Derived from the prototype's `suggestFor`
 * / `boolSuggestions` / `argSuggestions` / `fnGroup` / `colGroup`, with the
 * render closures replaced by data fields.
 */

/** What a suggestion inserts into. */
export type SuggestionKind = 'column' | 'function' | 'operator' | 'literal' | 'direction';

/** A single candidate at the caret. */
export interface Suggestion {
  kind: SuggestionKind;
  /** Text inserted when accepted. */
  insert: string;
  /** Caret offset back from the insert end (e.g. 1 to land inside `name()`). */
  caretBack?: number;
  /** Primary display label (function/column name, operator symbol, literal, direction). */
  label: string;
  /** Secondary dim text (operator canonical name, column field path, `literal`). */
  sublabel?: string;
  /** Small type/kind badge (function kind, or column generic type). */
  badge?: string;
  /** A function's bridged output type, shown as `→ T`. */
  output?: string;
  /** Longer description (function docs). */
  description?: string | null;
}

/** A titled group of candidates (functions / columns / operators / value / direction). */
export interface SuggestionGroup {
  label: string;
  items: Suggestion[];
}

/** The full suggestion set for a caret position. */
export interface SuggestionResult {
  /** The fragment already typed that the suggestions complete or replace. */
  frag: string;
  groups: SuggestionGroup[];
  /** Optional header description (the active function's docs, in argument context). */
  desc?: string | null;
}

// --- caret contexts (intermediate, also useful on their own) ----------------

/** The caret sits inside this function call's argument list. */
export interface FnArgContext {
  fnName: string;
  argIndex: number;
}

/** The grammatical role expected at the caret in a boolean expression. */
export type BoolRole = 'lhs' | 'op' | 'value' | 'join';

/** What the boolean grammar expects at the caret, with the LHS type when relevant. */
export interface BoolCaretContext {
  role: BoolRole;
  /** Resolved LHS type — present for `op` / `value` roles. */
  lhsType?: string;
  /** The fragment already typed for this slot. */
  frag: string;
  /** The parsed LHS node (present once an LHS has been consumed). */
  lhs?: ExprNode | null;
}
