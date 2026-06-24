import { QueryAst } from './ast';

export type ParseErrorCode =
  | 'unexpected'
  | 'unterminated-string'
  | 'unknown-fn'
  | 'unbalanced-paren'
  | 'partial';

export interface ParseError {
  readonly message: string;
  readonly start: number;
  readonly end: number;
  readonly code: ParseErrorCode;
}

/**
 * Result of parsing query text. On failure a best-effort `partial` AST may still
 * be returned so the bar can keep rendering chips while the user types.
 */
export type ParseResult =
  | { readonly ok: true; readonly ast: QueryAst }
  | { readonly ok: false; readonly errors: readonly ParseError[]; readonly partial?: QueryAst };
