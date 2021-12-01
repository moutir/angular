import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';

export class PageUpdateTabUid implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update tabUid';
  readonly type: string = PageUpdateTabUid.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    tabUid: PageTabEnum;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      tabUid: this.payload.tabUid,
    };
  }
}
