import { ExprNode, FunctionArg } from '../models';

/**
 * Serialize a parsed expression argument to its wire {@link FunctionArg}: a bare
 * column name, a literal, or a nested `{type: "function", …}` ref. Shared by the
 * boolean and list serializers (nested args are always the plain `"function"`
 * discriminator). Ported from the prototype's `serializeArg`.
 */
export function serializeArg(node: ExprNode): FunctionArg {
  if (node.t === 'col') return node.name;
  if (node.t === 'lit') return node.value;
  return { type: 'function', name: node.name, args: node.args.map(serializeArg) };
}
