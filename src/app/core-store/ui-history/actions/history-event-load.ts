import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

export class HistoryEventLoad implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load';
  readonly type: string = HistoryEventLoad.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    entityId: string;
  }) {

  }
}
