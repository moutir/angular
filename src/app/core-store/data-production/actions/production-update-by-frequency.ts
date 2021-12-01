import { DataProductionStateInterface, FEATURE_NAME } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ProductionFrequencyInterface } from '../../../shared/interface/production-frequency.interface';

export class ProductionUpdateByFrequency implements ActionUpdateInterface<DataProductionStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update by frequency';
  readonly type: string = ProductionUpdateByFrequency.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    byFrequency: ProductionFrequencyInterface;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: DataProductionStateInterface): DataProductionStateInterface {

    return {
      ...state,
      byFrequency: {
        ...this.payload.byFrequency,
      },
    };
  }
}
