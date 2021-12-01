import { FEATURE_NAME, UiRuntimeStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { PreviewImageInterface } from '../../../shared/interface/preview-image.interface';

export class RuntimeUpdatePreviewImage implements ActionUpdateInterface<UiRuntimeStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update preview image';
  readonly type: string = RuntimeUpdatePreviewImage.TYPE;

  /**
   * Constructor
   */
  constructor(
    public payload: {
      previewImage: PreviewImageInterface;
    },
  ) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiRuntimeStateInterface): UiRuntimeStateInterface {

    return {
      ...state,
      previewImage: {
        ...state.previewImage,
        ...this.payload.previewImage,
      },
    };
  }
}
