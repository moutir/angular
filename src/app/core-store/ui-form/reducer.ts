import { ActionUpdateInterface } from '../action-update.interface';
import { FEATURE_NAME, initialState, UiFormStateInterface } from './state';
import { ActionEventInterface } from '../action-event.interface';

export function reducer(
  state: UiFormStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<UiFormStateInterface>,
): UiFormStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  // Standard action
  return action['reduce'](state);
}
