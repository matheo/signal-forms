import { ExprNode } from '../models';
import { CatalogIndex, ContainerFilterType, containerFilterType } from './catalog-index';

/**
 * Resolve the (generic) type of an LHS expression node against the catalog:
 * a column's field type, a function's bridged output type, or a literal's type.
 * Unknown/absent nodes widen to `any`. Shared by the boolean validator
 * (`finalizeComp`) and the autocomplete-context layer so both agree on the LHS
 * type driving operator + value suggestions. Ported from the prototype's
 * `typeOfNode`.
 */
export function typeOfNode(catalog: CatalogIndex, node: ExprNode | null): string {
  if (!node) return 'any';
  if (node.t === 'col') {
    const f = catalog.fieldByName(node.name);
    return f ? f.type.type : 'any';
  }
  if (node.t === 'fn') return node.fn ? catalog.outputGeneric(node.fn) : 'any';
  // literal
  return node.litType === 'number' ? 'number' : node.litType === 'star' ? 'any' : 'string';
}

/**
 * The container filter type of a column LHS, or null (functions/literals are not
 * containers). Container operators (`any_match`, `has_key`, …) resolve against
 * this instead of the generic type. Ported from the prototype's `containerTypeOf`.
 */
export function containerTypeOfNode(catalog: CatalogIndex, node: ExprNode): ContainerFilterType | null {
  if (node.t === 'col') {
    const f = catalog.fieldByName(node.name);
    if (f) return containerFilterType(f);
  }
  return null;
}
