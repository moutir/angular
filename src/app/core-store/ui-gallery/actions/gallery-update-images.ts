import { FEATURE_NAME, UiGalleryStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { GalleryImageInterface } from '../../../shared/interface/gallery-image.interface';

export class GalleryUpdateImages implements ActionUpdateInterface<UiGalleryStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': update images';
  readonly type: string = GalleryUpdateImages.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    images: GalleryImageInterface[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiGalleryStateInterface): UiGalleryStateInterface {

    return {
      ...state,
      images: this.payload.images,
    };
  }
}
