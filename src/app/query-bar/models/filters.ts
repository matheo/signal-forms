import { SelectOption } from './forms';

export type SimpleFilterKind = 'boolean' | 'date' | 'number' | 'string' | 'timestamp' | 'uuid' | 'ip';
export type ComplexFilterKind = 'array' | 'map' | 'struct';
// other kinds:
// * function: condition without operator but parameters defined in the FunctionFilterType
// * any: any type of column can be chosen as first parameter
// * input: should match the type of the first column picked

export interface FilterDefinition {
  field: string; // column_name | 'coalesce' | 'floor' | 'count' | 'sum' | 'avg' | 'min' | 'max'
  hive_type: string;
  label: string;
  type: FilterType;
  visible?: boolean;
}

export type FilterType =
  | SimpleFilterType
  | AutocompletableSimpleFilterType
  | EnumFilterType
  | ArrayFilterType
  | MapFilterType
  | StructFilterType
  | FunctionFilterType;

export interface SimpleFilterType {
  type: SimpleFilterKind;
}

export interface AutocompletableSimpleFilterType {
  type: SimpleFilterKind;
  // Available options the user can select from.
  options: SelectOption[];
  // Should the user input be restricted to the available options or is manual entry allowed.
  restricted?: boolean;
  is_options_sort?: boolean;
}

export interface EnumFilterType {
  type: 'enum';
  allowed_values: { name: string; label: string }[];
}

export interface ArrayFilterType {
  type: 'array';
  element_type: FilterType;
}

export interface MapFilterType {
  type: 'map';
  key_type: FilterType;
  value_type: FilterType;
}

export interface StructFilterType {
  type: 'struct';
  fields: StructFieldFilterType[];
}

export interface StructFieldFilterType {
  type: FilterType;
  name: string;
  label?: string;
}

export interface FunctionFilterType {
  type: 'function';
  parameters: Array<{
    name: 'term' | 'key'; // term=column_name | key=user_input
    types: Array<SimpleFilterKind | ComplexFilterKind | 'input' | 'any'>;
  }>;
}
