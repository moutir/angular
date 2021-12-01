import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { AgencyModel } from '../../../shared/model/agency.model';

export class MlsEventAddAgency implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event add agency';
  readonly type: string = MlsEventAddAgency.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    agency: AgencyModel;
  }) {

  }
}
