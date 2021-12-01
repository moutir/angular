import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class PageUpdateId implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update ID';
  readonly type: string = PageUpdateId.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    id: string;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      id: this.payload.id,
    };
  }
}
