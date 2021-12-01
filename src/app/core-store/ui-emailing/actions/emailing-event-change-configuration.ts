import { ActionEventInterface } from '../../action-event.interface';
import { FEATURE_NAME } from '../state';
import { EmailingConfigurationInterface } from '../../../shared/interface/emailing-configuration.interface';

export class EmailingEventChangeConfiguration implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change configuration';
  readonly type: string = EmailingEventChangeConfiguration.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    configuration: EmailingConfigurationInterface;
  }) {

  }
}
