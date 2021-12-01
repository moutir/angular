import { Component, Input } from '@angular/core';

import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';
import { GalleryService } from '../shared/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent {

  /**
   * List of images
   */
  @Input() images: GalleryImageInterface[] = [];

  /**
   * Is the gallery loading ?
   */
  @Input() isLoading: boolean = false;

  /**
   * Message to show when images are not available
   */
  @Input() messageEmptyState: string = 'label_no_photos_found';

  /**
   * Constructor
   */
  constructor(
    private galleryService: GalleryService,
  ) {

  }

  /**
   * Clicked an image
   */
  onClickImage(index: number): void {

    this.galleryService.open(
      this.images,
      index,
    );
  }
}
