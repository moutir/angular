/// <reference types="@types/googlemaps" />
import { NgZone } from '@angular/core';
import { Dictionary } from 'app/shared/class/dictionary';

import { MapStrategyAbstract } from '../map-strategy.abstract';
import { MapSettingsInterface } from '../../../shared/interface/map-settings.interface';
import { GeolocMarkerInterface } from '../../../shared/interface/geoloc-marker.interface';
import { GeolocPolygonInterface } from '../../../shared/interface/geoloc-polygon.interface';
import { GeolocCoordinatesInterface } from '../../../shared/interface/geoloc-coordinates.interface';
import { GeolocViewportInterface } from '../../../shared/interface/geoloc-viewport.interface';
import { PolygonSettingsInterface } from '../../../shared/interface/polygon-settings.interface';

export class GoogleMapsStrategy extends MapStrategyAbstract {

  /**
   * Map index by UID
   */
  private map: Dictionary<{

    // Map settings
    mapSettings: MapSettingsInterface;

    // Polygon settings
    polygonSettings: PolygonSettingsInterface;

    // Map google object
    google: google.maps.Map;

    // Map markers
    markers: {

      // List of markers definitions
      list: Array<{

        // Marker google object
        google: google.maps.Marker;
      }>;
    }

    // Map polygons
    polygons: {

      // List of polygons definitions
      list: Array<{

        // Polygon google object
        google: google.maps.Polygon;

        // Polygon realforce object
        realforce: GeolocPolygonInterface;
      }|null>;

      // Polygon update debounce ID
      debounceId: number;
    },

    // Is the viewport autofit done ?
    isViewportAutofitDone: boolean;

  }> = {};

  /**
   * Constructor
   */
  constructor(
    private ngZone: NgZone,
  ) {

    super();
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

    // Render map
    this.map[uid] = {
      google: new google.maps.Map(el, this.getMapOptions(mapSettings)),
      mapSettings: mapSettings,
      polygonSettings: polygonSettings,
      markers: {
        list: [],
      },
      polygons: {
        list: [],
        debounceId: 0,
      },
      isViewportAutofitDone: false,
    };
  }

