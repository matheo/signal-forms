import { SelectOption } from './forms';

export type FilterSimpleType = 'any' | 'boolean' | 'number' | 'string' | 'timestamp' | 'enum' | 'uuid';
export type FilterComplexType = 'array' | 'map' | 'struct';

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
  type: FilterSimpleType;
}

export interface AutocompletableSimpleFilterType {
  type: FilterSimpleType;
  // Available options the user can select from.
  options?: SelectOption[];
  // Should the user input be restricted to the available options or is manual entry allowed.
  restricted?: boolean;
  isOptionsSort?: boolean;
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
  parameters: Array<{
    name: 'term' | 'key'; // term=column_name | key=user_input
    types: Array<FilterSimpleType | FilterComplexType | 'input'>;
  }>;
}
