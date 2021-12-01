import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

export class PageEventChangeTabUid implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event change tab UID';
  readonly type: string = PageEventChangeTabUid.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    tabUid: PageTabEnum,
  }) {

  }
}
