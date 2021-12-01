import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { FEATURE_NAME } from '../state';

export class PageEventStoreModel implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event store model';
  readonly type: string = PageEventStoreModel.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
  }) {

  }
}
