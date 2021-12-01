import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { GeolocMarkerInterface } from '../../shared/interface/geoloc-marker.interface';
import { MapService } from '../shared/map.service';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { MapPolygonListInterface } from '../../shared/interface/map-polygon-list.interface';
import { ConfirmService } from '../../core/shared/confirm.service';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * Map UID
   */
  @Input() uid: string = '';

  /**
   * Map settings
   */
  @Input() mapSettings: MapSettingsInterface|null = null;

  /**
   * Polygon settings
   */
  @Input() polygonSettings: PolygonSettingsInterface|null = null;

  /**
   * Markers
   */
  @Input() markers: GeolocMarkerInterface[] = [];

  /**
   * Polygons
   */
  @Input() polygons: GeolocPolygonInterface[] = [];

  /**
   * Polygons changed
   */
  @Output() changePolygons: EventEmitter<GeolocPolygonInterface[]> = new EventEmitter<GeolocPolygonInterface[]>();

  /**
   * DOM element
   */
  @ViewChild('container', { static: true }) containerElementRef: ElementRef;

  /**
   * Is the component initialized ?
   */
  private isInitialized: boolean = false;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private mapService: MapService,
    private confirmService: ConfirmService,
  ) {

  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Component is not initialized
    if (!this.isInitialized) {

      return;
    }

    // Changed map settings
    if (changes.mapSettings) {

      // Override map settings
      this.mapService.setMapSettings(this.uid, this.mapSettings);
    }

    // Changed markers
    if (changes.markers) {

      // Override map markers
      this.mapService.setMarkers(this.uid, this.markers);
    }

    // Changed polygons
    if (changes.polygons) {

      // Override map polygons
      this.mapService.setPolygons(this.uid, this.polygons, false);
    }

    // Changed polygons settings
    if (changes.polygonSettings) {

      // Override map polygons settings
      this.mapService.setPolygonSettings(this.uid, this.polygonSettings);
    }

    // Update viewport
    this.mapService.updateViewport(this.uid);
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Subscribe to polygon list updates for this map UID
    this.subscriptions.push(
      this
        .mapService
        .polygonList$
        .pipe(filter(polygonList => polygonList.uid === this.uid))
        .subscribe(polygonList => this.onNextPolygonList(polygonList)),
    );

    // Render map
    this.mapService.render(
      this.uid,
      this.containerElementRef.nativeElement,
      this.mapSettings || {
        centerCoordinates: {
          lat: 46,
          lng: 7,
        },
        zoomPercentage: 40,
      },
      this.polygonSettings || {
        maxCount: 3,
        verticesMaxCount: 10,
        colors: [
          '#9dabdd',
          '#ecbe7a',
          '#f07777',
          '#70ae98',
          '#d99bfc',
          '#5d6b9d',
          '#ac7e3a',
          '#b03737',
          '#306e58',
          '#995bbc',
        ],
        viewportAutofit: 'once',
        isEditable: false,
        isDisabled: true,
        isConfirmDelete: true,
      },
    );

    // Render markers
    this.mapService.setMarkers(this.uid, this.markers);

    // Render polygons
    this.mapService.setPolygons(this.uid, this.polygons, false);

    // Update viewport
    this.mapService.updateViewport(this.uid);

    // Component is initialized
    this.isInitialized = true;
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Track by polygon ID
   */
  trackByPolygonId(index: number, polygon: GeolocPolygonInterface): string {

    return polygon === null ? '' : polygon.id;
  }

  /**
   * Clicked add polygon button
   */
  onClickAddPolygon(): void {

    // Get map center
    const viewport = this.mapService.getViewport(this.uid);
    const center = this.mapService.getCenterCoordinates(this.uid);
    const delta = Math.abs(viewport.topLeft.lat - center.lat) * 0.5;

    // Find color index of the last polygon else default to 0
    const colorIndex = this.polygons.length ? this.polygonSettings.colors.indexOf(this.polygons[this.polygons.length - 1].color) + 1 : 0;

    // Define polygon made of 4 vertices around map center
    const polygon = {
      id: [this.uid, this.polygons.length + 1].join('-'),
      color: this.polygonSettings.colors[colorIndex % this.polygonSettings.colors.length],
      vertices: [
        {
          lat: center.lat + delta,
          lng: center.lng - delta,
        },
        {
          lat: center.lat + delta,
          lng: center.lng + delta,
        },
        {
          lat: center.lat - delta,
          lng: center.lng + delta,
        },
        {
          lat: center.lat - delta,
          lng: center.lng - delta,
        },
      ],
    };

    // Add polygon to map
    this.mapService.addPolygon(this.uid, polygon);
  }

  /**
   * Clicked delete polygon button
   */
  onClickDeletePolygon(polygon: GeolocPolygonInterface): void {

    // No delete confirmation
    if (this.polygonSettings.isConfirmDelete === false) {

      // Remove polygon
      this.mapService.removePolygon(this.uid, polygon.id);

      return;
    }

    // Confirm modal
    this
      .confirmService
      .message('message_polygon_delete_confirm')
      .subscribe(isValid => {

        if (isValid === false) {

          return;
        }

        // Remove polygon
        this.mapService.removePolygon(this.uid, polygon.id);
      });
  }

  /**
   * Next polygon list
   */
  private onNextPolygonList(polygonList: MapPolygonListInterface): void {

    // Update polygons list
    setTimeout(() => {

      // Update polygons
      this.polygons = polygonList.polygons.map((polygon, i) => polygon === null ? null : {
        ...polygon,
      });
    });

    // Emit change event
    this.changePolygons.emit(polygonList.polygons);
  }
}
