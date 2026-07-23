# Query-Authoring Filter UI v2 — Freeform Editor

A ground-up redesign of the query-authoring UI around a **single freeform text editor per
section**. The user types the whole expression as text; recognized parts render as **inline
chips** and the valid parse is serialized to the `QueryDefinition` JSON the query API already
accepts. No staged builders, no toggles, no add/remove buttons — you type, and it stays.

Working prototype: [./filter-ui-prototype-v2.html](./filter-ui-prototype-v2.html)
(self-contained; open in a browser). The earlier staged-chip prototype
([./filter-ui-prototype.html](./filter-ui-prototype.html)) and its design doc
([filter-ui.md](filter-ui.md)) are superseded by this document for interaction design; the data
sources and serialization contracts below are unchanged.

## Core principle: one editor, five profiles

Every section (Where, Select, Group-by, Having, Order-by) is the **same component**
(`QueryEditor` in the prototype): a syntax-highlighting `contenteditable`. It differs only by a
grammar _profile_:

| Profile   | Grammar                                                 | Serializes to                                  |
| --------- | ------------------------------------------------------- | ---------------------------------------------- |
| `where`   | boolean: comparisons joined by `AND`/`OR`/`NOT` + `( )` | `{condition, not, rules}`                      |
| `having`  | boolean, aggregate LHS only                             | `{operator, expressions}` (or bare comparison) |
| `select`  | comma list of `expr [as alias]`                         | `[column \| function \| window_function]`      |
| `groupby` | comma list of columns                                   | `[name, …]`                                    |
| `orderby` | comma list of `column[:dir]` / `column dir`             | `[{column, direction}]`                        |

Keeping one code path is what stops a fix in one panel from breaking another — the failure mode
that recurred when the logic was duplicated across hand-written inputs.

## The freeform editor

- **Inline chips are real text.** A recognized comparison (or list item) is a styled run of the
  _actual editable characters_, wrapped in a light-blue dashed pill. Editing happens **in place**,
  character by character — the chip is decoration over the text, never a separate widget. One chip
  wraps one whole comparison, e.g. `lower(event.action) = 'delete'` is a single pill.
- **Live re-highlight.** On every keystroke the text is re-parsed and re-rendered; the caret is
  restored by character offset. Syntax colors: fields, function names (per kind), operators,
  strings, numbers, keywords, parens.
- **Caret-anchored autocomplete.** A suggestion dropdown appears at the caret, **left-aligned**
  (and clamped to the editor's left edge when empty). It is context-aware (see _Autocomplete_).
- **One logical line.** `Enter` does not insert a newline; it accepts the highlighted suggestion,
  or is a no-op. Long queries wrap.

## Validation happens only when focus is lost

While the editor is focused, the UI **assumes the user will complete each chip correctly** — no
red, no nagging, even for a half-typed comparison. On **blur**, the editor validates:

- invalid comparisons get a solid red border;
- unknown fields / stray tokens get a red marker;
- an error line under the editor summarizes the reasons.

The **payload stays live** regardless of focus: only _valid_ comparisons are serialized at every
keystroke; incomplete/invalid ones are silently excluded (and only _shown_ as invalid on blur).

## Where / Having (boolean grammar)

Typed left-to-right: `LHS operator value`, combined with logical keywords and parentheses.

### Left-hand side

- A **column** (`event.action`, dotted paths) or a **function call** (`lower(message)`).
- Functions can be **nested** (a function as an argument). Per-argument autocomplete filters
  candidate columns/functions by the parameter's accepted types.
- **Where** offers columns + scalar functions; an aggregate typed here is rejected (→ Having).
- **Having** offers only aggregate functions as the root; a bare column or scalar function is
  rejected. The panel is disabled until Group-by is non-empty.
- The comparison runs against the LHS's resolved type (the column's type, or the function's
  **output** type).

### Operators

- **Symbol over name.** The dropdown shows one canonical entry per operator — `=`, `≠`, `>`, `≥`,
  `<`, `≤`, `in`, `not in`, `is empty`, `starts with`, `contains`, `like`, `regexp`, `in cidr`,
  `has key`, … — **not** a list of aliases (`==`, `eq`, `equals` are accepted on input but never
  shown).
- The operator dropdown appears **tight after the LHS**, restricted to the operators valid for the
  LHS type (from `/v1/operators`). Both the symbol and the underscore name are accepted when typing.

### Values

Freeform text, no nested input widget:

| Type / operator                 | Typed value              | Serialized |
| ------------------------------- | ------------------------ | ---------- |
| string / ip / uuid              | bareword or `'quoted'`   | string     |
| number                          | `5`, `3.14`              | number     |
| boolean                         | `true` / `false`         | bool       |
| `is_empty` / `is_not_empty`     | _(nothing)_              | `null`     |
| `is_in` / `is_not_in`           | `a, b` or `[a, b]`       | array      |
| `is_in_cidr` / `is_not_in_cidr` | `10.0.0.0/8` (validated) | string     |

### Logical operators and grouping

- The user types **`AND` / `OR`** themselves (case-insensitive). There is **no** AND/OR dropdown
  and **no** top-of-panel toggle. `NOT` prefixes a comparison or group.
- Anything other than `AND`/`OR` in a connector slot is flagged (red on blur) and excluded.
- **Grouping is automatic from typed parentheses** — `a = 1 AND (b = 2 OR c = 3)`. There is no
  `+ group` button. This maps 1:1 onto the nested expression JSON.

### Container fields (limited in freeform)

