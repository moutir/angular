import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { FEATURE_NAME } from '../state';

export class PageEventLoadModelSuccess implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event load model success';
  readonly type: string = PageEventLoadModelSuccess.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    model: ModelAbstract;
  }) {

  }
}
