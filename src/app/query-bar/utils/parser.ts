import { multipleValueOperators, noValueOperators, operatorLabels } from '../constants';
import {
  ConditionOperator,
  FunctionNode,
  IdentifierArg,
  LiteralValue,
  ParseError,
  ParseResult,
  QueryNode,
  SourceSpan,
} from '../models';
import { Token, tokenize } from './lexer';

/**
 * Recursive-descent parser for the query-bar grammar.
 *
 * Precedence (low → high): OR < AND < NOT < primary. Grouping is explicit via
 * parentheses. The parser is error-tolerant: it never throws, always makes
 * forward progress, and returns a (possibly partial) tree plus collected
 * errors — this is what lets the Visual↔Text toggle ask "is it parseable?".
 */
export function parse(input: string): ParseResult {
  const parser = new Parser(tokenize(input));
  const ast = parser.parseRoot();
  return { ast, errors: parser.errors };
}

/** Reverse of `operatorLabels`: normalized surface text → ConditionOperator. */
const OPERATOR_BY_LABEL = new Map<string, ConditionOperator>();
/** Longest operator label measured in space-separated tokens (e.g. "IS NOT EMPTY" = 3). */
let MAX_OP_TOKENS = 1;
for (const [op, label] of operatorLabels) {
  const key = label.toUpperCase();
  OPERATOR_BY_LABEL.set(key, op);
  MAX_OP_TOKENS = Math.max(MAX_OP_TOKENS, key.split(' ').length);
}

class Parser {
  readonly errors: ParseError[] = [];
  private pos = 0;

  constructor(private readonly tokens: Token[]) {}

  parseRoot(): QueryNode | null {
    if (this.atEnd()) return null;
    const node = this.parseOr();
    if (!this.atEnd()) {
      const t = this.peek();
      this.error(`Unexpected token "${t.text}"`, spanOf(t));
    }
    return node;
  }

  // --- precedence levels ---------------------------------------------------

  private parseOr(): QueryNode | null {
    return this.parseBinary('OR', 'or', () => this.parseAnd());
  }

  private parseAnd(): QueryNode | null {
    return this.parseBinary('AND', 'and', () => this.parseNot());
  }

  private parseBinary(
    keyword: string,
    operator: 'and' | 'or',
    next: () => QueryNode | null,
  ): QueryNode | null {
    const first = next();
    if (!this.isWord(keyword)) return first;

    const operands: QueryNode[] = first ? [first] : [];
    while (this.isWord(keyword)) {
      this.advance();
      const rhs = next();
      if (rhs) operands.push(rhs);
    }
    if (operands.length === 0) return null;
    if (operands.length === 1) return operands[0]!;
    return { type: 'logical', operator, operands, span: spanOfNodes(operands) };
  }

  private parseNot(): QueryNode | null {
    if (!this.isWord('NOT')) return this.parsePrimary();
    const start = this.advance().start;
    const operand = this.parseNot();
    if (!operand) return null;
    return { type: 'not', operand, span: { start, end: operand.span?.end ?? start } };
  }

  private parsePrimary(): QueryNode | null {
    const t = this.peek();

    if (t.kind === 'lparen') {
      const start = this.advance().start;
      const inner = this.parseOr();
      let end = this.peek().end;
      if (this.peek().kind === 'rparen') {
        end = this.advance().end;
      } else {
        this.error('Missing closing ")"', { start, end });
      }
      if (!inner) return null;
      return { type: 'group', operand: inner, span: { start, end } };
    }

    if (t.kind === 'word') return this.parseConditionOrFunction();

    this.error(`Expected a field or "(", found "${t.text || 'end of input'}"`, spanOf(t));
    this.advance(); // guarantee progress
    return null;
  }

  // --- leaves --------------------------------------------------------------

  private parseConditionOrFunction(): QueryNode | null {
    const id = this.advance(); // word
    if (this.peek().kind === 'lparen') return this.parseFunction(id);

    const matched = this.matchOperator();
    if (!matched) {
      this.error(`Expected an operator after "${id.text}"`, {
        start: id.start,
        end: this.peek().end,
      });
      return null;
    }

    const value = this.parseValue(matched.op);
    const end = valueEnd(value) ?? matched.span.end;
    return { type: 'condition', field: id.text, operator: matched.op, value, span: { start: id.start, end } };
  }

