import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PropertyPublicationInterface } from '../../../shared/interface/property-publication.interface';

export class PropertyUpdatePublication implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update publication';
  readonly type: string = PropertyUpdatePublication.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    publication: PropertyPublicationInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      publication: {
        ...this.payload.publication,
      },
    };
  }
}
