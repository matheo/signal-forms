export type FunctionDataType =
  | 'any'
  | 'array'
  | 'map'
  | 'bool'
  | "date"
  | "timestamp"
  | 'string'
  | 'literal_string'
  | "literal_int"
  | "literal_numeric"
  | "decimal"
  | "double"
  | "float"
  | "tinyint"
  | "int"
  | "long"
  | "smallint";

export interface FunctionDefinition {
  name: string;
  kind: 'scalar' | 'aggregate' | 'analytic';
  parameters: Array<{
    name: string;
    types: FunctionDataType | FunctionDataType[];
    description: string | null;
    minRepeat: number;
    maxRepeat: number | null;
  }>;
  output: {
    types: FunctionDataType;
    description: string | null;
  };
  description: string | null;
  dialects: string | null;
  isAnalytic: boolean;
  requiresOrderBy: boolean;
  supportsFrame: boolean;
  supportsIgnoreNulls: boolean;
}
