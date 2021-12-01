import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

export class PageEventOpen implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event open';
  readonly type: string = PageEventOpen.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    icon: string;
    type: PageTypeEnum;
    id: string|null;
  }) {

  }
}
