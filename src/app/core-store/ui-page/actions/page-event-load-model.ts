import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { FEATURE_NAME } from '../state';

export class PageEventLoadModel implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load model';
  readonly type: string = PageEventLoadModel.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    id: string,
  }) {

  }
}
