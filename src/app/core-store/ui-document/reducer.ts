import { ActionUpdateInterface } from '../action-update.interface';
import { FEATURE_NAME, initialState, UiDocumentStateInterface } from './state';
import { ActionEventInterface } from '../action-event.interface';

export function reducer(
  state: UiDocumentStateInterface = initialState,
  action: ActionEventInterface|ActionUpdateInterface<UiDocumentStateInterface>,
): UiDocumentStateInterface {

  // Action does not have a reducer or action type does not belong to feature
  if (!action['reduce'] || action.type.indexOf(FEATURE_NAME + ':') !== 0) {

    return state;
  }

  // Standard action
  return action['reduce'](state);
}
