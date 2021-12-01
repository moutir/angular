import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PageActionEnum } from '../../../shared/enum/page-action.enum';

export class PageUpdateAction implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update action';
  readonly type: string = PageUpdateAction.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    action: PageActionEnum;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      action: this.payload.action,
    };
  }
}
