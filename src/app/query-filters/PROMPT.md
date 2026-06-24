Act as a senior Angular developer specialized on enterprise architectures and UI advanced patterns.

We are building an advanced text-based query filter bar (similar to DataDog's search interface) using Angular (Standalone Components) and Angular Material.

== ARCHITECTURAL CONTEXT ==
1. Package: create an enhanced query-builder package (sibling to the current query-builder folder) with its own components, parsing/lexing service and optimized models
2. Entry component: one exported entry component similar to the existing <app-query-builder> (ie. <app-query-filters>) to receive the following inputs:
  - model: ModelSignal<LogicalExpression> to process
  - filters: InputSignal<FilterDefinition[]> the available columns/functions (see src/app/app.data.ts for reference)
3. UI structure (DataDog style): the user interacts with a query bar that renders structured visual chips, allowing free-text edition inside dynamically inserted controls. We use monospace font formatting for operators to align cleanly
4. Color convention:
  - Gray: for (column/function:operator:value) chips, the selected chip should be light-blue.
  - Purple for logical conjunctions (AND, OR) and grouping parenthesis.

=== DATA MODELS ==
5. Models: use the existing LogicalExpression and FilterDefinition as reference, but create new models with more efficient ways to represent the data. The unit of data is the ConditionExpression, with a given column or function (field_name), an operator, and a value. They can be concatenated with AND/OR and grouped to generate a query model. The string representation of a ConditionExpression will be `field_name:operator:value` and a function would look like `SUM(field_name)`.

== BEHAVIOR REQUISITES AND PARSING ===
6. SQL like Parsing Engine: A service must tokenize and parse a string of plain text supporting nested parenthesis, logical operators and conditions (ie: "serial_number:eq:3 AND COALESCE(column1:column2:'value')"). The parser must generate an efficient AST (Abstract Syntax Tree).
7. Editing and IntelliSense: enable inline editing with a single click. With the initial click in the query bar, open a drop-down below the bar with the available filter options. After selecting one of them, the operator of the Condition is selected, and after that enable an input to provide the value to finish the chip. Each chip should have an x at the end to remove the chip. The user will be able to put the cursor between the existing chips to edit the conjunction, add more Conditions, or add parenthesis. Clicking over a chip should activate the editable section of the condition:
  - If the cursor is in the field position -> suggest the list of FilterDefinitions
  - If it is in the operator -> suggest the valid operators for this type of field
  - If it is in the value -> Enable an input to provide the value of the condition
8. State management: use @angular/forms signal forms to sync the editable data, see the query-builder.

Please review this architecture. I want to continue developing this component by implementing:
* extend custom popups to edit advanced chips like the COALESCE function, that needs custom tokenization and parsing from this text: `COALESCE(column1:column2:'value')`

Provide the structure of files suggested for the new package, the optimized models and the Angular implementation
for the entry-component and all the required sub-components to support the editable chips, triggering a popup at the bottom of the query bar.
