import { GalleryImageInterface } from './gallery-image.interface';

export interface GalleryInterface {

  /**
   * List of images
   */
  images: GalleryImageInterface[];

  /**
   * Current image index
   */
  currentIndex: number;

  /**
   * Should the gallery images be cropped ?
   */
  isCrop: boolean;

  /**
   * Is the gallery modal visible ?
   */
  isVisible: boolean;

}
