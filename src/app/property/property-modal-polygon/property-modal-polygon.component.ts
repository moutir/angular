import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PropertySearchModel } from '../../shared/model/property-search.model';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';

@Component({
  selector: 'app-property-modal-polygon',
  templateUrl: './property-modal-polygon.component.html',
  styleUrls: ['./property-modal-polygon.component.scss'],
})
export class PropertyModalPolygonComponent extends
  ModalComponentAbstract<GeolocPolygonInterface[]> implements OnInit, OnDestroy {

  /**
   * Polygons
   */
  @Input() search: PropertySearchModel;

  /**
   * Polygons
   */
  polygons: GeolocPolygonInterface[] = [];

  /**
   * Map settings
   */
  mapSettings: MapSettingsInterface|null = null;

  /**
   * Polygon settings
   */
  polygonSettings: PolygonSettingsInterface|null = null;

  /**
   * Observable subscriptions per control path
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.subscriptions.push(
      this.runtimeService.selectSettings().subscribe(runtimeSettings => this.onNextRuntimeSettings(runtimeSettings)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Changed list of polygons
   */
  onChangePolygons(polygons: GeolocPolygonInterface[]): void {

    this.polygons = polygons;
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: this.polygons,
    });
  }

  /**
   * @inheritDoc
   */
  protected activate(): void {

    super.activate();

    // Empty polygons
    this.polygons = [];

    // Set new polygons on next cycle
    setTimeout(() => this.polygons = this.search.polygons.slice(0));
  }

  /**
   * @inheritDoc
   */
  protected deactivate(): void {

    super.deactivate();

    // Empty polygons
    this.polygons = [];
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
      isConfirmDelete: false,
    };
  }
}
