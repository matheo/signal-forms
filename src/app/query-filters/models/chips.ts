import { NodeId } from './ast';

/**
 * Visual chip kinds. Gray for condition/function segments (light-blue when
 * selected), purple for logical conjunctions and grouping parentheses.
 */
export type ChipKind =
  | 'paren-open'
  | 'paren-close'
  | 'logical' // AND / OR (with optional leading NOT)
  | 'cond-field'
  | 'cond-op'
  | 'cond-value'
  | 'fn'; // COALESCE / SUM / ... rendered as one chip with a custom popup

export type ChipSegment = 'field' | 'operator' | 'value';

export interface ChipVm {
  /** Stable key for `@for` tracking: `${nodeId}:${segment ?? kind}`. */
  readonly key: string;
  readonly nodeId: NodeId;
  readonly kind: ChipKind;
  readonly segment?: ChipSegment;
  /** Display text (operators are rendered monospace). */
  readonly text: string;
  readonly editable: boolean;
  /** Nesting depth, for parenthesis coloring / indentation cues. */
  readonly depth: number;
}

/** A caret sits in the gap between two chips, addressed by index (not pixels). */
export interface Caret {
  /** Gap position in the flat stream: `0..chips.length`. */
  readonly index: number;
  /** Nearest group whose child boundary this gap sits at. */
  readonly contextNodeId: NodeId;
  /** Child index within that group for inserts. */
  readonly insertIndex: number;
}

export interface ChipStream {
  readonly chips: readonly ChipVm[];
  /** Always `chips.length + 1` gaps. */
  readonly carets: readonly Caret[];
}
