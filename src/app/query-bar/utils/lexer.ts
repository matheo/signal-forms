/**
 * Hand-written lexer for the query-bar grammar.
 *
 * Single left-to-right scan, never throws. Emits primitive tokens; the parser
 * assembles multi-word operators (e.g. `STARTS WITH`, `NOT IN`) positionally,
 * so the lexer stays context-free. Whitespace is skipped but every token keeps
 * its source offsets for chip rendering / caret mapping.
 */
export type TokenKind =
  | 'word' // identifiers, function names, keywords (AND/OR/NOT), word-operators
  | 'string' // 'quoted' or "quoted" — `text` holds the unquoted content
  | 'number'
  | 'symbol' // = != < > <= >= and any stray operator-ish punctuation
  | 'lparen'
  | 'rparen'
  | 'comma'
  | 'eof';

export interface Token {
  kind: TokenKind;
  /** For strings this is the unquoted value; otherwise the raw source slice. */
  text: string;
  start: number;
  end: number;
}

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const n = input.length;
  let i = 0;

  while (i < n) {
    const c = input.charAt(i);

    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++;
      continue;
    }

    const start = i;

    if (c === '(') {
      tokens.push(tok('lparen', '(', start, ++i));
      continue;
    }
    if (c === ')') {
      tokens.push(tok('rparen', ')', start, ++i));
      continue;
    }
    if (c === ',') {
      tokens.push(tok('comma', ',', start, ++i));
      continue;
    }

    // Quoted string — tolerant of a missing closing quote at EOF.
    if (c === "'" || c === '"') {
      i++;
      let value = '';
      while (i < n && input.charAt(i) !== c) {
        if (input.charAt(i) === '\\' && i + 1 < n) {
          value += input.charAt(i + 1);
          i += 2;
        } else {
          value += input.charAt(i);
          i++;
        }
      }
      if (i < n) i++; // consume closing quote
      tokens.push(tok('string', value, start, i));
      continue;
    }

    // Number (integer/decimal, optional leading minus).
    if (isDigit(c) || (c === '-' && isDigit(input.charAt(i + 1)))) {
      i++;
      while (i < n && (isDigit(input.charAt(i)) || input.charAt(i) === '.')) i++;
      tokens.push(tok('number', input.slice(start, i), start, i));
      continue;
    }

    // Symbolic operator run (=, !=, <=, >=, ...).
    if (isSymbol(c)) {
      i++;
      while (i < n && isSymbol(input.charAt(i))) i++;
      tokens.push(tok('symbol', input.slice(start, i), start, i));
      continue;
    }

    // Word: identifier / keyword / word-operator fragment.
    if (isWordStart(c)) {
      i++;
      while (i < n && isWordChar(input.charAt(i))) i++;
      tokens.push(tok('word', input.slice(start, i), start, i));
      continue;
    }

    // Unknown character — emit as a lone symbol so scanning always progresses.
    i++;
    tokens.push(tok('symbol', c, start, i));
  }

  tokens.push(tok('eof', '', n, n));
  return tokens;
}

function tok(kind: TokenKind, text: string, start: number, end: number): Token {
  return { kind, text, start, end };
}

function isDigit(c: string): boolean {
  return c >= '0' && c <= '9';
}

function isSymbol(c: string): boolean {
  return c === '=' || c === '!' || c === '<' || c === '>';
}

function isWordStart(c: string): boolean {
  return /[A-Za-z_]/.test(c);
}

function isWordChar(c: string): boolean {
  return /[A-Za-z0-9_.]/.test(c);
}
