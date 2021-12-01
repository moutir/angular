import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';

export class RuntimeEventResetData implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event reset data';
  readonly type: string = RuntimeEventResetData.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    keys: RuntimeDataEnum[];
  }) {

  }
}
