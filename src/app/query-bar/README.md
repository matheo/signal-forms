# Query Bar

A two-mode query bar — **Visual chips ⇄ editable Text** — over a single boolean
clause. The grammar is `AND`/`OR`/`NOT`, parenthesized groups, `field op value`
conditions, and `fn(args)` calls. Both views are projections of **one** AST, so
they can never disagree.

> The separate v2 five-clause composer exploration (`QueryComposer` /
> `QueryEditor`, the per-profile analyzers, `filter-ui-v2.md`) now lives in its
> own [`query-js`](../query-js/) package. This package is the v1 AST bar only.

Pure-signal + zoneless, standalone components, framework-free engines in
`utils/` (parser/printer/highlight are plain functions the components wrap in
`computed`/`effect`, so they stay harness-testable without Angular).

## Folder layout

```text
query-bar/
├── components/
│   ├── query-bar/   shell: Text⇄Visual toggle, consumer API, parse-error list
│   ├── qb-editor/   Text mode — contenteditable projecting the buffer
│   └── qb-visual/   Visual mode — the AST rendered as interactive chips
├── services/
│   └── query-bar-store.ts   source buffer ⇄ derived AST, mode + gating
├── models/    ast.ts (QueryNode tree) + domain types (filters/functions/operators/forms)
├── constants/ operator labels + type→operator tables
└── utils/     lexer · parser · printer · walk · highlight
```

## The core decision: one source of truth

The text buffer is canonical; the AST is derived:

```text
source (signal<string>) ──parse()──▶ parsed (computed) ──▶ ast, errors, isParseable
```

`parse()` runs **once per buffer change** (memoized in the `parsed` computed);
`ast` / `errors` / `isParseable` all read from it. There is only ever one
editable thing, which kills two-way-binding divergence — the "single JSON model"
the two views share is the computed `ast`. The parser never throws: it returns
`{ ast, errors }`.

## Parsing engine

- **Explicit groups** preserved — `(assignee = 'john' OR reporter = 'jane')`
  survives parse→print.
- **Precedence** — `A AND B OR C` → OR-of-(AND, C); the printer re-emits text
  that re-parses to the same tree.
- **NOT** over both a condition and a group.
- **Functions** — `COALESCE(col1, col2, 0)` with mixed identifier/number args.
- **Multi-word / valued / no-value operators** — `IN ('a','b')`, `IS NOT EMPTY`
  — all resolved from the single `operatorLabels` source of truth (see below).

## Bidirectional sync

| Direction | Entry point | Flow |
| --- | --- | --- |
| Text mode types | `setSource(text)` | buffer set verbatim → AST re-derives live (partial/invalid tolerated) |
| Visual edits a chip | `replaceNode(target, next)` / `updateAst(fn)` | new tree → `print()` → buffer → re-parse (spans refreshed) |

Because visual edits round-trip through `print()`, chips and caret offsets stay
consistent after every edit — no stale spans.

## Mode gating

`setMode('visual')` **refuses** unless `isParseable()` (empty **or** a clean
parse to a non-null tree). Text mode is always reachable. `toggleMode()` honors
the gate and returns success so the UI can flash the toggle when a switch is
blocked. `nodeAtOffset(caret)` maps the caret to the innermost node, so a
Text→Visual switch can keep the user on the same segment.

## Contenteditable ↔ AST strategy

The editor never two-way-binds `innerHTML`. Instead:

1. **AST → view**: emit one `<span>` per token, colorized via CSS variables. This
   is *read-only rendering* of the buffer — the DOM mirrors `source`, it is not
   the source.
2. **View → AST**: on `input`, read `textContent` (ignoring our span wrappers) →
   `setSource()`. One direction, no HTML round-trip.
3. **Caret preservation**: before re-render, capture the caret as a plain
   character offset into `textContent`; after re-render, walk the new spans to
   restore it. This survives re-highlighting because the offset is against text,
   not DOM nodes.
4. **Text→Visual handoff**: `nodeAtOffset(caret)` keeps focus on the same segment
   across a mode switch.

## Modes

- **Text mode** ([`qb-editor.ts`](components/qb-editor/qb-editor.ts)) — a true
  `contenteditable` with `spellcheck="false"`. Every keystroke → `setSource()` →
  an effect re-renders per-token `<span class="seg seg--…">` via
  [`highlight()`](utils/highlight.ts), colorized live (even mid-edit/invalid),
  with the caret preserved as a text offset. Enter is suppressed (single line).
  Segment styles use `::ng-deep` since the spans are injected via `innerHTML`
  (outside emulated encapsulation).
- **Visual mode** ([`qb-visual.ts`](components/qb-visual/qb-visual.ts)) — recurses
  on its own selector to render the AST as chips: logical `AND`/`OR` connectives,
  `NOT` prefix, `( )` groups, `field op value` conditions, `fn(args)`. Each
  condition/function has a `×` that calls `store.replaceNode(node, null)`, which
  reprints the tree back into the buffer.
- **Toggle** ([`query-bar.html`](components/query-bar/query-bar.html)) — the
  **Visual** option is `[disabled]` whenever `!isParseable()`, so you cannot enter
  chip mode on text that does not parse; parse errors list below the bar.

## Colors

The syntax-highlight CSS variables live on the shell's `:host` in
[`query-bar.scss`](components/query-bar/query-bar.scss) — custom properties
inherit through the DOM, so both the editor spans and the visual chips (child
components) pick them up without redefinition.

## Consumer API

```html
<app-query-bar [(query)]="text" (astChange)="onAst($event)" />
```

`query` two-way-binds the raw text; `astChange` emits the shared AST. The
`QueryBarStore` is `providers`-scoped on `QueryBar`, so each instance owns its
state independently. (Not currently mounted in the app — instantiate the shell
where a boolean query bar is needed.)

## Shared foundation

- **`constants/`** — operators are matched by **reversing** `operatorLabels`
  ([`operator.labels.ts`](constants/operator.labels.ts)), so surface syntax stays
  in sync with the enum automatically; symbolic (`=`, `>=`) and word ops
  (`STARTS WITH`, `IS NOT EMPTY`) share one path.
  [`operator.types.ts`](constants/operator.types.ts) maps field types to the
  operators they allow.
- **`models/`** — [`ast.ts`](models/ast.ts) is the `QueryNode` discriminated
  union (`logical` / `not` / `group` / `condition` / `function`), each node
  carrying an optional `SourceSpan` for caret↔node mapping. The rest are domain
  types (`filters.ts`, `functions.ts`, `operators.ts`, `forms.ts`).
- **`utils/`** — `lexer` (tokenize) → `parser` (`parse → {ast, errors}`) →
  `printer` (`print(ast) → text`); `walk` (`nodeAt` / `replaceNode`) for
  structural edits; `highlight` for the always-on token segmentation the Text
  editor renders.
