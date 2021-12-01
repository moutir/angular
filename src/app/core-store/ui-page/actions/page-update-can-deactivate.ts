import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class PageUpdateCanDeactivate implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update can deactivate';
  readonly type: string = PageUpdateCanDeactivate.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    canDeactivate: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      canDeactivate: this.payload.canDeactivate,
    };
  }
}
