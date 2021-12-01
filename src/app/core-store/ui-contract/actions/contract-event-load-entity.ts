import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

export class ContractEventLoadEntity implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load entity';
  readonly type: string = ContractEventLoadEntity.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    entityId: string;
  }) {

  }
}
