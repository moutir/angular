import { FEATURE_NAME } from '../../data-property/state';
import { ActionEventInterface } from '../../action-event.interface';

export class PropertyEventChangeRanking implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change ranking';
  readonly type: string = PropertyEventChangeRanking.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
    ranking: number;
  }) {

  }
}
