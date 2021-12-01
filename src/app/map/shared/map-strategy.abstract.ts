import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { GeolocMarkerInterface } from '../../shared/interface/geoloc-marker.interface';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { GeolocCoordinatesInterface } from '../../shared/interface/geoloc-coordinates.interface';
import { MapPolygonListInterface } from '../../shared/interface/map-polygon-list.interface';
import { GeolocViewportInterface } from '../../shared/interface/geoloc-viewport.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';

@Injectable()
export abstract class MapStrategyAbstract {

  /**
   * Polygon list observable
   */
  polygonList$: Observable<MapPolygonListInterface>;

  /**
   * Polygon list subject
   */
  protected polygonListSubject: Subject<MapPolygonListInterface> = new Subject<MapPolygonListInterface>();

  /**
   * Constructor
   */
  constructor() {

    this.polygonList$ = this.polygonListSubject.asObservable();
  }

  /**
   * Render map
   */
  abstract render(
    uid: string,
    el: HTMLElement,
    mapSettings: MapSettingsInterface,
    polygonSettings: PolygonSettingsInterface,
  ): void;

  /**
   * Set map settings (override existing map settings)
   */
  abstract setMapSettings(uid: string, mapSettings: MapSettingsInterface): void;

  /**
   * Set polygons settings (override existing polygons settings)
   */
  abstract setPolygonSettings(uid: string, polygonSettings: PolygonSettingsInterface): void;

  /**
   * Add marker to the map
   */
  abstract addMarker(uid: string, marker: GeolocMarkerInterface): void;

  /**
   * Remove marker from the map
   */
  abstract removeMarker(uid: string, index: number): void;

  /**
   * Set markers in the map (overrides existing markers)
   */
  abstract setMarkers(uid: string, markers: GeolocMarkerInterface[]): void;

  /**
   * Add polygon to the map
   */
  abstract addPolygon(uid: string, polygon: GeolocPolygonInterface, emitEvent: boolean): void;

  /**
   * Remove polygon from the map
   */
  abstract removePolygon(uid: string, polygonId: string, emitEvent: boolean): void;

  /**
   * Set polygons in the map (overrides exiting polygons)
   */
  abstract setPolygons(uid: string, polygons: Array<GeolocPolygonInterface>, emitEvent: boolean): void;

  /**
   * Center map on polygons
   */
  abstract centerMapOnPolygons(uid: string): void;

  /**
   * Return the map's current center coordinates
   */
  abstract getCenterCoordinates(uid: string): GeolocCoordinatesInterface;

  /**
   * Return the map's current viewport
   */
  abstract getViewport(uid: string): GeolocViewportInterface;

  /**
   * Update the map's viewport
   */
  abstract updateViewport(uid: string): void;
}