  /**
   * @inheritDoc
   */
  setMapSettings(uid: string, mapSettings: MapSettingsInterface): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    // Update options
    this.map[uid].google.setOptions(
      this.getMapOptions(mapSettings),
    );
  }

  /**
   * @inheritDoc
   */
  setPolygonSettings(uid: string, polygonSettings: PolygonSettingsInterface): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    // Update polygon settings
    this.map[uid].polygonSettings = polygonSettings;

    // Re-render polygons
    this.setPolygons(uid, this.map[uid].polygons.list.map(polygonList => polygonList.realforce || null), false);
  }

  /**
   * @inheritDoc
   */
  addMarker(uid: string, marker: GeolocMarkerInterface): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    const googleMarker = new google.maps.Marker({
      map: this.map[uid].google,
      position: marker.coordinates,
      icon: marker.icon ? '/assets/images/google-maps/{name}.png'.replace('{name}', marker.icon) : '',
      title: marker.title,
    });

    this.map[uid].markers.list.push({
      google: googleMarker,
    });
  }

  /**
   * @inheritDoc
   */
  removeMarker(uid: string, index: number): void {

    // Unknown UID or marker index
    if (!this.map[uid] || !this.map[uid].markers.list[index]) {

      return;
    }

    // Remove marker from map
    this.map[uid].markers.list[index].google.setMap(null);

    // Remove marker from list
    this.map[uid].markers.list.splice(index, 1);
  }

  /**
   * @inheritDoc
   */
  setMarkers(uid: string, markers: GeolocMarkerInterface[]): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    // Remove existing markers
    this.map[uid].markers.list.forEach((marker, index) => this.removeMarker(uid, index));

    // Add new markers
    markers.forEach((marker, i) => this.addMarker(uid, marker));
  }

  /**
   * @inheritDoc
   */
  addPolygon(uid: string, polygon: GeolocPolygonInterface, emitEvent: boolean = true): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    // Limit number of polygons
    if (this.map[uid].polygons.list.length >= this.map[uid].polygonSettings.maxCount) {

      return;
    }

    const paths = polygon.vertices.map(vertex => {

      return {
        lat: vertex.lat,
        lng: vertex.lng,
      };
    });

    const googlePolygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: polygon.color,
      strokeOpacity: 0.75,
      strokeWeight: 1,
      fillColor: polygon.color,
      fillOpacity: 0.25,
      draggable: this.map[uid].polygonSettings.isEditable && !this.map[uid].polygonSettings.isDisabled,
      editable: this.map[uid].polygonSettings.isEditable && !this.map[uid].polygonSettings.isDisabled,
    });

    const path = googlePolygon.getPath();
    path.addListener('insert_at', (i) => this.ngZone.run(() => {

      // Polygon vertices limit reached
      if (path.getLength() > this.map[uid].polygonSettings.verticesMaxCount) {

        path.removeAt(i);

        return;
      }

      this.nextPolygonListDebounce(uid);

    }));
    path.addListener('remove_at', (i) => this.ngZone.run(() => this.nextPolygonListDebounce(uid)));
    path.addListener('set_at', (i) => this.ngZone.run(() => this.nextPolygonListDebounce(uid)));

    googlePolygon.setMap(this.map[uid].google);

    this.map[uid].polygons.list.push({
      google: googlePolygon,
      realforce: polygon,
    });

    // Broadcast polygons list
    if (emitEvent === true) {

      this.nextPolygonList(uid);
    }
  }

  /**
   * @inheritDoc
   */
  removePolygon(uid: string, polygonId: string, emitEvent: boolean = true): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    // Find polygon index from polygon ID
    let index: number|null = null;

    this.map[uid].polygons.list.some((polygon, i) => {

      if (polygon.realforce.id === polygonId) {

        index = i;

        return true;
      }
    });

    // Unknown polygon ID
    if (index === null) {

      return;
    }

    // Remove polygon from map
    this.map[uid].polygons.list[index].google.setMap(null);

    // Remove polygon from list
    this.map[uid].polygons.list.splice(index, 1);

    // Broadcast polygons list
    if (emitEvent === true) {

      this.nextPolygonList(uid);
    }
  }

  /**
   * @inheritDoc
   */
  setPolygons(uid: string, polygons: Array<GeolocPolygonInterface>, emitEvent: boolean = true): void {

    // Unknown UID
    if (!this.map[uid]) {

      return;
    }

    // Polygon IDs
    const polygonIdsExisting = this.map[uid].polygons.list.map(polygon => polygon.realforce.id);
    const polygonIdsNew = polygons.map(polygon => polygon.id);

    // For each existing polygon
    polygonIdsExisting.forEach((polygonId, index) => {

      // Existing polygon removed
      if (polygonIdsNew.indexOf(polygonId) === -1) {

        this.removePolygon(uid, polygonId, false);
      }
    });

    // Add polygons one by one
    polygons.forEach((polygon, i) => {

      // New polygon does not exist yet
      if (polygonIdsExisting.indexOf(polygon.id) === -1) {

        this.addPolygon(uid, polygon, false);
      }
    });

    // Broadcast polygons list
    if (emitEvent === true) {

      this.nextPolygonList(uid);
    }
  }

  /**
   * @inheritDoc
   */
  centerMapOnPolygons(uid: string): void {

    // Map not defined or no polygons
    if (!this.map[uid] || this.map[uid].polygons.list.length === 0) {

      return;
    }

    // Map bounds
    const bounds = new google.maps.LatLngBounds();

    // For each polygon
    this.map[uid].polygons.list.forEach(polygon => {

      // Add polygon path to map bounds
      polygon.google.getPath().forEach((path, index) => bounds.extend(path));
    });

    // Make map fit bounds
    this.map[uid].google.fitBounds(bounds);
  }

  /**
   * @inheritDoc
   */
  getCenterCoordinates(uid: string): GeolocCoordinatesInterface {

    const center = this.map[uid].google.getCenter();

    return {
      lat: center.lat(),
      lng: center.lng(),
    };
  }

  /**
   * @inheritDoc
   */
  getViewport(uid: string): GeolocViewportInterface {

    const bounds = this.map[uid].google.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    return {
      topLeft: {
        lat: northEast.lat(),
        lng: southWest.lng(),
      },
      topRight: {
        lat: northEast.lat(),
        lng: northEast.lng(),
      },
      bottomRight: {
        lat: southWest.lat(),
        lng: northEast.lng(),
      },
      bottomLeft: {
        lat: southWest.lat(),
        lng: southWest.lng(),
      },
    };
  }

  /**
   * @inheritDoc
   */
  updateViewport(uid: string): void {

    // Viewport autofit set to never or no polygons
    if (
      this.map[uid].polygonSettings.viewportAutofit === 'never' ||
      this.map[uid].polygons.list.length === 0 ||
      (this.map[uid].polygonSettings.viewportAutofit === 'once' && this.map[uid].isViewportAutofitDone === true)
    ) {

      return;
    }

    // Set viewport autofit as done
    this.map[uid].isViewportAutofitDone = true;

    // Center map on polygons
    this.centerMapOnPolygons(uid);
  }

  /**
   * Return list of polygons with updated vertices
   */
  private getPolygons(uid: string): Array<GeolocPolygonInterface> {

    // For each polygon
    return this.map[uid].polygons.list.map(polygon => {

      if (polygon === null) {

        return null;
      }

      const vertices = [];

      // For each vertex
      const path = polygon.google.getPath();
      path.forEach(vertex => {

        vertices.push({
          lat: vertex.lat(),
          lng: vertex.lng(),
        });
      });

      return {
        ...polygon.realforce,
        vertices: vertices,
      };
    });
  }

  /**
   * Return a Google Maps options from MapSettingsInterface
   */
  private getMapOptions(mapSettings: MapSettingsInterface): google.maps.MapOptions {

    return {
      center: mapSettings.centerCoordinates,
      zoom: Math.round(20 * mapSettings.zoomPercentage / 100),
    };
  }

  /**
   * Debounce the call to nextPolygonList
   */
  private nextPolygonListDebounce(uid: string): void {

    if (this.map[uid].polygons.debounceId > 0) {

      clearTimeout(this.map[uid].polygons.debounceId);
    }

    // We use JS lower level setTimeout() to debounce before emitting the event instead of using RxJs debounceTime() for performance
    this.map[uid].polygons.debounceId = setTimeout(() => {

      this.nextPolygonList(uid);

      this.map[uid].polygons.debounceId = 0;
    }, 1000);
  }

  /**
   * Next polygons broadcasting
   */
  private nextPolygonList(uid: string): void {

    this.polygonListSubject.next({
      uid: uid,
      polygons: this.getPolygons(uid),
    });
  }
}
