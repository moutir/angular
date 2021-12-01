import { FEATURE_NAME } from '../state';
import { FisherInterface } from '../../../shared/interface/fisher.interface';
import { ActionEventInterface } from '../../../../core-store/action-event.interface';

export class FisherEventStep implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event step';
  readonly type: string = FisherEventStep.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    form: FisherInterface;
  }) {

  }
}
