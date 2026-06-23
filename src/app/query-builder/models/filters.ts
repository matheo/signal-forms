import { SelectOption } from './forms';

export interface FilterDefinition {
  field: string;
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
  | FunctionFilterType
  | CoalesceFilterType;

export interface SimpleFilterType {
  type: string;
}

export interface AutocompletableSimpleFilterType {
  type: string;
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
  type: string;
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
  fn: 'floor' | 'count' | 'sum' | 'avg' | 'min' | 'max';
  input: 'number',
}

export interface CoalesceFilterType {
  fn: 'coalesce';
  input: 'boolean' | 'number' | 'string' | 'timestamp' | 'enum' | 'uuid';
  field1: string;
  field2: string;
  value: string;
}
