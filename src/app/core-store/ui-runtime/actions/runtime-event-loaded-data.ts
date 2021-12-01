import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { DataRuntimeStateInterface } from '../../data-runtime/state';
import { RuntimeDataEnum } from '../../../shared/enum/runtime-data.enum';

export class RuntimeEventLoadedData implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event loaded data';
  readonly type: string = RuntimeEventLoadedData.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    data: Partial<DataRuntimeStateInterface>;
    keys: RuntimeDataEnum[];
  }) {

  }
}