  private parseFunction(id: Token): FunctionNode {
    this.advance(); // '('
    const args: Array<IdentifierArg | LiteralValue> = [];

    while (this.peek().kind !== 'rparen' && !this.atEnd()) {
      const t = this.peek();
      if (t.kind === 'word') {
        const up = t.text.toUpperCase();
        this.advance();
        if (up === 'TRUE' || up === 'FALSE') {
          args.push({ type: 'boolean', value: up === 'TRUE', span: spanOf(t) });
        } else {
          args.push({ type: 'identifier', name: t.text, span: spanOf(t) });
        }
      } else if (t.kind === 'string') {
        this.advance();
        args.push({ type: 'string', value: t.text, span: spanOf(t) });
      } else if (t.kind === 'number') {
        this.advance();
        args.push({ type: 'number', value: Number(t.text), span: spanOf(t) });
      } else {
        this.error(`Unexpected argument "${t.text}"`, spanOf(t));
        this.advance();
      }
      if (this.peek().kind === 'comma') this.advance();
      else break;
    }

    let end = this.peek().end;
    if (this.peek().kind === 'rparen') end = this.advance().end;
    else this.error('Missing closing ")"', { start: id.start, end });

    return { type: 'function', name: id.text, args, span: { start: id.start, end } };
  }

  /** Greedily match the longest run of word/symbol tokens against an operator label. */
  private matchOperator(): { op: ConditionOperator; span: SourceSpan } | null {
    for (let len = MAX_OP_TOKENS; len >= 1; len--) {
      const slice: Token[] = [];
      for (let k = 0; k < len; k++) {
        const t = this.peek(k);
        if (t.kind !== 'word' && t.kind !== 'symbol') break;
        slice.push(t);
      }
      if (slice.length !== len) continue;

      const key = slice.map((t) => t.text.toUpperCase()).join(' ');
      const op = OPERATOR_BY_LABEL.get(key);
      if (op) {
        for (let k = 0; k < len; k++) this.advance();
        return { op, span: { start: slice[0]!.start, end: slice[len - 1]!.end } };
      }
    }
    return null;
  }

  private parseValue(op: ConditionOperator): LiteralValue | LiteralValue[] | undefined {
    if (noValueOperators.includes(op)) return undefined;

    if (multipleValueOperators.includes(op)) {
      const values: LiteralValue[] = [];
      if (this.peek().kind === 'lparen') {
        this.advance();
        while (this.peek().kind !== 'rparen' && !this.atEnd()) {
          const lit = this.parseLiteral();
          if (lit) values.push(lit);
          if (this.peek().kind === 'comma') this.advance();
          else break;
        }
        if (this.peek().kind === 'rparen') this.advance();
        else this.error('Missing closing ")" in value list', spanOf(this.peek()));
      } else {
        const lit = this.parseLiteral();
        if (lit) values.push(lit);
      }
      return values;
    }

    return this.parseLiteral() ?? undefined;
  }

  private parseLiteral(): LiteralValue | null {
    const t = this.peek();
    if (t.kind === 'string') {
      this.advance();
      return { type: 'string', value: t.text, span: spanOf(t) };
    }
    if (t.kind === 'number') {
      this.advance();
      return { type: 'number', value: Number(t.text), span: spanOf(t) };
    }
    if (t.kind === 'word') {
      const up = t.text.toUpperCase();
      this.advance();
      if (up === 'TRUE' || up === 'FALSE') {
        return { type: 'boolean', value: up === 'TRUE', span: spanOf(t) };
      }
      // Bare unquoted word — treat as a string value.
      return { type: 'string', value: t.text, span: spanOf(t) };
    }
    this.error(`Expected a value, found "${t.text || 'end of input'}"`, spanOf(t));
    return null;
  }

  // --- token cursor --------------------------------------------------------

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.pos + offset, this.tokens.length - 1)]!;
  }

  private advance(): Token {
    const t = this.peek();
    if (this.pos < this.tokens.length - 1) this.pos++;
    return t;
  }

  private atEnd(): boolean {
    return this.peek().kind === 'eof';
  }

  private isWord(upper: string): boolean {
    const t = this.peek();
    return t.kind === 'word' && t.text.toUpperCase() === upper;
  }

  private error(message: string, span: SourceSpan): void {
    this.errors.push({ message, span });
  }
}

function spanOf(t: Token): SourceSpan {
  return { start: t.start, end: t.end };
}

function spanOfNodes(nodes: QueryNode[]): SourceSpan | undefined {
  const first = nodes[0]?.span;
  const last = nodes[nodes.length - 1]?.span;
  if (!first || !last) return undefined;
  return { start: first.start, end: last.end };
}

function valueEnd(value: LiteralValue | LiteralValue[] | undefined): number | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[value.length - 1]?.span?.end;
  return value.span?.end;
}
