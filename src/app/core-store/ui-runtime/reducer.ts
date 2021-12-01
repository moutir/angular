import { ActionUpdateInterface } from '../action-update.interface';
import { FEATURE_NAME, initialState, UiRuntimeStateInterface } from './state';
import { ActionEventInterface } from '../action-event.interface';

export function reducer(
  state: UiRuntimeStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<UiRuntimeStateInterface>,
): UiRuntimeStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  return action['reduce'](state);
}
