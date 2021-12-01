import { FEATURE_NAME, initialState, UiPageStateInterface } from './state';
import { ActionEventInterface } from '../action-event.interface';
import { ActionUpdateInterface } from '../action-update.interface';

export function reducer(
  state: UiPageStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<UiPageStateInterface>,
): UiPageStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  return action['reduce'](state);
}
