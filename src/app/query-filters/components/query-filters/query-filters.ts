import { Component, computed, effect, input, linkedSignal, model, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  ConditionValue,
  FilterDefinition,
  LogicalExpression,
  operatorLabels,
} from '../../../query-builder';
import { operatorsForFilter } from '../../constants';
import {
  AstNode,
  Caret,
  ChipVm,
  CoalesceModel,
  EditMode,
  LogicalConnector,
  PartialOperator,
  QueryAst,
  SuggestionItem,
} from '../../models';
import {
  buildIndex,
  emptyAst,
  insertChild,
  newCondition,
  newGroup,
  parse,
  project,
  serialize,
  updateNode,
} from '../../utils';
import { ChipBar } from '../chip-bar/chip-bar';
import { EditPopup } from '../edit-popup/edit-popup';

const OVERLAY_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
];

@Component({
  selector: 'app-query-filters',
  templateUrl: './query-filters.html',
  styleUrl: './query-filters.scss',
  host: { class: 'block' },
  imports: [OverlayModule, ChipBar, EditPopup],
})
export class QueryFilters {
  readonly filters = input.required<FilterDefinition[]>();
  readonly model = model.required<LogicalExpression>();

  /** Internal optimized AST. Lives in a plain signal — never a Signal Form. */
  protected readonly ast = signal<QueryAst>(emptyAst());
  protected readonly editMode = signal<EditMode>({ kind: 'idle' });

  /** Text typed into the active caret's inline input while building a new node. */
  protected readonly draft = signal('');
  /** Connector chosen at the caret (typing `AND`/`OR`) to join the next inserted node. */
  private readonly pendingConnector = signal<LogicalConnector | null>(null);

  protected readonly chipStream = computed(() => project(this.ast()));
  protected readonly index = computed(() => buildIndex(this.ast()));

  protected readonly positions = OVERLAY_POSITIONS;
  protected readonly isOpen = computed(() => this.editMode().kind !== 'idle');

  /** Guards the input → parse → serialize → model loop: ignore our own writes. */
  private lastSynced: LogicalExpression | null = null;

  constructor() {
    effect(() => {
      const incoming = this.model();
      if (incoming === this.lastSynced) {
        return; // our own commit echoed back — do not reparse / lose ids
      }
      this.lastSynced = incoming;
      this.ast.set(parse(incoming));
    });
  }

  // --- derived editing context ------------------------------------------------

  protected readonly activeNodeId = computed<string | null>(() => {
    const mode = this.editMode();
    return 'nodeId' in mode ? mode.nodeId : null;
  });

  protected readonly activeNode = computed<AstNode | null>(() => {
    const id = this.activeNodeId();
    return id ? (this.index().get(id) ?? null) : null;
  });

  protected readonly contextFilter = computed<FilterDefinition | null>(() => {
    const field = fieldOf(this.activeNode());
    return field ? (this.filters().find((f) => f.field === field) ?? null) : null;
  });

  protected readonly initialValue = computed(() => {
    const node = this.activeNode();
    if (node && (node.kind === 'condition' || node.kind === 'fn')) {
      return node.value === null ? '' : String(node.value);
    }
    return '';
  });

  protected readonly initialCoalesce = computed<CoalesceModel>(() => {
    const node = this.activeNode();
    if (node?.kind === 'fn' && node.args.fn === 'coalesce') {
      const { field1, field2, value } = node.args;
      return { field1, field2, value };
    }
    return { field1: '', field2: '', value: '' };
  });

  protected readonly selectedKey = computed<string | null>(() => {
    const mode = this.editMode();
    switch (mode.kind) {
      case 'pick-field':
        return mode.nodeId ? `${mode.nodeId}:field` : null;
      case 'pick-operator':
        return `${mode.nodeId}:operator`;
      case 'edit-value':
        return `${mode.nodeId}:value`;
      case 'edit-coalesce':
        return `${mode.nodeId}:fn`;
      default:
        return null;
    }
  });

  protected readonly activeCaret = computed<Caret | null>(() => {
    const mode = this.editMode();
    return mode.kind === 'pick-field' ? mode.caret : null;
  });

  /** Key of the chip being edited inline (field or operator on an existing node). */
  protected readonly editingChipKey = computed<string | null>(() => {
    const mode = this.editMode();
    if (mode.kind === 'pick-field' && mode.nodeId) {
      return `${mode.nodeId}:field`;
    }
    if (mode.kind === 'pick-operator') {
      return `${mode.nodeId}:operator`;
    }
    return null;
  });

