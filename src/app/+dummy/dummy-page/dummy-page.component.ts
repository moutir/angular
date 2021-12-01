import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dummy-page',
  templateUrl: './dummy-page.component.html',
  styleUrls: ['./dummy-page.component.scss'],
})
export class DummyPageComponent implements OnInit {

  /**
   * List of dummy page links
   */
  links: Array<{ label: string; route: string[]; }> = [];

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.links = [
      {
        label: 'Address',
        route: ['/dummy/address'],
      },
      {
        label: 'Document',
        route: ['/dummy/document'],
      },
      {
        label: 'Gallery',
        route: ['/dummy/gallery'],
      },
      {
        label: 'Polygon',
        route: ['/dummy/polygon'],
      },
      {
        label: 'Performance',
        route: ['/dummy/performance'],
      },
    ];
  }
}
