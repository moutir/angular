import { ActionUpdateInterface } from '../action-update.interface';
import { DataHistoryStateInterface, FEATURE_NAME, initialState } from './state';
import { ActionEventInterface } from '../action-event.interface';

export function reducer(
  state: DataHistoryStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<DataHistoryStateInterface>,
): DataHistoryStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  return action['reduce'](state);
}
