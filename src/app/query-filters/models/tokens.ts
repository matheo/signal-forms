/** Lexer token kinds for the query-text grammar. */
export type TokenKind =
  | 'lparen'
  | 'rparen'
  | 'and'
  | 'or'
  | 'not'
  | 'ident' // field / function name
  | 'colon' // condition segment separator
  | 'string' // quoted, may contain colons
  | 'number'
  | 'bool'
  | 'comma'
  | 'error' // unrecognized run of characters (never throws)
  | 'eof';

export interface Token {
  readonly kind: TokenKind;
  readonly text: string;
  /** Inclusive start offset in the source string. */
  readonly start: number;
  /** Exclusive end offset in the source string. */
  readonly end: number;
}
