# Claude Code

Signal-forms — an Angular **22** CLI app exploring Angular's experimental **Signal Forms** API.
The app is a monolith (`src/app`) containing experimental packages as sub-folders.

## Stack (non-obvious)

- **Angular 22**, **standalone components only** — there are no NgModules; bootstrap is
  `bootstrapApplication(App, appConfig)` in [src/main.ts](src/main.ts).
- **Zoneless** change detection — `zone.js` is intentionally not a dependency. Do not add it or
  `provideZoneChangeDetection`. Code must rely on signals for reactivity.
- **Signal Forms** (`@angular/forms/signals`: `form()`, `FormField`, `MaybeFieldTree`) — this is the
  experimental API the project exists to explore. Expect bleeding-edge, sparsely-documented surface.
- **Angular Material 22 + CDK**, theme in [src/material-theme.scss](src/material-theme.scss).
- **Tailwind CSS v4** via PostCSS ([.postcssrc.json](.postcssrc.json), `@tailwindcss/postcss`),
  imported in [src/styles.css](src/styles.css). Use utility classes (e.g. `host: { class: 'block' }`).
- `.npmrc` sets `force=true`: installs run with `--force` because the bleeding-edge Angular/NgRx
  versions produce peer-dependency conflicts. This is expected, not a mistake.

## Commands

- `npm start` — dev server at `http://localhost:4200` (`ng serve`, zoneless dev build).
- `npm run build` — production build to `dist/` (default config is production).
- `npm test` — unit tests via **Vitest** (`@angular/build:unit-test` builder, jsdom). **Not** Karma/Jasmine.
- No e2e framework is configured.

## Conventions

- **File naming follows the new Angular style — no `.component`/`.service` suffixes.** A component is
  `query-builder.ts` / `.html` / `.scss`, class `QueryBuilder` (no `Component` suffix). Selectors are
  prefixed `app-` (e.g. `app-query-builder`, `app-qb-expression`). New components default to SCSS.
- Templates and styles are always separate files (`templateUrl` / `styleUrl`), never inline.
- Signal-based I/O only: `input.required()`, `model.required()`, `output()`, `signal()`. No
  `@Input()`/`@Output()` decorators, no constructor injection for I/O.
- Prettier: single quotes, `printWidth: 100`, 2-space indent ([.prettierrc](.prettierrc)). TS strict
  options are on (`noImplicitOverride`, `noPropertyAccessFromIndexSignature`, etc.).
- **Barrel exports everywhere.** Each feature sub-dir (`components/`, `constants/`, `models/`,
  `utils/`) has an `index.ts`, plus a feature-root barrel. Import via barrels
  (e.g. `from '../../models'`, `from './query-builder'`), not deep paths.

## Architecture

- Never use RxJS `BehaviorSubject` for local state. (Note: component-local form state is held in
  Signal Forms `model()` + `form()`, not a store — see the query-builder.)
- Feature modules follow a feature-driven layout: `src/app/[feature-name]/`.
- The query-builder model is a **recursive expression tree**: a `LogicalExpression`
  (`and`/`or`, `not`, nested `expressions[]`) or a leaf `ConditionExpression` (`field_name`,
  `operator`, `value`) — see [models/expressions.ts](src/app/query-builder/models/expressions.ts).
  Discriminate with `isLogical` / `isCondition` from `utils`.
- Because change detection is signal-based, tree mutations must **refresh object references** at every
  level along the path (spread the root, items array, and touched nodes) or updates won't propagate —
  see `updateModel` in
  [components/query-builder/query-builder.ts](src/app/query-builder/components/query-builder/query-builder.ts).
  Create new nodes with `newCondition()` / `newExpression()` to avoid sharing references.

## Testing

- Do not generate unit test files.
