import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StateInterface } from '../../core-store/state.interface';
import { selectUiState } from '../../core-store/ui-gallery/selectors';
import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';
import { GalleryEventOpen } from '../../core-store/ui-gallery/actions/gallery-event-open';
import { GalleryEventClose } from '../../core-store/ui-gallery/actions/gallery-event-close';
import { GalleryUpdateCurrentIndex } from '../../core-store/ui-gallery/actions/gallery-update-current-index';
import { GalleryUpdateIsCrop } from '../../core-store/ui-gallery/actions/gallery-update-is-crop';
import { GalleryInterface } from '../../shared/interface/gallery.interface';

@Injectable()
export class GalleryService {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
  ) {

  }

  /**
   * Open the gallery
   */
  open(images: GalleryImageInterface[], currentIndex: number): void {

    this.store$.dispatch(new GalleryEventOpen({ images, currentIndex }));
  }

  /**
   * Close the gallery
   */
  close(): void {

    this.store$.dispatch(new GalleryEventClose({}));
  }

  /**
   * Browse the gallery to the @imageIndex
   */
  browse(imageIndex: number): void {

    this.store$.dispatch(new GalleryUpdateCurrentIndex({
      currentIndex: imageIndex,
    }));
  }

  /**
   * Crop gallery's images (true) or contain them (false)
   */
  crop(isCrop: boolean): void {

    this.store$.dispatch(new GalleryUpdateIsCrop({
      isCrop: isCrop,
    }));
  }

  /**
   * Select gallery
   */
  select(): Observable<GalleryInterface> {

    return this.store$.select(selectUiState);
  }
}
