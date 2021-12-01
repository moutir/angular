import { FEATURE_NAME, UiGalleryStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class GalleryUpdateIsVisible implements ActionUpdateInterface<UiGalleryStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update is visible';
  readonly type: string = GalleryUpdateIsVisible.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    isVisible: boolean;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiGalleryStateInterface): UiGalleryStateInterface {

    return {
      ...state,
      isVisible: this.payload.isVisible,
    };
  }
}
