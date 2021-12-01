import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { ContactSearchMapService } from '../shared/contact-search-map.service';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { RuntimeDataEnum } from '../../shared/enum/runtime-data.enum';

@Component({
  selector: 'app-contact-search-map',
  templateUrl: './contact-search-map.component.html',
})
export class ContactSearchMapComponent implements OnInit, OnDestroy {

  /**
   * Map settings
   */
  mapSettings: MapSettingsInterface|null = null;

  /**
   * Polygon settings
   */
  polygonSettings: PolygonSettingsInterface|null = null;

  /**
   * List of polygons
   */
  polygons: GeolocPolygonInterface[]|null = null;

  /**
   * Is the map loading ?
   */
  isLoading: boolean = true;

  /**
   * Observable subscriptions
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private contactSearchMapService: ContactSearchMapService,
    private runtimeService: RuntimeService,
  ) {

    // Request permissions update
    this.runtimeService.requireData([
      RuntimeDataEnum.settings,
    ]);
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // State observable
    this.subscriptions.push(
      this.contactSearchMapService.polygons$.subscribe(polygons => this.onNextPolygons(polygons)),
    );
    this.subscriptions.push(
      this.contactSearchMapService.isDisabled$.subscribe(isDisabled => this.onNextIsDisabled(isDisabled)),
    );
    this.subscriptions.push(
      this.runtimeService.selectSettings().subscribe(runtimeSettings => this.onNextRuntimeSettings(runtimeSettings)),
    );

    // Wait for legacy's Google Maps to be available in global scope
    const timer = setInterval(() => {

      if (!window['google'] || !window['google'].maps) {

        return;
      }

      clearInterval(timer);

      this.isLoading = false;

    }, 2000);
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Next runtime settings
   */
  protected onNextRuntimeSettings(runtimeSettings: RuntimeSettingsInterface): void {

    this.mapSettings = {
      ...runtimeSettings.map,
    };

    this.polygonSettings = {
      ...runtimeSettings.polygon,
      viewportAutofit: 'once',
      isEditable: true,
      isDisabled: false,
      isConfirmDelete: true,
    };
  }

  /**
   * Next isDisabled
   */
  onNextIsDisabled(isDisabled: boolean): void {

    if (!this.polygonSettings) {

      return;
    }

    this.polygonSettings = {
      ...this.polygonSettings,
      isDisabled: isDisabled,
    };
  }

  /**
   * Next polygons
   */
  onNextPolygons(polygons: GeolocPolygonInterface[]): void {

    this.polygons = polygons;

    // Has polygon settings
    if (this.polygonSettings) {

      // For each polygon
      this.polygons.forEach((polygon, i) => {

        // Already has color
        if (polygon.color) {

          return;
        }

        // Set color
        polygon.color = this.polygonSettings.colors[i % this.polygonSettings.colors.length];
      });
    }

    this.contactSearchMapService.updatePolygonsLegacy(polygons);
  }

  /**
   * Changed list of polygons
   */
  onChangePolygons(polygons: GeolocPolygonInterface[]): void {

    this.contactSearchMapService.updatePolygonsLegacy(polygons);
  }
}
