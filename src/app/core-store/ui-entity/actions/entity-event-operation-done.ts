import { FEATURE_NAME } from '../state';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ActionEventInterface } from '../../action-event.interface';

export class EntityEventOperationDone implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event operation done';
  readonly type: string = EntityEventOperationDone.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum,
    operation: string;
    ids: string[];
  }) {

  }
}
