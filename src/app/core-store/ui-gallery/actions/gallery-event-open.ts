import { FEATURE_NAME } from '../state';
import { ActionEventInterface } from '../../action-event.interface';
import { GalleryImageInterface } from '../../../shared/interface/gallery-image.interface';

export class GalleryEventOpen implements ActionEventInterface {

  static readonly TYPE: string = FEATURE_NAME + ': event open';
  readonly type: string = GalleryEventOpen.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    images: GalleryImageInterface[];
    currentIndex: number;
  }) {

  }
}
