import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

export class HistoryEventOpen implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event open';
  readonly type: string = HistoryEventOpen.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      entity: EntityEnum;
      entityId: string;
      entityLabel: string;
    },
  ) {

  }
}
