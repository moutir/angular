import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';

export class PageUpdateType implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update type';
  readonly type: string = PageUpdateType.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    type: PageTypeEnum;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      type: this.payload.type,
    };
  }
}
