import { FEATURE_NAME } from '../../data-device/state';
import { ActionEventInterface } from '../../action-event.interface';

export class DeviceEventBlacklist implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event blacklist';
  readonly type: string = DeviceEventBlacklist.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
  }) {

  }
}
