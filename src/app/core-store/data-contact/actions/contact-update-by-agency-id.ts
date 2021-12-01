import { DataContactStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class ContactUpdateByAgencyId implements ActionUpdateInterface<DataContactStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update by agency ID';
  readonly type: string = ContactUpdateByAgencyId.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    agencyId: string;
    contactIds: string[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataContactStateInterface): DataContactStateInterface {

    const newState = {
      ...state,
      byAgencyId: {
        ...state.byAgencyId,
      },
    };

    newState.byAgencyId[this.payload.agencyId] = this.payload.contactIds;

    return newState;
  }
}
