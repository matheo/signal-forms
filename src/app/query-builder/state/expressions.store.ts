import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LogicalExpression, LogicalOperator } from '../models';

interface ExpressionsState {
  model: LogicalExpression;
};

const initialState: ExpressionsState = {
  model: {
    not: false,
    operator: LogicalOperator.AND,
    expressions: []
  },
};

export const ExpressionsStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    init: (model: LogicalExpression) => {
      // TODO validate input model integrity
      patchState(store, { model });
    },
  })),
);
