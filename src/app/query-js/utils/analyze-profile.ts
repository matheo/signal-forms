import { BoolAnalysis, BoolMode, EditorProfile, ListAnalysis, ListKind } from '../models';
import { BoolAnalyzer } from './bool-analyzer';
import { boolErrors } from './bool-serialize';
import { CatalogIndex } from './catalog-index';
import { ListAnalyzer } from './list-analyzer';
import { listErrors } from './list-serialize';
import { ChipInfo } from './editor-render';

/**
 * Analyze a single editor buffer under its profile — the per-section counterpart
 * to {@link import('./assemble').analyzeAll}, used by the reusable editor to
 * highlight and validate one section on its own. WHERE/HAVING run the
 * {@link BoolAnalyzer}, the three list profiles the {@link ListAnalyzer}; the
 * `kind` discriminator lets callers pick the matching error helper.
 */
export type ProfileAnalysis =
  | { kind: 'bool'; analysis: BoolAnalysis }
  | { kind: 'list'; analysis: ListAnalysis };

/** Whether `profile` uses the boolean grammar (WHERE / HAVING). */
export function isBoolProfile(profile: EditorProfile): profile is BoolMode {
  return profile === 'where' || profile === 'having';
}

export function analyzeProfile(
  catalog: CatalogIndex,
  profile: EditorProfile,
  text: string,
): ProfileAnalysis {
  if (isBoolProfile(profile)) {
    return { kind: 'bool', analysis: new BoolAnalyzer(catalog).analyze(text, profile) };
  }
  return { kind: 'list', analysis: new ListAnalyzer(catalog).analyze(text, profile as ListKind) };
}

/** Deduplicated, human-readable errors for a profile analysis (blur validation). */
export function profileErrors(pa: ProfileAnalysis): string[] {
  const raw = pa.kind === 'bool' ? boolErrors(pa.analysis) : listErrors(pa.analysis);
  return [...new Set(raw)];
}

/** The `compId`-keyed chip validity map for highlighting (both grammars). */
export function chipInfo(pa: ProfileAnalysis): ChipInfo {
  return pa.analysis.compById as ChipInfo;
}
