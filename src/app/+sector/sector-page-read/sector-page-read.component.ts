import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SectorModel } from '../../shared/model/sector.model';
import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { SectorPageService } from '../../core/shared/sector/sector-page.service';
import { SectorOptionsInterface } from '../../shared/interface/sector-options.interface';
import { PropertySearchlistService } from '../../core/shared/property/property-searchlist.service';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';
import { MapSettingsInterface } from '../../shared/interface/map-settings.interface';
import { PolygonSettingsInterface } from '../../shared/interface/polygon-settings.interface';
import { Observable } from 'rxjs';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { GeolocPolygonInterface } from '../../shared/interface/geoloc-polygon.interface';

@Component({
  selector: 'app-sector-page-read',
  templateUrl: './sector-page-read.component.html',
  styleUrls: ['./sector-page-read.component.scss'],
})
export class SectorPageReadComponent extends PageReadComponentAbstract<SectorModel, SectorOptionsInterface> {

  /**
   * Constants
   */
  readonly PAGE_TAB_INFORMATION: PageTabEnum = PageTabEnum.sectorReadInformation;
  readonly PAGE_TAB_PROPERTY_SALE: PageTabEnum = PageTabEnum.sectorReadPropertySale;
  readonly PAGE_TAB_PROPERTY_RENT: PageTabEnum = PageTabEnum.sectorReadPropertyRent;

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
   * Constructor
   */
  constructor(
    protected pageService: SectorPageService,
    protected activatedRoute: ActivatedRoute,
    protected propertySearchlistService: PropertySearchlistService,
    protected runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Return a searchlist UID based on provided name
   */
  getSearchlistUid(name: string): string {

    return this.propertySearchlistService.getUid(name);
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
   * @inheritDoc
   */
  protected onNextModel(model: SectorModel): void {

    super.onNextModel(model);

    // Has model and has polygon settings
    if (!!this.model && this.polygonSettings) {

      this.polygons = this.model.polygons.map((polygon, i) => {

        return {
          ...polygon,
          color: polygon.color || this.polygonSettings.colors[i % this.polygonSettings.colors.length],
        };
      });
    }
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
      isEditable: false,
      isDisabled: false,
      isConfirmDelete: false,
    };
  }
}
