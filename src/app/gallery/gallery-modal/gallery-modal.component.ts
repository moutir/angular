import { Component, Input } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { GalleryService } from '../shared/gallery.service';
import { GalleryInterface } from '../../shared/interface/gallery.interface';

@Component({
  selector: 'app-gallery-modal',
  templateUrl: './gallery-modal.component.html',
  styleUrls: ['./gallery-modal.component.scss'],
})
export class GalleryModalComponent extends ModalComponentAbstract<null> {

  /**
   * Gallery
   */
  @Input() gallery: GalleryInterface = {
    images: [],
    currentIndex: 0,
    isCrop: false,
    isVisible: false,
  };

  /**
   * Constructor
   */
  constructor(
    private galleryService: GalleryService,
  ) {

    super();
  }

  /**
   * Clicked crop button
   */
  onClickCrop(): void {

    this.galleryService.crop(!this.gallery.isCrop);
  }

  /**
   * Clicked the next button
   */
  onClickNext(): void {

    this.galleryService.browse((this.gallery.currentIndex + 1) % this.gallery.images.length);
  }

  /**
   * Clicked the previous button
   */
  onClickPrevious(): void {

    this.galleryService.browse((this.gallery.currentIndex - 1 + this.gallery.images.length) % this.gallery.images.length);
  }

  /**
   * Clicked image
   */
  onClickImage(imageIndex: number): void {

    this.galleryService.browse(imageIndex);
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.galleryService.close();
  }
}
