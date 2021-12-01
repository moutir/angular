import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { SectorModel } from '../../shared/model/sector.model';
import { SectorOptionsInterface } from '../../shared/interface/sector-options.interface';
import { LocationModel } from '../../shared/model/location.model';
import { SectorModelAdapterStrategy } from '../../core/shared/sector/sector-model-adapter.strategy';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { Observable } from 'rxjs';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-sector-form-required',
  templateUrl: './sector-form-required.component.html',
  styleUrls: ['./sector-form-required.component.scss'],
})
export class SectorFormRequiredComponent extends FormComponentAbstract<
  SectorModel,
  SectorOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_LOCATION: EntityEnum[] = [EntityEnum.location];

  /**
   * Map settings
   */
  mapSettings: MapSettingsInterface|null = null;

  /**
   * Polygon settings
   */
  polygonSettings: PolygonSettingsInterface|null = null;

  /**
   * Polygons
   */
  polygons: GeolocPolygonInterface[] = [];

  /**
   * State observables
   */
  feature$: Observable<RuntimeFeatureInterface>;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: SectorModelAdapterStrategy,
    protected runtimeService: RuntimeService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Changed model and has polygon settings
    if (!!changes.model && this.polygonSettings) {

      this.polygons = this.model.polygons.map((polygon, i) => {

        return {
          ...polygon,
          color: polygon.color || this.polygonSettings.colors[i % this.polygonSettings.colors.length],
        };
      });
    }

    super.ngOnChanges(changes);
  }

  /**
   * Changed location selection
   */
  onChangeSelectionLocation(selection: AutocompleteSelectionInterface): void {

    const typeMapping = {
      country: 'co',
      canton: 'ca',
      district: 'd',
      zone: 'z',
      city: 'ci',
      quarter: 'q',
    };
    const value = selection.id.split(/_/g);
    const locations = this.formGroup.get('locations').value.slice(0);

    // Generate location
    const location = new LocationModel();
    location.id = [typeMapping[value[0]], value[1]].join('-');
    location.name = selection.text.replace(/\s?\([^)]+\)$/g, '');

    locations.push(location);

    // Update input by adding a location
    this.setValue('locations', locations);
  }

  /**
   * Clicked the remove location button
   */
  onClickRemoveLocation(index: number): void {

    // Update input by removing a location
    this.setValue('locations', this.formGroup.get('locations').value.filter((loc, i) => i !== index));
  }

  /**
   * Changed list of polygons
   */
  onChangePolygons(polygons: GeolocPolygonInterface[]): void {

    this.setValue('polygons', polygons);
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.feature$ = this.runtimeService.selectFeature();

    this.subscriptions.push(
      this.runtimeService.selectSettings().subscribe(runtimeSettings => this.onNextRuntimeSettings(runtimeSettings)),
    );
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
}
