import { DataFisherStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../../../core-store/action-update.interface';
import { FisherModel } from '../../../shared/model/fisher.model';

export class FisherUpdateFisher implements ActionUpdateInterface<DataFisherStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update fisher';
  readonly type: string = FisherUpdateFisher.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    fisher: FisherModel;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataFisherStateInterface): DataFisherStateInterface {

    const newState = {
      ...state,
      fisher: this.payload.fisher,
    };

    return newState;
  }
}
