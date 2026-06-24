import { FnArgs, FnName, ParseError } from '../models';
import { isFnName, parseFnText } from '../utils';

/**
 * A per-function argument parser. Each receives the raw text *inside* the
 * parentheses (e.g. `column1:column2:'value'` for COALESCE) and returns the
 * typed `FnArgs`, isolating each function's custom grammar from the main parser.
 */
export type FnArgsParser = (inner: string) => FnArgs | null;

const coalesceParser: FnArgsParser = (inner) => parseFnText(`coalesce(${inner})`);

const aggregateParser = (fn: Exclude<FnName, 'coalesce'>): FnArgsParser =>
  (inner) => parseFnText(`${fn}(${inner})`);

/** Registry of supported functions → their argument sub-parser. */
export const FN_PARSERS: Record<FnName, FnArgsParser> = {
  coalesce: coalesceParser,
  floor: aggregateParser('floor'),
  count: aggregateParser('count'),
  sum: aggregateParser('sum'),
  avg: aggregateParser('avg'),
  min: aggregateParser('min'),
  max: aggregateParser('max'),
};

/** Parse the raw inner text of a function call (used by the parser and the COALESCE popup). */
export function parseFnArgs(fn: string, inner: string): FnArgs | ParseError {
  const name = fn.toLowerCase();
  if (!isFnName(name)) {
    return { message: `Unknown function "${fn}"`, code: 'unknown-fn', start: 0, end: fn.length };
  }
  const args = FN_PARSERS[name](inner);
  if (!args) {
    return { message: `Invalid arguments for ${name}()`, code: 'unexpected', start: 0, end: inner.length };
  }
  return args;
}
