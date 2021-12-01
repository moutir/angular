import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { ModelAbstract } from '../../../shared/class/model.abstract';

export class PageUpdateModel implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update model';
  readonly type: string = PageUpdateModel.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    model: ModelAbstract|null;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      model: this.payload.model,
    };
  }
}
