import { FEATURE_NAME, UiPropertyStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class PropertyUpdatePreviewPropertyId implements ActionUpdateInterface<UiPropertyStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': preview property ID';
  readonly type: string = PropertyUpdatePreviewPropertyId.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      previewPropertyId: string;
    },
  ) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiPropertyStateInterface): UiPropertyStateInterface {

    return {
      ...state,
      previewPropertyId: this.payload.previewPropertyId,
    };
  }
}
