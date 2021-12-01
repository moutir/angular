import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { MenuItemInterface } from '../../../shared/interface/menu-item.interface';

export class PageEventClickMenuItem implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event click menu item';
  readonly type: string = PageEventClickMenuItem.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    menuItem: MenuItemInterface,
  }) {

  }
}
