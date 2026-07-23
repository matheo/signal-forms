# Query JS — v2 Query Composer

The v2 exploration: **one** syntax-highlighting `contenteditable` editor reused
across five grammar **profiles** (Where / Having / Select / Group By / Order By),
which together serialize into the single `QueryDefinition` the query API accepts.

> The v1 Text ⇄ Visual AST bar (`QueryBar` / `QbEditor` / `QbVisual`, the
> parser/printer engine) lives in the sibling [`query-bar`](../query-bar/)
> package. This package reuses that package's **domain types**
> (`FilterDefinition`, `FunctionDefinition`, the filter-type shapes) — see
> [Foundation](#foundation) — but is otherwise independent. Not currently mounted
> in the app; instantiate `<app-query-composer>` where a query bar is needed.

Pure-signal + zoneless, standalone components. The heavy lifting lives in
**framework-free `utils/`** functions the components wrap in `computed`/`effect`,
so the logic stays harness-testable without Angular. Everything here was ported
line-by-line from the standalone prototype
([`filter-ui-v2.html`](filter-ui-v2.html) / spec [`filter-ui-v2.md`](filter-ui-v2.md)),
replacing its mutable `Catalog` global with an injected, immutable `CatalogIndex`.

## Folder layout

```text
query-js/
├── components/
│   ├── query-composer/   container: five sections → one QueryDefinition
│   └── query-editor/     reusable syntax-highlighting contenteditable
├── services/
│   └── catalog-store.ts  shared fields/functions/operators → CatalogIndex
├── models/    wire shapes (query-definition, catalog) + transient ASTs
│              (bool-ast, list-ast) + editor/suggestion models
├── constants/ wire-operators.ts (display map + matchOperator/NO_VALUE_OPS/CIDR_OPS)
└── utils/     the framework-free analyze → serialize → assemble engine
```

## Profiles

| Profile | Grammar | Analyzer | Serializes to |
| --- | --- | --- | --- |
| `where` | boolean (`AND`/`OR`/`NOT`, `( )`, `field op value`) | `BoolAnalyzer` | `where` group |
| `having` | boolean (aggregate conditions) | `BoolAnalyzer` | `having` (only when grouped) |
| `select` | comma list of columns / `fn(args) [as alias]` | `ListAnalyzer` | `select[]` |
| `groupby` | comma list of columns | `ListAnalyzer` | `groupBy[]` |
| `orderby` | comma list of `column[:dir]` / `column dir` | `ListAnalyzer` | `orderBy[]` |

## Data flow

```text
catalogs (fields/functions/operators)
        │  CatalogStore.set(...)
        ▼
   CatalogIndex   ── computed, rebuilt only when a source changes
        │
   per keystroke, per section:
        ▼
   analyze(text, profile)          bool-analyzer.ts / list-analyzer.ts
        │  → { tokens, items/tree, compById }
        ├──▶ tokensToHtml(tokens)   editor-render.ts   → highlighted innerHTML + chips
        ├──▶ profileErrors(...)     analyze-profile.ts → blur-gated error line
        └──▶ assembleQuery(all 5)   assemble.ts        → QueryDefinition (emitted)
```

- **`CatalogStore`** ([`services/catalog-store.ts`](services/catalog-store.ts))
  holds the three static-per-deployment catalogs as signals and exposes a
  derived immutable **`CatalogIndex`** ([`utils/catalog-index.ts`](utils/catalog-index.ts)).
  It is provided **once** at `QueryComposer` (`providers: [CatalogStore]`) so all
  five editors resolve fields/functions/operators against the same index.
  `CatalogIndex` mirrors the prototype's `opsFor`/`fieldByName`/`fnByName` lookups
  and the `any`-type operator fallback.
- **`QueryComposer`** ([`components/query-composer/query-composer.ts`](components/query-composer/query-composer.ts))
  owns the five `model('')` text buffers, feeds the catalog inputs into the
  store, runs `analyzeAll` → `assembleQuery` in a `computed`, and emits
  `queryChange`. It also derives the group-by-gap warning
  (`nonGroupedSelectColumns`) and gates Having behind a non-empty group-by.
- **Assembly** ([`utils/assemble.ts`](utils/assemble.ts)) is the one place the
  five pipelines meet: keys are emitted only when non-empty, `where` is always a
  group (a lone comparison is wrapped), and `having` is suppressed unless a
  group-by exists.

## The reusable editor

`QueryEditor` ([`components/query-editor/query-editor.ts`](components/query-editor/query-editor.ts))
is one `contenteditable` used by every section. It shows a **styled view of the
real text** — the analyzer re-tokenizes on each keystroke and
[`tokensToHtml`](utils/editor-render.ts) rebuilds the highlighted markup, so the
caret still walks character-by-character:

- **Render loop** — a single `effect` keyed on `analysis()` + `validated()` +
  `value()` rewrites `innerHTML` only when it changed, saving/restoring the caret
  as a plain character offset (via a `TreeWalker`), so re-highlighting never
  moves the cursor. HTML is escaped in `editor-render.ts` since `innerHTML` is
  set imperatively (bypasses Angular's sanitizer).
- **Chips** — consecutive tokens sharing a `compId` (one comparison / list item)
  are wrapped in a `.chip` span carrying its source span (`data-s`/`data-e`).
  Styling is a filled slate pill with the syntax colors (`--identifier-color`,
  `--operator-color`, `--op-color`, `--value-color`).
- **Suggestions** — [`suggestFor`](utils/autocomplete.ts) turns text + caret +
  profile into pure `SuggestionResult` data (columns / functions / operators /
  literals / directions); the component renders a caret-anchored dropdown and
  inserts on pick, then re-opens for the next slot.
- **Validation** — errors are gated behind blur (`validated` signal): the user is
  assumed to be completing each chip while typing, so mistakes surface only once
  focus leaves.
- **Hover-delete** — hovering a chip reveals a floating `×` (fixed-position, so it
  never re-layouts the text). Deleting a chip removes its `data-s..data-e` span
  and heals the surrounding grammar — swallowing a neighbouring `AND`/`OR` (bool
  profiles) or comma (list profiles), then trimming and re-joining.

Consumer shape:

```html
<app-query-composer
  [fields]="filters()" [functions]="functions()" [operators]="operators()"
  (queryChange)="query.set($event)" />
```

## Foundation

- **`models/`** — the wire shapes in
  [`query-definition.ts`](models/query-definition.ts) (`QueryDefinition`,
  `WhereGroup`/`WhereRule`, `HavingNode`, `SelectItem`, `OrderByItem`,
  `WireOperator`, `QueryValue`) and the catalog shapes in
  [`catalog.ts`](models/catalog.ts) (`GenericType`, `OperatorSet`,
  `OperatorCatalog`, `CatalogSource`); the two **transient** analyzer ASTs
  ([`bool-ast.ts`](models/bool-ast.ts), [`list-ast.ts`](models/list-ast.ts)) the
  analyzers produce per keystroke; and the editor/suggestion models
  ([`editor-token.ts`](models/editor-token.ts), [`suggestion.ts`](models/suggestion.ts)).
- **`constants/`** — [`wire-operators.ts`](constants/wire-operators.ts): the
  wire-name display map (`OP_DISPLAY`) and helpers (`matchOperator`,
  `NO_VALUE_OPS`, `CIDR_OPS`). (The enum↔label reversal lives with the v1 grammar
  in `query-bar`.)
- **`utils/`** — the pipeline: `catalog-index`, `bool-analyzer`, `list-analyzer`,
  `analyze-profile`, `bool-serialize`, `list-serialize`, `assemble`,
  `autocomplete`, `editor-render`, plus the shared expression primitives
  `expr-lexer`, `expr-serialize`, `expr-type`, `type-bridge`, `value-coerce`.
- **Cross-package dependency** — the domain catalog types (`FilterDefinition`,
  `FunctionDefinition`, `FunctionDataType`, `ArrayFilterType` / `MapFilterType` /
  `StructFilterType`) are imported from [`query-bar`](../query-bar/); they are not
  redefined here. The package barrel [`index.ts`](index.ts) currently re-exports
  only `./models`, so import components/services/utils from their sub-barrels.
