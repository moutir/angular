import { FEATURE_NAME, UiGalleryStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';

export class GalleryUpdateCurrentIndex implements ActionUpdateInterface<UiGalleryStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update current index';
  readonly type: string = GalleryUpdateCurrentIndex.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    currentIndex: number;
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiGalleryStateInterface): UiGalleryStateInterface {

    return {
      ...state,
      currentIndex: state.images[this.payload.currentIndex] ? this.payload.currentIndex : 0,
    };
  }
}
