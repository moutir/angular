import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ButtonTypeEnum } from '../../../shared/enum/button-type.enum';

export class PageEventClickButton implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event click button type';
  readonly type: string = PageEventClickButton.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    buttonType: ButtonTypeEnum,
  }) {

  }
}
