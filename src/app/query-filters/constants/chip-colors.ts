import { ChipKind } from '../models';

/**
 * Tailwind classes per chip kind. Gray for condition/function segments
 * (light-blue when selected), purple for logical conjunctions and parentheses.
 */
const BASE = 'inline-flex items-center rounded px-1.5 py-0.5 whitespace-nowrap transition-colors';

const GRAY = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
const GRAY_SELECTED = 'bg-sky-100 text-sky-900 ring-1 ring-sky-400';
const PURPLE = 'bg-purple-100 text-purple-800 font-medium';

const KIND_CLASSES: Record<ChipKind, string> = {
  'paren-open': PURPLE,
  'paren-close': PURPLE,
  logical: `${PURPLE} font-mono`,
  'cond-field': GRAY,
  'cond-op': `${GRAY} font-mono`,
  'cond-value': GRAY,
  fn: `${GRAY} font-mono`,
};

export function chipClasses(kind: ChipKind, selected: boolean): string {
  if (selected && kind !== 'logical' && kind !== 'paren-open' && kind !== 'paren-close') {
    return `${BASE} ${KIND_CLASSES[kind].includes('font-mono') ? 'font-mono ' : ''}${GRAY_SELECTED}`;
  }
  return `${BASE} ${KIND_CLASSES[kind]}`;
}
