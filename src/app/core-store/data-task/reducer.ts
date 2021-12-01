import { ActionUpdateInterface } from '../action-update.interface';
import { DataTaskStateInterface, FEATURE_NAME, initialState } from './state';
import { ActionEventInterface } from '../action-event.interface';

export function reducer(
  state: DataTaskStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<DataTaskStateInterface>,
): DataTaskStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  return action['reduce'](state);
}
