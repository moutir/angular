import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

import { GalleryEventOpen } from './actions/gallery-event-open';
import { GalleryUpdateImages } from './actions/gallery-update-images';
import { GalleryUpdateCurrentIndex } from './actions/gallery-update-current-index';
import { GalleryUpdateIsVisible } from './actions/gallery-update-is-visible';
import { GalleryEventClose } from './actions/gallery-event-close';

@Injectable()
export class Effects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
  ) {

  }

  /**
   * Open gallery modal
   *
   * @action GalleryEventOpen
   */
  GalleryEventOpen$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<GalleryEventOpen>(GalleryEventOpen.TYPE),
    switchMap((action) => {

      return [

        // Update images
        new GalleryUpdateImages({
          images: action.payload.images,
        }),

        // Update current index
        new GalleryUpdateCurrentIndex({
          currentIndex: action.payload.currentIndex,
        }),

        // Update visible
        new GalleryUpdateIsVisible({
          isVisible: true,
        }),
      ];
    }),
  ));

  /**
   * Close gallery modal
   *
   * @action GalleryEventClose
   */
  GalleryEventClose$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<GalleryEventClose>(GalleryEventClose.TYPE),
    switchMap((action) => {

      return [

        // Update visible
        new GalleryUpdateIsVisible({
          isVisible: false,
        }),

        // Update images
        new GalleryUpdateImages({
          images: [],
        }),

        // Update current index
        new GalleryUpdateCurrentIndex({
          currentIndex: 0,
        }),
      ];
    }),
  ));
}
