import { operatorLabels } from '../constants';
import { Token, tokenize } from './lexer';

/**
 * Token-driven syntax highlighting for the editor.
 *
 * Unlike the parser, this always produces a full segmentation of the source —
 * even for partial/invalid input mid-edit — so the contenteditable can colorize
 * as the user types. Whitespace between tokens is preserved as its own segment.
 */
export type HighlightKind =
  | 'identifier'
  | 'operator'
  | 'logical'
  | 'not'
  | 'value'
  | 'punct'
  | 'whitespace';

export interface HighlightSegment {
  text: string;
  kind: HighlightKind;
}

/** Every word that appears in an operator label (e.g. STARTS, WITH, IS, EMPTY). */
const OPERATOR_WORDS = new Set<string>();
for (const label of operatorLabels.values()) {
  for (const word of label.toUpperCase().split(' ')) OPERATOR_WORDS.add(word);
}

export function highlight(source: string): HighlightSegment[] {
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  for (const token of tokenize(source)) {
    if (token.kind === 'eof') break;
    if (token.start > cursor) {
      segments.push({ text: source.slice(cursor, token.start), kind: 'whitespace' });
    }
    segments.push({ text: source.slice(token.start, token.end), kind: classify(token) });
    cursor = token.end;
  }

  if (cursor < source.length) {
    segments.push({ text: source.slice(cursor), kind: 'whitespace' });
  }
  return segments;
}

function classify(token: Token): HighlightKind {
  switch (token.kind) {
    case 'string':
    case 'number':
      return 'value';
    case 'symbol':
      return 'operator';
    case 'lparen':
    case 'rparen':
    case 'comma':
      return 'punct';
    case 'word': {
      const upper = token.text.toUpperCase();
      if (upper === 'AND' || upper === 'OR') return 'logical';
      if (upper === 'NOT') return 'not';
      if (upper === 'TRUE' || upper === 'FALSE') return 'value';
      if (OPERATOR_WORDS.has(upper)) return 'operator';
      return 'identifier';
    }
    default:
      return 'whitespace';
  }
}
