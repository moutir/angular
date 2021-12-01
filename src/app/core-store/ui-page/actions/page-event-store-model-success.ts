import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { FEATURE_NAME } from '../state';

export class PageEventStoreModelSuccess implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event store model success';
  readonly type: string = PageEventStoreModelSuccess.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    model: ModelAbstract;
  }) {

  }
}