  /**
   * Suggestions for the inline input, by mode and filtered by what's been typed:
   * - `pick-field`: the fields, plus — when building at a caret — the logical operators
   *   (once there are siblings to combine) and a grouping paren.
   * - `pick-operator`: the operators valid for the active field's type.
   */
  protected readonly inlineSuggestions = computed<SuggestionItem[]>(() => {
    const mode = this.editMode();
    const all =
      mode.kind === 'pick-field'
        ? this.fieldSuggestions(mode.caret)
        : mode.kind === 'pick-operator'
          ? this.operatorSuggestions()
          : [];

    const q = this.draft().trim().toLowerCase();
    if (!q) {
      return all;
    }
    return all.filter(
      (it) => it.label.toLowerCase().includes(q) || it.value.toLowerCase().includes(q),
    );
  });

  private fieldSuggestions(caret: Caret | null): SuggestionItem[] {
    const fields: SuggestionItem[] = this.filters().map((f) => ({
      value: `f:${f.field}`,
      label: f.label,
      hint: f.hive_type,
    }));
    if (!caret) {
      return fields;
    }
    const group = this.index().get(caret.contextNodeId);
    const hasSiblings = group?.kind === 'group' && group.children.length > 0;
    return [
      ...fields,
      ...(hasSiblings
        ? ([
            { value: 'op:and', label: 'AND', hint: 'logical' },
            { value: 'op:or', label: 'OR', hint: 'logical' },
          ] satisfies SuggestionItem[])
        : []),
      { value: 'grp', label: '( … )', hint: 'group' },
    ];
  }

  private operatorSuggestions(): SuggestionItem[] {
    const filter = this.contextFilter();
    if (!filter) {
      return [];
    }
    return operatorsForFilter(filter).map((op) => ({
      value: op,
      label: operatorLabels.get(op) ?? op,
      hint: op,
    }));
  }

  /** Highlighted suggestion; resets to the top whenever the text or target changes. */
  protected readonly inlineIndex = linkedSignal<number>(() => {
    this.draft();
    this.editMode();
    return 0;
  });

  // --- chip / caret interaction ----------------------------------------------

  protected onChipActivate(chip: ChipVm): void {
    switch (chip.kind) {
      case 'cond-field': {
        // Edit the field in place: seed the inline input with the current field text.
        const node = this.index().get(chip.nodeId);
        this.draft.set(node?.kind === 'condition' ? node.field : '');
        this.pendingConnector.set(null);
        this.editMode.set({ kind: 'pick-field', caret: null, nodeId: chip.nodeId });
        return;
      }
      case 'cond-op':
        this.draft.set('');
        this.pendingConnector.set(null);
        this.editMode.set({ kind: 'pick-operator', nodeId: chip.nodeId });
        return;
      case 'cond-value':
        this.editMode.set({ kind: 'edit-value', nodeId: chip.nodeId });
        return;
      case 'fn': {
        const node = this.index().get(chip.nodeId);
        if (node?.kind === 'fn' && node.args.fn === 'coalesce') {
          this.editMode.set({ kind: 'edit-coalesce', nodeId: chip.nodeId });
        }
        return;
      }
      case 'logical':
        this.onLogicalActivate(chip);
        return;
      default:
        return;
    }
  }

  protected onCaretActivate(caret: Caret): void {
    this.draft.set('');
    this.pendingConnector.set(null);
    this.editMode.set({ kind: 'pick-field', caret, nodeId: null });
  }

  // --- inline input (build a new node, or edit a field, by typing in the bar) -

  protected onInlineInput(text: string): void {
    this.draft.set(text);
  }

