import { FEATURE_NAME, UiRestrictionStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class RestrictionUpdatePreviewRestrictionId implements ActionUpdateInterface<UiRestrictionStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update preview restriction ID';
  readonly type: string = RestrictionUpdatePreviewRestrictionId.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      previewRestrictionId: string;
    },
  ) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiRestrictionStateInterface): UiRestrictionStateInterface {

    return {
      ...state,
      previewRestrictionId: this.payload.previewRestrictionId,
    };
  }
}
