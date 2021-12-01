import { GalleryInterface } from '../../shared/interface/gallery.interface';

export const FEATURE_NAME = 'ui-gallery';

export interface UiGalleryStateInterface extends GalleryInterface {

}

export const initialState: UiGalleryStateInterface = {
  images: [],
  currentIndex: 0,
  isCrop: false,
  isVisible: false,
};
