Act as a Principal Software Engineer specializing in Frontend Architecture, Compiler Theory, and the Angular framework.

I need your help designing and implementing an advanced, custom text-based search bar, similar to Jira's JQL filter bar. The component must operate in two interchangeable modes, switchable via a toggle button:

1. Visual Mode: Renders interactive, structured visual chips for query segments with specific syntax highlighting colors.
2. Editable Mode: A contenteditable bar where the user can type freely and click to position the cursor. The user can switch back to Visual Mode if the string is parseable.

Both modes must bidirectionally interact with a single JSON model formatted as an Abstract Syntax Tree (AST).

=== DELIVERABLES ===
1. TypeScript interfaces for the AST.
2. A lexer/parser implementation (using native TypeScript or a parser generator if appropriate).
3. The Angular Component architecture (e.g., using a state service to manage the AST and UI modes).
4. The strategy for syncing the contenteditable view with the AST.
5. Code implementation for syncing state and rendering the view.

=== CONSTRAINTS ===
- Angular Version: 22 (Use Standalone components, Signals, and the Control Flow block syntax).
- Styling: Use Angular's encapsulated CSS or Tailwind. Make sure visual mode chips and editable text never overlap in an incoherent manner.
- Do not use existing components in the repository. Complete the task inside only the query-bar package.

=== FORMAL GRAMMAR ===
The real-time parsing engine must support this grammar:
- Condition: `field_name OPERATOR 'value'` (e.g., `env = 'production'`)
- Function Condition: `function_name(col1, col2,...)` (e.g., `COALESCE(col1, col2, 0)`)
- Logical Operators: Conjunction `AND` and Disjunction `OR` (case-insensitive)
- Grouping: Parentheses nested to any depth: `(A OR B) AND C`
- Negation: A `NOT` prefix for single conditions or grouped blocks (e.g., `NOT status = success or NOT (A AND B)`)

=== COLOR CONVENTION (CSS Variables) ===
- Fields/Functions: --identifier-color: #93C5FD
- Operators (=, !=, <, >): --operator-color: #CA8A04
- Logical Operators (AND/OR): --op-color: #F9A8D4
- Negation (NOT): --not-color: #FCD34D
- String or Numeric Values: --value-color: #86EFAC

=== BASE INTERFACES ===
The list of supported operators is in src/app/query-bar/constants/operator.labels.ts
The input columns and functions are typed in FilterDefinition at src/app/query-bar/models/filters.ts
An example of the input filter definitions is available at src/app/app.data.ts

=== EXAMPLE QUERY & EXPECTED AST ===
Input: `status = 'open' AND (assignee = 'john' OR reporter = 'jane')`
Output AST: (Provide the JSON structure that represents this expression)

=== VISUAL MODE BEHAVIOR ===
1. When enabled, a dropdown/autocompleter shows available columns or functions.
2. After selection, available operators are shown.
3. If the operator requires a value, a value input field appears. This builds a Condition/Function.
4. The user can then chain conditions with logical conjunctions, negate conditions, or group them.

=== EDITABLE MODE BEHAVIOR===
1. when the user click to position the cursor at any point of the bar, it will activate the current segment dropdown
2. the autocompleter will take as input, from the beggining of the segment to the cursor position, to filter the current segment options
3. left/right arrow keys will update the filter string while top/down arrows will be used to select an option of the autocompleter
4. enter key will be used to select an autocompleter option, but if no autocompleter is active then the current query is submitted

=== WORKFLOW ===
Please do not write the entire application at once. First, output the TypeScript AST interfaces. Then, let's review them before you proceed to the Parser, State Service, and Components.

Inline chip editing — click a value/operator chip to edit it (currently chips support removal + full text editing; value/operator editing in-place is the next increment).
