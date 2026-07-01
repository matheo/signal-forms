import { operatorLabels } from '../constants';
import { ConditionOperator, IdentifierArg, LiteralValue, QueryNode } from '../models';

/**
 * Serializes an AST back to query text (Visual → Text sync).
 *
 * Explicit {@link GroupNode}s print their own parentheses. As a safety net for
 * programmatically-built trees that omit groups, a lower-precedence logical
 * child nested under a higher-precedence parent is auto-wrapped so the output
 * re-parses to the same shape.
 */
const PRECEDENCE: Record<'and' | 'or', number> = { or: 1, and: 2 };

export function print(node: QueryNode | null): string {
  if (!node) return '';

  switch (node.type) {
    case 'logical': {
      const sep = node.operator === 'and' ? ' AND ' : ' OR ';
      return node.operands.map((operand) => printOperand(operand, node.operator)).join(sep);
    }
    case 'not':
      return `NOT ${printNotOperand(node.operand)}`;
    case 'group':
      return `(${print(node.operand)})`;
    case 'condition':
      return printCondition(node.field, node.operator, node.value);
    case 'function':
      return `${node.name}(${node.args.map(printArg).join(', ')})`;
    default:
      return '';
  }
}

function printOperand(node: QueryNode, parent: 'and' | 'or'): string {
  if (node.type === 'logical' && PRECEDENCE[node.operator] < PRECEDENCE[parent]) {
    return `(${print(node)})`;
  }
  return print(node);
}

function printNotOperand(node: QueryNode): string {
  return node.type === 'logical' ? `(${print(node)})` : print(node);
}

function printCondition(
  field: string,
  operator: ConditionOperator,
  value?: LiteralValue | LiteralValue[],
): string {
  const label = operatorLabels.get(operator) ?? operator;
  if (value === undefined) return `${field} ${label}`;
  if (Array.isArray(value)) return `${field} ${label} (${value.map(printLiteral).join(', ')})`;
  return `${field} ${label} ${printLiteral(value)}`;
}

function printArg(arg: IdentifierArg | LiteralValue): string {
  return arg.type === 'identifier' ? arg.name : printLiteral(arg);
}

function printLiteral(value: LiteralValue): string {
  switch (value.type) {
    case 'string':
      return `'${value.value}'`;
    case 'number':
      return String(value.value);
    case 'boolean':
      return value.value ? 'true' : 'false';
    default:
      return '';
  }
}
