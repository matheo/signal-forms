import { Injectable } from '@angular/core';
import { ConditionValue } from '../../query-builder';
import { resolveOperator } from '../constants';
import {
  AstNode,
  FnArgs,
  GroupNode,
  ParseError,
  ParseResult,
  QueryAst,
  Token,
  TokenKind,
  isGroup,
} from '../models';
import { isFnName, newCondition, newFn, newGroup } from '../utils';
import { parseFnArgs } from './fn-parsers';

const KEYWORDS: Record<string, TokenKind> = {
  and: 'and',
  or: 'or',
  not: 'not',
  true: 'bool',
  false: 'bool',
};

/**
 * Pure tokenizer + recursive-descent parser for the query bar text grammar.
 *
 *   query   := orExpr EOF
 *   orExpr  := andExpr ('OR' andExpr)*
 *   andExpr := notExpr ('AND' notExpr)*
 *   notExpr := 'NOT'? primary
 *   primary := '(' orExpr ')' | fnCall | condition
 *
 * Tolerant of partial input (the steady state while typing): missing operators
 * or values produce partial nodes rather than throwing, and a best-effort
 * `partial` AST is returned alongside any errors.
 */
@Injectable({ providedIn: 'root' })
export class QueryParser {
  tokenize(input: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const n = input.length;

    while (i < n) {
      const ch = input[i]!;

      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      const single = SINGLE_CHAR[ch];
      if (single) {
        tokens.push({ kind: single, text: ch, start: i, end: i + 1 });
        i++;
        continue;
      }

      if (ch === "'" || ch === '"') {
        const start = i;
        i++; // opening quote
        let text = '';
        while (i < n && input[i] !== ch) {
          if (input[i] === '\\' && i + 1 < n) {
            text += input[i + 1];
            i += 2;
            continue;
          }
          text += input[i];
          i++;
        }
        const terminated = i < n;
        if (terminated) {
          i++; // closing quote
        }
        tokens.push({ kind: 'string', text, start, end: i });
        continue;
      }

      if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(input[i + 1] ?? ''))) {
        const start = i;
        i++;
        while (i < n && /[0-9.]/.test(input[i]!)) {
          i++;
        }
        tokens.push({ kind: 'number', text: input.slice(start, i), start, end: i });
        continue;
      }

      if (/[A-Za-z_]/.test(ch)) {
        const start = i;
        while (i < n && /[A-Za-z0-9_]/.test(input[i]!)) {
          i++;
        }
        const text = input.slice(start, i);
        const kind = KEYWORDS[text.toLowerCase()] ?? 'ident';
        tokens.push({ kind, text, start, end: i });
        continue;
      }

      // Unrecognized character — never throw; emit an error token and advance.
      tokens.push({ kind: 'error', text: ch, start: i, end: i + 1 });
      i++;
    }

    tokens.push({ kind: 'eof', text: '', start: n, end: n });
    return tokens;
  }

  parse(input: string): ParseResult {
    const tokens = this.tokenize(input);
    const ctx = new Cursor(tokens, input);
    const node = parseOr(ctx);
    if (ctx.peek().kind !== 'eof') {
      ctx.error('unexpected', `Unexpected "${ctx.peek().text}"`);
    }
    const root: GroupNode = node && isGroup(node) ? node : newGroup(node ? [node] : [], 'and');
    const ast: QueryAst = { root };
    return ctx.errors.length ? { ok: false, errors: ctx.errors, partial: ast } : { ok: true, ast };
  }

  /** Parse the raw inner text of a function call (delegates to the fn registry). */
  parseFnArgs(fn: string, inner: string): FnArgs | ParseError {
    return parseFnArgs(fn, inner);
  }
}

const SINGLE_CHAR: Record<string, TokenKind> = {
  '(': 'lparen',
  ')': 'rparen',
  ':': 'colon',
  ',': 'comma',
};

class Cursor {
  pos = 0;
  readonly errors: ParseError[] = [];

  constructor(
    readonly tokens: Token[],
    readonly source: string,
  ) {}

  peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)]!;
  }

  next(): Token {
    const token = this.peek();
    if (this.pos < this.tokens.length - 1) {
      this.pos++;
    }
    return token;
  }

  eat(kind: TokenKind): boolean {
    if (this.peek().kind === kind) {
      this.next();
      return true;
    }
    return false;
  }

  error(code: ParseError['code'], message: string, token = this.peek()): void {
    this.errors.push({ code, message, start: token.start, end: token.end });
  }
}

