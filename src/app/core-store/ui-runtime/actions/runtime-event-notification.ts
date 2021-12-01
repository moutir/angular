import { FEATURE_NAME } from '../state';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { ActionEventInterface } from '../../action-event.interface';

export class RuntimeEventNotification implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event notification';
  readonly type: string = RuntimeEventNotification.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    type: NotificationTypeEnum;
    message: string;
  }) {

  }
}
