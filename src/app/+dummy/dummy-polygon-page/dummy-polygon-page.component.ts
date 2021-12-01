import { Component, OnInit } from '@angular/core';

import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';

@Component({
  selector: 'app-dummy-polygon-page',
  templateUrl: './dummy-polygon-page.component.html',
  styleUrls: ['./dummy-polygon-page.component.scss'],
})
export class DummyPolygonPageComponent implements OnInit {

  /**
   * List of polygons at load
   */
  polygons: GeolocPolygonInterface[] = [];

  /**
   * Map settings
   */
  mapSettings: MapSettingsInterface = {
    centerCoordinates: {
      lat: 10,
      lng: -30,
    },
    zoomPercentage: 20,
  };

  /**
   * Polygon settings
   */
  polygonSettings: PolygonSettingsInterface = {
    maxCount: 5,
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
    isEditable: true,
    isDisabled: false,
    isConfirmDelete: true,
  };

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.polygons = [
      {
        id: '1',
        color: '#cc0000',
        vertices: [
          {
            lat: 25.774,
            lng: -80.190,
          },
          {
            lat: 18.466,
            lng: -66.118,
          },
          {
            lat: 32.321,
            lng: -64.757,
          },
          {
            lat: 25.774,
            lng: -80.190,
          },
        ],
      },
      {
        id: '2',
        color: '#00cc00',
        vertices: [
          {
            lat: 35.774,
            lng: -70.190,
          },
          {
            lat: 28.466,
            lng: -56.118,
          },
          {
            lat: 42.321,
            lng: -54.757,
          },
          {
            lat: 35.774,
            lng: -70.190,
          },
        ],
      },
    ];
  }

  /**
   * Changed list of polygons
   */
  onChangePolygons(polygons: GeolocPolygonInterface[]): void {

    console.log('onChangePolygons', polygons);
  }
}
