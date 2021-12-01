import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class PageUpdateIcon implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update icon';
  readonly type: string = PageUpdateIcon.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    icon: string;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      icon: this.payload.icon,
    };
  }
}