Scalar comparisons are fully supported. Container operators that need a single inner value are
supported and serialized to the documented shape (`array contains` → scalar; `array any_match` /
`all_match`, `map has_key` / `has_value` → `{operator: "equal", value}`). Operators that require
selecting a key / struct field / union variant (`map contains`, `struct`, `union`) are flagged as
needing the structured editor and excluded from the payload.

## Select / Group-by / Order-by (list grammar)

Comma-separated items; each item is an inline chip.

- **Select** — `column` or `function(args)`, optionally `as alias`. The alias may be a bareword
  (`as cnt`) or **quoted, including spaces** (`as "big total"`). Serialization: a bare column → its
  name (or `{type: "column", name, alias}` when aliased); scalar/aggregate function →
  `{type: "function", name, args, alias?}`; analytic → `{type: "window_function", …}` (the OVER
  editor is out of scope for this prototype).
- **Group-by** — column tokens only. Server rule surfaced live: _every non-aggregate select item
  must also be in group-by_ (the API rejects otherwise).
- **Order-by** — `column`, `column:desc`, or **`column desc`** (space-separated direction). While
  the word after a column is a prefix of `asc`/`desc`, an asc/desc suggestion shows and the chip
  stays open; once it no longer matches, it is treated as the **next column** and the prior chip
  closes at the space. Select aliases are **not** resolvable here — order by real columns.

## Chips: hover to delete

Hovering a chip adds a **glow** and reveals an **×** delete button at its right edge that removes
the entire condition (and its adjacent `AND`/`OR`, or comma for list items).

**A hover must never cause a re-layout.** The glow is a `box-shadow` and the × is a
`position: fixed` overlay positioned from the chip's bounding rect — so it can **overlay chips to
the right** without shifting anything. (A re-layout on hover would jitter everything to the right
on every mouse move — unacceptable.)

## Autocomplete details

Context is derived from the caret position:

- **head / after a logical keyword or `(`** → columns + functions for the profile;
- **after a complete LHS** → operators for the LHS type;
- **inside a function's parens** → columns whose type the current parameter accepts, plus scalar
  functions whose output type it accepts (one positional argument at a time); `count` offers `*`;
- **after a complete comparison** → nothing (the user types `AND`/`OR`);
- **order-by, after a column + space** → `asc` / `desc`.

Function suggestions insert `name()` with the caret between the parens. Column suggestions insert
the field name. Function descriptions are shown in the dropdown header. Navigation: `↑`/`↓` move,
`Enter`/`Tab` accept, `Esc` closes.

## Type-name bridging

Function parameter/output types use query-builder class names (`decimal`, `bool`, `literal_int`,
…) while fields and the operator catalog use generic filter-schema names (`number`, `boolean`, …).
The UI maps class names to generic names to (a) filter argument-column candidates against a
parameter's accepted types and (b) resolve a function's output type to an operator set. `any` and
unions widen to `any` (all operators; the server still validates).

## Assembled payload

The five editors combine into the submitted `QueryDefinition`:

```json
{
  "select": [
    { "type": "column", "name": "event.category" },
    { "type": "function", "name": "count", "args": ["*"], "alias": "cnt" }
  ],
  "where": {
    "condition": "and",
    "not": false,
    "rules": [
      {
        "field": { "type": "function", "name": "lower", "args": ["event.action"] },
        "operator": "equal",
        "value": "delete"
      },
      { "field": "source.ip", "operator": "is_in_cidr", "value": "10.0.0.0/8" }
    ]
  },
  "groupBy": ["event.category"],
  "having": {
    "field": { "type": "agg_function", "name": "count", "args": ["*"] },
    "operator": "greater_than",
    "value": 10
  },
  "orderBy": [{ "column": "event.category", "direction": "desc" }]
}
```

Serialization quirks honored (verified against `QueryDefinition.model_validate`): `where` is
always a logical node (a lone comparison is wrapped in `{condition, not, rules}`); the Having
aggregate field's discriminator is `"agg_function"` (not `"function"`); a Having logical wrapper
uses the `operator`/`expressions` spelling (a bare comparison also works); Order-by takes real
columns, not select aliases.

## Data sources

Unchanged from v1 — three static-per-deployment catalogs drive all autocomplete, each cached via
`ETag` / `If-None-Match`:

1. `GET /v1/tables/{id}/filter-schema` — fields (`field`, `label`, `type`, `hive_type`); container
   types keep a nested `type` dict (`array.element_type`, `map.key_type`/`value_type`,
   `struct.fields[].name`, `union.variants[].tag`).
2. `GET /v1/functions` — function catalog (`name`, `kind`, `parameters`, `output`, `description`,
   window flags).
3. `GET /v1/operators` — operators per type (keyed by the exact `type.type` strings the
   filter-schema emits). Quirks: `number` has no `is_empty`; `binary` has zero operators (its
   fields are unusable); `any` claims every operator; `union` filters only work on SQL engines.

The prototype embeds a representative sample of all three plus a **Connect** control to fetch the
live catalogs from a running service.

## Gaps / out of scope for v1

- **Value autocomplete** (live values like `status:error`) — needs a per-field values endpoint;
  every keystroke class of lookup costs a Trino query. Deferred.
- **Container structured editor** — `map contains` / `struct` / `union` comparisons that need a
  key/field/variant selection are flagged, not authored, in freeform.
- **OVER clause** for window functions (partition / order / frame) — analytic functions serialize
  to `{type: "window_function", …}` without the OVER editor.
- **Joins / column-to-column comparisons** — the API supports them; the editor does not expose them.
