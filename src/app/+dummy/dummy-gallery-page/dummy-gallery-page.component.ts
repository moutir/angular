import { Component } from '@angular/core';

import { GalleryImageInterface } from '../../shared/interface/gallery-image.interface';

@Component({
  selector: 'app-dummy-gallery-page',
  templateUrl: './dummy-gallery-page.component.html',
})
export class DummyGalleryPageComponent {

  /**
   * List of gallery images
   */
  images: GalleryImageInterface[] = [
    {
      title: 'Image title #1',
      url: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239056040.jpg',
      thumbnailUrl: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239056040.jpg',
    },
    {
      title: 'Image title #2',
      url: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239057391.jpg',
      thumbnailUrl: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239057391.jpg',
    },
    {
      title: 'Image title #3',
      url: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239057453.jpg',
      thumbnailUrl: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239057453.jpg',
    },
    {
      title: 'Image title #4',
      url: 'https://q-cf.bstatic.com/images/hotel/max1024x768/242/242844950.jpg',
      thumbnailUrl: 'https://q-cf.bstatic.com/images/hotel/max1024x768/242/242844950.jpg',
    },
    {
      title: 'Image title #5',
      url: 'https://r-cf.bstatic.com/images/hotel/max1024x768/239/239057500.jpg',
      thumbnailUrl: 'https://r-cf.bstatic.com/images/hotel/max1024x768/239/239057500.jpg',
    },
    {
      title: 'Image title #6',
      url: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239058383.jpg',
      thumbnailUrl: 'https://q-cf.bstatic.com/images/hotel/max1024x768/239/239058383.jpg',
    },
  ];

  /**
   * Constructor
   */
  constructor() {

  }
}
