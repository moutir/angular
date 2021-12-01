import { FEATURE_NAME } from '../state';
import { PropertyPublicationInterface } from '../../../shared/interface/property-publication.interface';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventManagePublication implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event manage publication';
  readonly type: string = PropertyEventManagePublication.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    publication: PropertyPublicationInterface;
  }) {

  }
}
