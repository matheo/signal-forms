# Query Bar

## Design

Operators are matched by **reversing** `operatorLabels`, so surface syntax stays in sync with the enum automatically. Symbolic (`=`, `>=`) and word ops (`STARTS WITH`) share one path.
The parser never throws — it returns `{ ast, errors }`. That's what the Visual↔Text toggle will gate on: `errors.length === 0 && ast !== null` ⇒ safe to switch to Visual mode.

## Parsing engine

- **Explicit groups** preserved — `(assignee = 'john' OR reporter = 'jane')` survives parse→print.
- **Precedence** — `A AND B OR C` → OR-of-(AND, C); printer re-emits text that re-parses to the same tree.
- **NOT** over both a condition and a group.
- **Functions** — `COALESCE(col1, col2, 0)` with mixed identifier/number args.
- **Multi-word / valued / no-value operators** — `IN ('a','b')`, `IS NOT EMPTY` — all resolved from the single `operatorLabels` source of truth.

## The core decision: one source of truth

The text buffer is canonical; the AST is derived:

```text
source (signal<string>)  ──parse()──▶  parsed (computed)  ──▶  ast, errors, isParseable
```

`parse()` runs **once per buffer change** (memoized in the `parsed` computed); `ast`/`errors`/`isParseable` all read from it. This kills two-way-binding divergence — there's only ever one editable thing. The "single JSON model" the two views share is the computed `ast`.

## Bidirectional sync

Direction                 | Entry point       | Flow
Text mode types           | `setSource(text)` | buffer set verbatim → ast re-derives live (partial/invalid tolerated)
Visual mode edits a chip  | `replaceNode(target, next)` / `updateAst(fn)` | new tree → `print()` → buffer → re-parse (spans refreshed)

Because visual edits round-trip through `print()`, chips and caret offsets stay consistent after every edit — no stale spans.

## Mode gating

`setMode('visual')` **refuses** unless `isParseable()` (empty **or** clean parse to non-null). Text mode is always reachable. `toggleMode()` honors the gate and returns success so the UI can flash the toggle when a switch is blocked.

## Contenteditable ↔ AST strategy

The editor won't two-way-bind innerHTML. Instead:

1. **AST → view**: walk the tree, emit one `<span>` per leaf/keyword token using each node's `span` to slice the original text, color via the CSS variables. This is *read-only rendering* of the buffer — the DOM mirrors `source`, it isn't the source.
2. **View → AST**: on `input`, read `textContent` (flattened, ignoring our span wrappers) → `setSource()`. One direction, no HTML round-trip.
3. **Caret preservation**: before re-render, capture the caret as a **plain character offset** into `textContent` (sum of preceding text lengths). After re-render, walk the new spans to restore the caret at the same offset. This survives re-highlighting because the offset is against text, not DOM nodes.
4. **Text→Visual handoff**: `nodeAtOffset(caret)` maps the caret to the innermost node, so switching modes can keep the user focused on the same segment.

This keeps the two modes coherent — the editable text and the visual chips never fight over the DOM because chips are a projection of the buffer, not a competing editor.

## Modes

- **Text mode** — qb-editor.ts: a true `contenteditable` with `spellcheck="false"`. Every keystroke → `setSource()` → an effect re-renders per-token `<span class="seg seg--…">`, colorized live (even mid-edit/invalid), with the caret preserved as a text offset. Enter is suppressed (single-line). Segment styles use `::ng-deep` since the spans are injected via `innerHTML` (outside emulated encapsulation).
- **Visual mode** — qb-visual.ts: recurses on its own selector to render the AST as chips — logical `AND/OR` connectives, `NOT` prefix, `( )` groups, `field op value` conditions, `fn(args)`. Each condition/function has a `×` that calls store.`replaceNode(node, null)`, which reprints the tree back into the buffer.
- **Toggle** — query-bar.html: the **Visual** option is `[disabled]` whenever `!isParseable()`, so you can't enter chip mode on text that doesn't parse; parse errors list below the bar.

## Colors

The exact CSS variables from your spec live on the shell's `:host` in query-bar.scss — custom properties inherit through the DOM, so both the editor spans and the visual chips (child components) pick them up without redefinition.

## Consumer API

```html
<app-query-bar [(query)]="text" (astChange)="onAst($event)" />
```

`query` two-way-binds the raw text; `astChange` emits the shared JSON AST. Store is `providers`-scoped, so each instance is independent.
