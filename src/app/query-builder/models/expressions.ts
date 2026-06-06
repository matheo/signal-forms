import { ConditionOperator } from './operators';
import { ConditionValue } from './values';

export enum LogicalOperator {
  AND = 'and',
  OR = 'or',
}

export interface LogicalExpression {
  not: boolean;
  operator: `${LogicalOperator}`;
  expressions: Expression[];
}

export interface ConditionExpression {
  field_name: string;
  operator: `${ConditionOperator}`;
  value: ConditionValue;
}

export type Expression = LogicalExpression | ConditionExpression;
