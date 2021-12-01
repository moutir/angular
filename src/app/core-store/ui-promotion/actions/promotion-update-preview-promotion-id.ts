import { FEATURE_NAME, UiPromotionStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class PromotionUpdatePreviewPromotionId implements ActionUpdateInterface<UiPromotionStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update preview promotion ID';
  readonly type: string = PromotionUpdatePreviewPromotionId.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      previewPromotionId: string,
    },
  ) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPromotionStateInterface): UiPromotionStateInterface {

    return {
      ...state,
      previewPromotionId: this.payload.previewPromotionId,
    };
  }
}
