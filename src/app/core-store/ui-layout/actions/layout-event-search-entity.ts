import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

export class LayoutEventSearchEntity implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event search entity';
  readonly type: string = LayoutEventSearchEntity.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    query: string;
  }) {

  }
}
