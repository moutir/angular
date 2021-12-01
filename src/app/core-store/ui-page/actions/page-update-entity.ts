import { FEATURE_NAME, UiPageStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

export class PageUpdateEntity implements ActionUpdateInterface<UiPageStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update entity';
  readonly type: string = PageUpdateEntity.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPageStateInterface): UiPageStateInterface {

    return {
      ...state,
      entity: this.payload.entity,
    };
  }
}
