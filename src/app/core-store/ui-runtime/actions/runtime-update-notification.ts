import { FEATURE_NAME, UiRuntimeStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { NotificationInterface } from '../../../shared/interface/notification.interface';

export class RuntimeUpdateNotification implements ActionUpdateInterface<UiRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update notification';
  readonly type: string = RuntimeUpdateNotification.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    notification: NotificationInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiRuntimeStateInterface): UiRuntimeStateInterface {

    return {
      ...state,
      notification: this.payload.notification,
    };
  }
}
