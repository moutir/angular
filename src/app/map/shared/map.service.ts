import { Injectable } from '@angular/core';

import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { GeolocMarkerInterface } from '../../shared/interface/geoloc-marker.interface';
import { MapStrategyAbstract } from './map-strategy.abstract';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { GeolocCoordinatesInterface } from '../../shared/interface/geoloc-coordinates.interface';
import { GeolocViewportInterface } from '../../shared/interface/geoloc-viewport.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';

/**
 * MapService is a decorator of MapStrategyAbstract, used as injection token
 */
@Injectable()
export class MapService extends MapStrategyAbstract {

  /**
   * Constructor
   */
  constructor(
    private strategy: MapStrategyAbstract,
  ) {

    super();

    this.polygonList$ = this.strategy.polygonList$;
  }

  /**
   * @inheritDoc
   */
  render(
    uid: string,
    el: HTMLElement,
    mapSettings: MapSettingsInterface,
    polygonSettings: PolygonSettingsInterface,
  ): void {

    this.strategy.render(uid, el, mapSettings, polygonSettings);
  }

  /**
   * @inheritDoc
   */
  setMapSettings(uid: string, mapSettings: MapSettingsInterface): void {

    this.strategy.setMapSettings(uid, mapSettings);
  }

  /**
   * @inheritDoc
   */
  setPolygonSettings(uid: string, polygonSettings: PolygonSettingsInterface): void {

    this.strategy.setPolygonSettings(uid, polygonSettings);
  }

  /**
   * @inheritDoc
   */
  addMarker(uid: string, marker: GeolocMarkerInterface): void {

    this.strategy.addMarker(uid, marker);
  }

  /**
   * @inheritDoc
   */
  removeMarker(uid: string, index: number): void {

    this.strategy.removeMarker(uid, index);
  }

  /**
   * @inheritDoc
   */
  setMarkers(uid: string, markers: GeolocMarkerInterface[]): void {

    this.strategy.setMarkers(uid, markers);
  }

  /**
   * @inheritDoc
   */
  addPolygon(uid: string, polygon: GeolocPolygonInterface, emitEvent: boolean = true): void {

    this.strategy.addPolygon(uid, polygon, emitEvent);
  }

  /**
   * @inheritDoc
   */
  removePolygon(uid: string, polygonId: string, emitEvent: boolean = true): void {

    this.strategy.removePolygon(uid, polygonId, emitEvent);
  }

  /**
   * @inheritDoc
   */
  setPolygons(uid: string, polygons: GeolocPolygonInterface[], emitEvent: boolean = true): void {

    this.strategy.setPolygons(uid, polygons, emitEvent);
  }

  /**
   * @inheritDoc
   */
  centerMapOnPolygons(uid: string): void {

    this.strategy.centerMapOnPolygons(uid);
  }

  /**
   * @inheritDoc
   */
  getCenterCoordinates(uid: string): GeolocCoordinatesInterface {

    return this.strategy.getCenterCoordinates(uid);
  }

  /**
   * @inheritDoc
   */
  getViewport(uid: string): GeolocViewportInterface {

    return this.strategy.getViewport(uid);
  }

  /**
   * @inheritDoc
   */
  updateViewport(uid: string): void {

    return this.strategy.updateViewport(uid);
  }
}
