import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { MapService } from '../../map/shared/map.service';

@Injectable()
export class ContactSearchMapService {

  /**
   * Observables
   */
  polygons$: Observable<GeolocPolygonInterface[]>;
  isDisabled$: Observable<boolean>;

  /**
   * Subjects
   */
  private polygons: Subject<GeolocPolygonInterface[]>;
  private isDisabled: Subject<boolean>;

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
    private mapService: MapService,
    private ngZone: NgZone,
  ) {

    // Define subjects
    this.polygons = new Subject<GeolocPolygonInterface[]>();
    this.isDisabled = new Subject<boolean>();

    // Define observables
    this.polygons$ = this.polygons.asObservable();
    this.isDisabled$ = this.isDisabled.asObservable();
  }

  /**
   * Update map disabled state
   */
  updateIsDisabledAngular(isDisabled: boolean): void {

    // Run with NgZone otherwise change detection doesn't work if called from outside angular app
    this.ngZone.run(() => {

      this.isDisabled.next(isDisabled);
    });
  }

  /**
   * Update the contact search map's polygons on Angular
   */
  updatePolygonsAngular(polygons: GeolocPolygonInterface[]): void {

    // Run with NgZone otherwise change detection doesn't work if called from outside angular app
    this.ngZone.run(() => {

      // Remove last vertex of each polygon (BE requirement, 1st and last polygon are the same)
      polygons.forEach(polygon => polygon.vertices.pop());

      this.polygons.next(polygons);

      // Center map on polygons
      setTimeout(() => this.mapService.centerMapOnPolygons('contact-search-map'));
    });
  }

  /**
   * Update the contact search map's polygons on Legacy
   */
  updatePolygonsLegacy(polygons: GeolocPolygonInterface[]): void {

    // Run with NgZone otherwise change detection doesn't work if called from outside angular app
    this.ngZone.run(() => {

      // Add first vertex as last vertex as well for each polygon (BE requirement)
      polygons.forEach(polygon => polygon.vertices.push(polygon.vertices[0]));

      this.browserService.getWindow().updateContactSearchPolygons(polygons);
    });
  }
}