  protected onInlineKeydown(event: KeyboardEvent): void {
    const items = this.inlineSuggestions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.inlineIndex.update((i) => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.inlineIndex.update((i) => Math.max(i - 1, 0));
        break;
      case 'Enter': {
        event.preventDefault();
        const item = items[this.inlineIndex()];
        if (item) {
          this.onInlineSelect(item.value);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.closeEditing();
        break;
    }
  }

  /**
   * Apply an inline selection. Editing an existing field expects `f:<field>`; building at a
   * caret also accepts `op:and` / `op:or` (staged connector) and `grp` (a new group).
   */
  protected onInlineSelect(value: string): void {
    const mode = this.editMode();
    this.draft.set('');

    // Editing an operator chip in place: set it and move on to the value.
    if (mode.kind === 'pick-operator') {
      this.commit(
        updateNode(this.ast(), mode.nodeId, (node) =>
          node.kind === 'condition' || node.kind === 'fn'
            ? { ...node, operator: value as PartialOperator }
            : node,
        ),
      );
      this.editMode.set({ kind: 'edit-value', nodeId: mode.nodeId });
      return;
    }

    if (mode.kind !== 'pick-field') {
      return;
    }

    // Editing an existing field chip in place.
    if (mode.nodeId) {
      if (value.startsWith('f:')) {
        const field = value.slice(2);
        this.commit(
          updateNode(this.ast(), mode.nodeId, (node) =>
            node.kind === 'condition' ? { ...node, field } : node,
          ),
        );
        this.editMode.set({ kind: 'pick-operator', nodeId: mode.nodeId });
      }
      return;
    }

    if (!mode.caret) {
      return;
    }
    const caret = mode.caret;
    const connector = this.pendingConnector() ?? 'and';

    if (value === 'op:and' || value === 'op:or') {
      // Stage the connector for the next inserted node; keep building at the same caret.
      this.pendingConnector.set(value === 'op:and' ? 'and' : 'or');
      return;
    }

    this.pendingConnector.set(null);

    if (value.startsWith('f:')) {
      const node = newCondition(value.slice(2));
      this.commit(
        insertChild(this.ast(), caret.contextNodeId, caret.insertIndex, node, connector),
      );
      this.editMode.set({ kind: 'pick-operator', nodeId: node.id });
      return;
    }
    if (value === 'grp') {
      const group = newGroup([]);
      this.commit(
        insertChild(this.ast(), caret.contextNodeId, caret.insertIndex, group, connector),
      );
      // Continue building the first condition inside the new parens.
      this.editMode.set({
        kind: 'pick-field',
        caret: { index: 0, contextNodeId: group.id, insertIndex: 0 },
        nodeId: null,
      });
    }
  }

  /** Toggle a group's NOT flag, or flip a single gap's AND/OR connector inline (no popup). */
  private onLogicalActivate(chip: ChipVm): void {
    if (chip.key.endsWith(':not')) {
      this.commit(
        updateNode(this.ast(), chip.nodeId, (node) =>
          node.kind === 'group' ? { ...node, not: !node.not } : node,
        ),
      );
      return;
    }
    const gap = Number(chip.key.split(':').pop());
    this.commit(
      updateNode(this.ast(), chip.nodeId, (node) => {
        if (node.kind !== 'group' || !Number.isInteger(gap) || gap >= node.operators.length) {
          return node;
        }
        const operators = [...node.operators];
        operators[gap] = operators[gap] === 'and' ? 'or' : 'and';
        return { ...node, operators };
      }),
    );
  }

  // --- popup commits ----------------------------------------------------------

  protected onCommitValue(raw: string): void {
    const mode = this.editMode();
    if (mode.kind !== 'edit-value') {
      return;
    }
    const value = this.coerceValue(raw);
    this.commit(
      updateNode(this.ast(), mode.nodeId, (node) =>
        node.kind === 'condition' || node.kind === 'fn' ? { ...node, value } : node,
      ),
    );
    this.closeEditing();
  }

  protected onCommitCoalesce(args: CoalesceModel): void {
    const mode = this.editMode();
    if (mode.kind !== 'edit-coalesce') {
      return;
    }
    this.commit(
      updateNode(this.ast(), mode.nodeId, (node) =>
        node.kind === 'fn' ? { ...node, args: { fn: 'coalesce', ...args } } : node,
      ),
    );
    this.closeEditing();
  }

  protected closeEditing(): void {
    this.draft.set('');
    this.pendingConnector.set(null);
    this.editMode.set({ kind: 'idle' });
  }

  // --- helpers ----------------------------------------------------------------

  private commit(next: QueryAst): void {
    this.ast.set(next);
    const serialized = serialize(next);
    this.lastSynced = serialized;
    this.model.set(serialized);
  }

  private coerceValue(raw: string): ConditionValue {
    const filter = this.contextFilter();
    const key = filter ? ('fn' in filter.type ? filter.type.input : filter.type.type) : 'string';
    if (key === 'number') {
      const n = Number(raw);
      return Number.isNaN(n) ? raw : n;
    }
    if (key === 'boolean') {
      return raw.trim().toLowerCase() === 'true';
    }
    return raw;
  }
}

function fieldOf(node: AstNode | null): string | null {
  if (!node) {
    return null;
  }
  if (node.kind === 'condition') {
    return node.field;
  }
  if (node.kind === 'fn' && node.args.fn !== 'coalesce') {
    return node.args.field;
  }
  return null;
}