function parseOr(ctx: Cursor): AstNode | null {
  const operands = collect(ctx, 'or', parseAnd);
  if (operands.length === 0) {
    return null;
  }
  return operands.length === 1 ? operands[0]! : newGroup(operands, 'or');
}

function parseAnd(ctx: Cursor): AstNode | null {
  const operands = collect(ctx, 'and', parseNot);
  if (operands.length === 0) {
    return null;
  }
  return operands.length === 1 ? operands[0]! : newGroup(operands, 'and');
}

function collect(
  ctx: Cursor,
  separator: TokenKind,
  parseOperand: (ctx: Cursor) => AstNode | null,
): AstNode[] {
  const operands: AstNode[] = [];
  const first = parseOperand(ctx);
  if (first) {
    operands.push(first);
  }
  while (ctx.peek().kind === separator) {
    ctx.next();
    const operand = parseOperand(ctx);
    if (operand) {
      operands.push(operand);
    }
  }
  return operands;
}

function parseNot(ctx: Cursor): AstNode | null {
  const negated = ctx.eat('not');
  const primary = parsePrimary(ctx);
  if (!negated) {
    return primary;
  }
  if (primary && isGroup(primary)) {
    return { ...primary, not: true };
  }
  return newGroup(primary ? [primary] : [], 'and', true);
}

function parsePrimary(ctx: Cursor): AstNode | null {
  const token = ctx.peek();

  if (token.kind === 'lparen') {
    ctx.next();
    const inner = parseOr(ctx);
    if (!ctx.eat('rparen')) {
      ctx.error('unbalanced-paren', 'Missing closing ")"');
    }
    if (inner && isGroup(inner)) {
      return inner;
    }
    return newGroup(inner ? [inner] : [], 'and');
  }

  if (token.kind === 'ident') {
    // Function call: IDENT '(' ... ')'
    if (ctx.peek(1).kind === 'lparen' && isFnName(token.text)) {
      return parseFnCall(ctx);
    }
    return parseCondition(ctx);
  }

  if (token.kind !== 'eof') {
    ctx.error('unexpected', `Unexpected "${token.text}"`);
    ctx.next();
  }
  return null;
}

function parseFnCall(ctx: Cursor): AstNode {
  const name = ctx.next().text; // ident
  ctx.next(); // lparen
  const innerStart = ctx.peek().start;
  let depth = 1;
  let innerEnd = innerStart;
  while (depth > 0 && ctx.peek().kind !== 'eof') {
    const t = ctx.peek();
    if (t.kind === 'lparen') {
      depth++;
    } else if (t.kind === 'rparen') {
      depth--;
      if (depth === 0) {
        break;
      }
    }
    innerEnd = t.end;
    ctx.next();
  }
  const inner = ctx.source.slice(innerStart, innerEnd);
  if (!ctx.eat('rparen')) {
    ctx.error('unbalanced-paren', `Missing closing ")" for ${name}()`);
  }

  const args = parseFnArgsOrError(ctx, name, inner);
  const { operator, value } = parseOperatorValue(ctx);
  return newFn(args, operator, value);
}

function parseFnArgsOrError(ctx: Cursor, name: string, inner: string): FnArgs {
  const result = parseFnArgs(name, inner);
  if ('message' in result) {
    ctx.error(result.code, result.message);
    return { fn: 'coalesce', field1: '', field2: '', value: '' };
  }
  return result;
}

function parseCondition(ctx: Cursor): AstNode {
  const field = ctx.next().text; // ident
  const { operator, value } = parseOperatorValue(ctx);
  return newCondition(field, operator, value);
}

/** Parse the optional `':' operator ':' value` tail shared by conditions and functions. */
function parseOperatorValue(ctx: Cursor): { operator: ReturnType<typeof resolveOperator>; value: ConditionValue | null } {
  if (!ctx.eat('colon')) {
    return { operator: '', value: null };
  }
  const opToken = ctx.peek();
  let operator: ReturnType<typeof resolveOperator> = '';
  if (opToken.kind === 'ident') {
    operator = resolveOperator(ctx.next().text);
  }
  if (!ctx.eat('colon')) {
    return { operator, value: null };
  }
  return { operator, value: readValue(ctx) };
}

function readValue(ctx: Cursor): ConditionValue | null {
  const token = ctx.peek();
  switch (token.kind) {
    case 'string':
      ctx.next();
      return token.text;
    case 'number':
      ctx.next();
      return Number(token.text);
    case 'bool':
      ctx.next();
      return token.text.toLowerCase() === 'true';
    case 'ident':
      ctx.next();
      return token.text;
    default:
      return null;
  }
}
