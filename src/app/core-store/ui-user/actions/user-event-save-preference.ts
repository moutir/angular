import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';

export class UserEventSavePreference implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event save preference';
  readonly type: string = UserEventSavePreference.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    preference: RuntimeUserPreferenceInterface;
  }) {

  }
}
