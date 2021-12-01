import { FEATURE_NAME, UiGalleryStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class GalleryUpdateIsCrop implements ActionUpdateInterface<UiGalleryStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is crop';
  readonly type: string = GalleryUpdateIsCrop.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    isCrop: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiGalleryStateInterface): UiGalleryStateInterface {

    return {
      ...state,
      isCrop: this.payload.isCrop,
    };
  }
}
