import { ConditionOperator } from './operators';

export interface ArrayValue {
  operator: `${ConditionOperator}`;
  value: ConditionValue;
}

export interface MapValue {
  key: ConditionValue;
  operator: `${ConditionOperator}`;
  value: ConditionValue;
}

export interface StructValue {
  field_name: string;
  operator: `${ConditionOperator}`;
  value: ConditionValue;
}

export type ComplexType = ArrayValue | MapValue | StructValue;

export type ConditionValue = string | boolean | number | Date | ComplexType;
