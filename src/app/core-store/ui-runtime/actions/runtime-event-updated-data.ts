import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { DataRuntimeStateInterface } from '../../data-runtime/state';

export class RuntimeEventUpdatedData implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event updated data';
  readonly type: string = RuntimeEventUpdatedData.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    data: Partial<DataRuntimeStateInterface>;
  }) {

  }
}
