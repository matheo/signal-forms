import { Component, computed, effect, input, model, signal } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import {
  ConditionValue,
  FilterDefinition,
  LogicalExpression,
} from '../../../query-builder';
import {
  AstNode,
  Caret,
  ChipVm,
  CoalesceModel,
  EditMode,
  PartialOperator,
  QueryAst,
} from '../../models';
import {
  buildIndex,
  emptyAst,
  insertChild,
  newCondition,
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

  // --- chip / caret interaction ----------------------------------------------

  protected onChipActivate(chip: ChipVm): void {
    switch (chip.kind) {
      case 'cond-field':
        this.editMode.set({ kind: 'pick-field', caret: null, nodeId: chip.nodeId });
        return;
      case 'cond-op':
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
    this.editMode.set({ kind: 'pick-field', caret, nodeId: null });
  }

  /** Toggle a group's NOT flag or its AND/OR operator inline (no popup). */
  private onLogicalActivate(chip: ChipVm): void {
    const isNot = chip.key.endsWith(':not');
    this.commit(
      updateNode(this.ast(), chip.nodeId, (node) =>
        node.kind === 'group'
          ? isNot
            ? { ...node, not: !node.not }
            : { ...node, operator: node.operator === 'and' ? 'or' : 'and' }
          : node,
      ),
    );
  }

  // --- popup commits ----------------------------------------------------------

  protected onPickField(field: string): void {
    const mode = this.editMode();
    if (mode.kind !== 'pick-field') {
      return;
    }
    if (mode.nodeId) {
      this.commit(
        updateNode(this.ast(), mode.nodeId, (node) =>
          node.kind === 'condition' ? { ...node, field } : node,
        ),
      );
      this.editMode.set({ kind: 'pick-operator', nodeId: mode.nodeId });
    } else if (mode.caret) {
      const node = newCondition(field);
      this.commit(insertChild(this.ast(), mode.caret.contextNodeId, mode.caret.insertIndex, node));
      this.editMode.set({ kind: 'pick-operator', nodeId: node.id });
    }
  }

  protected onPickOperator(operator: string): void {
    const mode = this.editMode();
    if (mode.kind !== 'pick-operator') {
      return;
    }
    this.commit(
      updateNode(this.ast(), mode.nodeId, (node) =>
        node.kind === 'condition' || node.kind === 'fn'
          ? { ...node, operator: operator as PartialOperator }
          : node,
      ),
    );
    this.editMode.set({ kind: 'edit-value', nodeId: mode.nodeId });
  }

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
