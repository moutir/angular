import { FEATURE_NAME, initialState, UiFisherStateInterface } from './state';
import { ActionUpdateInterface } from '../../../core-store/action-update.interface';
import { ActionEventInterface } from '../../../core-store/action-event.interface';

export function reducer(
  state: UiFisherStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<UiFisherStateInterface>,
): UiFisherStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  return action['reduce'](state);
}
