import { FEATURE_NAME } from '../state';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ActionEventInterface } from '../../action-event.interface';

export class EntityEventChanged implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event changed';
  readonly type: string = EntityEventChanged.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum,
    ids: string[];
  }) {

  }
}
