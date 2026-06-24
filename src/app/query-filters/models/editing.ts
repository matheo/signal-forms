import { NodeId } from './ast';
import { Caret } from './chips';

/**
 * Active editing context. The overlay popup switches its content on `kind`.
 * Only the small active-edit record is bound to a Signal Form — never the AST.
 */
export type EditMode =
  | { readonly kind: 'idle' }
  /**
   * Choosing a filter. `caret` set → insert a new condition at that gap;
   * `nodeId` set → replace the field of an existing condition.
   */
  | { readonly kind: 'pick-field'; readonly caret: Caret | null; readonly nodeId: NodeId | null }
  /** A condition exists; choose a valid operator for its field type. */
  | { readonly kind: 'pick-operator'; readonly nodeId: NodeId }
  /** Operator chosen; type the value. */
  | { readonly kind: 'edit-value'; readonly nodeId: NodeId }
  /** Advanced multi-field editor (COALESCE). */
  | { readonly kind: 'edit-coalesce'; readonly nodeId: NodeId };

export type EditModeKind = EditMode['kind'];

/** A pickable item in the IntelliSense suggestion list. */
export interface SuggestionItem {
  readonly value: string;
  readonly label: string;
  readonly hint?: string;
}

/** The editable shape of a COALESCE function chip. */
export interface CoalesceModel {
  field1: string;
  field2: string;
  value: string;
}
