import { FEATURE_NAME } from '../state';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { Observable } from 'rxjs';
import { ActionEventInterface } from '../../action-event.interface';

export class EntityEventOperation implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event operation';
  readonly type: string = EntityEventOperation.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    ids: string[];
    message: string;
    operation: string;
    apiCall: () => Observable<object|boolean>;
  }) {

  }
}
