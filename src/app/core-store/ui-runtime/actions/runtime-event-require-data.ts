import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';

export class RuntimeEventRequireData implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event require data';
  readonly type: string = RuntimeEventRequireData.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    keys: RuntimeDataEnum[];
  }) {

  }
}
