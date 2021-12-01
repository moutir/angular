import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { PropertyEventChangeRanking } from '../../../core-store/ui-property/actions/property-event-change-ranking';
import { PropertyEventTransfer } from '../../../core-store/ui-property/actions/property-event-transfer';
import { PropertyEventManagePublication } from '../../../core-store/ui-property/actions/property-event-manage-publication';
import { PropertyEventRemoveMls } from '../../../core-store/ui-property/actions/property-event-remove-mls';
import { PropertyEventAddBasket } from '../../../core-store/ui-property/actions/property-event-add-basket';
import { PropertyEventGenerateReport } from '../../../core-store/ui-property/actions/property-event-generate-report';
import { PropertyEventSendEmail } from '../../../core-store/ui-property/actions/property-event-send-email';
import { PropertyEventDuplicate } from '../../../core-store/ui-property/actions/property-event-duplicate';
import { PropertyEventConvertType } from '../../../core-store/ui-property/actions/property-event-convert-type';
import { TypeEnum } from '../../../shared/enum/type.enum';
import { PropertyEventArchive } from '../../../core-store/ui-property/actions/property-event-archive';
import { PropertyEventUnarchive } from '../../../core-store/ui-property/actions/property-event-unarchive';
import { PropertyTransferInterface } from '../../../shared/interface/property-transfer.interface';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import {
  selectUiBasketPropertyIds,
  selectUiBrochure,
  selectUiBrochureMenu,
  selectUiBrochureMenuItems,
  selectUiBrochureOptions,
  selectUiBrochureProperty,
  selectUiMortgage,
  selectUiMortgageProperty,
  selectUiPreviewProperty,
  selectUiPublication,
  selectUiPublicationOptions,
  selectUiTransfer,
  selectUiTransferOptions,
  selectUiValuation,
} from '../../../core-store/ui-property/selectors';
import { PropertyEventChangeInputTransfer } from '../../../core-store/ui-property/actions/property-event-change-input-transfer';
import { PropertyTransferOptionsInterface } from '../../../shared/interface/property-transfer-options.interface';
import { PropertyPublicationOptionsInterface } from '../../../shared/interface/property-publication-options.interface';
import { PropertyPublicationInterface } from '../../../shared/interface/property-publication.interface';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { PropertyUpdateBrochureMenu } from '../../../core-store/ui-property/actions/property-update-brochure-menu';
import { PropertyBrochureMenuInterface } from '../../../shared/interface/property-brochure-menu.interface';
import { PropertyEventRemoveBasket } from '../../../core-store/ui-property/actions/property-event-remove-basket';
import { PropertyMortgageInterface } from '../../../shared/interface/property-mortgage.interface';
import { PropertyEventPreview } from '../../../core-store/ui-property/actions/property-event-preview';
import { BrowserService } from '../browser/browser.service';
import { PositionInterface } from '../../../shared/interface/position.interface';
import { PropertyIoBasketPropertyIds } from '../../../core-store/ui-property/actions/property-io-basket-property-ids';
import { PropertyUpdateMortgage } from '../../../core-store/ui-property/actions/property-update-mortgage';
import { TrackingActionEnum } from '../../../shared/enum/tracking-action.enum';
import { TrackerService } from '../tracker/tracker.service';
import { PropertyValuationInterface } from '../../../shared/interface/property-valuation.interface';
import { PropertyUpdateValuation } from '../../../core-store/ui-property/actions/property-update-valuation';
import { PropertyBrochureInterface } from '../../../shared/interface/property-brochure.interface';
import { PropertyUpdateBrochure } from '../../../core-store/ui-property/actions/property-update-brochure';
import { PropertyBrochureOptionsInterface } from '../../../shared/interface/property-brochure-options.interface';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { HistoryService } from '../history/history.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PropertyModel } from '../../../shared/model/property.model';
import { selectDataProperties, selectDataProperty } from '../../../core-store/data-property/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PropertyApiService } from '../../../api/shared/property/property-api.service';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { Dictionary } from '../../../shared/class/dictionary';
import { PropertyEventChangeInputBrochure } from '../../../core-store/ui-property/actions/property-event-change-input-brochure';

@Injectable()
export class PropertyService extends ModelServiceAbstract<PropertyModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private browserService: BrowserService,
    private trackerService: TrackerService,
    private runtimeService: RuntimeService,
    private historyService: HistoryService,
    private propertyApiService: PropertyApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): PropertyModel {

    return new PropertyModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PropertySearchModel,
  ): Observable<ModelListInterface<PropertyModel>> {

    return this.propertyApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: PropertySearchModel): Observable<string[]> {

    return this.propertyApiService.ids(filters);
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<PropertyModel|null> {

    return this.store$.select(selectDataProperty(id));
  }

  /**
   * Select property models
   */
  selectProperties(): Observable<Dictionary<PropertyModel>> {

    return this.store$.select(selectDataProperties);
  }

  /**
   * Select property transfer
   */
  selectTransfer(): Observable<PropertyTransferInterface> {

    return this.store$.select(selectUiTransfer);
  }

  /**
   * Select property transfer options
   */
  selectTransferOptions(): Observable<PropertyTransferOptionsInterface> {

    return this.store$.select(selectUiTransferOptions);
  }

  /**
   * Select property publication
   */
  selectPublication(): Observable<PropertyPublicationInterface> {

    return this.store$.select(selectUiPublication);
  }

  /**
   * Select property publication options
   */
  selectPublicationOptions(): Observable<PropertyPublicationOptionsInterface> {

    return this.store$.select(selectUiPublicationOptions);
  }

  /**
   * Select the brochure menu state
   */
  selectBrochureMenu(): Observable<PropertyBrochureMenuInterface> {

    return this.store$.select(selectUiBrochureMenu);
  }

  /**
   * Return the brochures menu definition
   */
  selectBrochureMenuItems(): Observable<MenuInterface> {

    return this.store$.select(selectUiBrochureMenuItems);
  }

  /**
   * Select mortgage
   */
  selectMortgage(): Observable<PropertyMortgageInterface> {

    return this.store$.select(selectUiMortgage);
  }

  /**
   * Select mortgage's property
   */
  selectMortgageProperty(): Observable<PropertyModel|null> {

    return this.store$.select(selectUiMortgageProperty);
  }

  /**
   * Select valuation
   */
  selectValuation(): Observable<PropertyValuationInterface> {

    return this.store$.select(selectUiValuation);
  }

  /**
   * Select brochure
   */
  selectBrochure(): Observable<PropertyBrochureInterface> {

    return this.store$.select(selectUiBrochure);
  }

  /**
   * Select brochure's property
   */
  selectBrochureProperty(): Observable<PropertyModel|null> {

    return this.store$.select(selectUiBrochureProperty);
  }

  /**
   * Select brochure options
   */
  selectBrochureOptions(): Observable<PropertyBrochureOptionsInterface> {

    return this.store$.select(selectUiBrochureOptions);
  }

  /**
   * Select property to preview
   */
  selectPreviewProperty(): Observable<PropertyModel|null> {

    return this.store$.select(selectUiPreviewProperty);
  }

  /**
   * Select basket property ids
   */
  selectBasketPropertyIds(): Observable<string[]> {

    return this.store$.select(selectUiBasketPropertyIds);
  }

  /**
   * @inheritDoc
   */
  page(model: PropertyModel): void {

    // TODO[later] Remove tracking from here and move it to property page component on init, change redirection as well.

    // Stats
    this.trackerService.trackString(TrackingActionEnum.propertyView, model.id);

    // Is in property legacy URL and has legacy function to show property details
    if (
      this.browserService.getWindow().location.pathname.indexOf('/property/') === 0 &&
      this.browserService.getWindow().showPropertyDetails
    ) {

      // Call legacy function to show property details
      this.browserService.getWindow().showPropertyDetails('property_' + model.id);

    } else {

      const type = model.type === TypeEnum.sell ? 'sell' : 'rental';

      // Good old redirect
      this.browserService.redirect('/property/index/active/' + type + '?property_id=' + model.id);
    }
  }

  /**
   * Preview a property at the given position
   */
  preview(id: string, position: PositionInterface): void {

    this.store$.dispatch(
      new PropertyEventPreview({
        propertyId: id,
        position: position,
      }),
    );
  }

  /**
   * Change property ranking
   */
  changeRanking(property: PropertyModel, ranking: number): void {

    // Stats
    this.trackerService.trackLabelValue(TrackingActionEnum.propertyRowStar, property.reference, ranking);

    this.store$.dispatch(
      new PropertyEventChangeRanking({
        id: property.id,
        ranking,
      }),
    );
  }

  /**
   * Open matching by agency
   */
  matchingAgency(property: PropertyModel): void {

    // Stats
    this.trackerService.trackString(TrackingActionEnum.propertyRowMatching, property.id);

    // Open legacy functionality // TODO[later] Refactor once fully on Angular
    this.browserService.getWindow()
      .openPropertyMatchTable(property.id, 1, !property.isSharedRestricted)
    ;
  }

  /**
   * Open matching by MLS
   */
  matchingMls(property: PropertyModel): void {

    // Stats
    this.trackerService.trackString(TrackingActionEnum.propertyRowMlsMatching, property.id);

    // Open legacy functionality // TODO[later] Refactor once fully on Angular
    this.browserService.getWindow()
      .openPropertyMatchTable(property.id, 0, !property.isSharedRestricted)
    ;
  }

  /**
   * Open history (Support for form legacy code)
   */
  openHistoryModal(id: string, reference: string): void {

    this
      .runtimeService
      .selectFeature()
      .pipe(take(1))
      .subscribe(feature => {

        // Stats
        this.trackerService.trackString(TrackingActionEnum.propertyRowHistory, reference);

        // New history enabled
        if (feature.history === true) {

          this.historyService.openModal(EntityEnum.property, id, reference);
        }
      });
  }

  /**
   * Set properties to basket
   *
   * @deprecated TODO[later] Remove once fully on Angular
   */
  setBasket(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyIoBasketPropertyIds({
        in: propertyIds,
      }),
    );
  }

  /**
   * Add properties to basket
   */
  addBasket(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventAddBasket({ propertyIds }),
    );
  }

  /**
   * Remove properties from basket
   */
  removeBasket(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventRemoveBasket({ propertyIds }),
    );
  }

  /**
   * Generate report for properties
   */
  generateReport(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventGenerateReport({ propertyIds }),
    );
  }

  /**
   * Send properties by email
   */
  sendEmail(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventSendEmail({ propertyIds }),
    );
  }

  /**
   * Duplicate properties
   */
  duplicate(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventDuplicate({ propertyIds }),
    );
  }

  /**
   * Convert properties type
   */
  convertType(propertyIds: string[], type: TypeEnum): void {

    this.store$.dispatch(
      new PropertyEventConvertType({
        propertyIds,
        type,
      }),
    );
  }

  /**
   * Archive properties
   */
  archive(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventArchive({ propertyIds }),
    );
  }

  /**
   * Unarchive properties
   */
  unarchive(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventUnarchive({ propertyIds }),
    );
  }

  /**
   * Update transfer input
   */
  updateTransferInput(input: InputFormInterface): void {

    this.store$.dispatch(
      new PropertyEventChangeInputTransfer({ input }),
    );
  }

  /**
   * Update brochure input
   */
  updateBrochureInput(input: InputFormInterface): void {

    this.store$.dispatch(
      new PropertyEventChangeInputBrochure({ input }),
    );
  }

  /**
   * Transfer properties
   */
  transfer(transfer: PropertyTransferInterface): void {

    this.store$.dispatch(
      new PropertyEventTransfer({ transfer }),
    );
  }

  /**
   * Publish/unpublish properties on websites/portals
   */
  publication(publication: PropertyPublicationInterface): void {

    this.store$.dispatch(
      new PropertyEventManagePublication({ publication }),
    );
  }

  /**
   * Remove properties from MLS
   */
  removeMls(propertyIds: string[]): void {

    this.store$.dispatch(
      new PropertyEventRemoveMls({ propertyIds }),
    );
  }

  /**
   * Display brochures menu at the given position
   */
  openBrochureMenu(id: string, position: PositionInterface): void {

    this.store$.dispatch(
      new PropertyUpdateBrochureMenu({
        brochureMenu: {
          propertyId: id,
          position: position,
        },
      }),
    );
  }

  /**
   * Request for brochure
   */
  brochure(brochure: PropertyBrochureInterface): void {

    this.store$.dispatch(
      new PropertyUpdateBrochure({ brochure }),
    );
  }

  /**
   * Download brochure
   */
  brochureDownload(brochure: PropertyBrochureInterface): void {

    // Stats
    this.trackerService.trackStringBrochure(
      TrackingActionEnum.propertyRowBrochure,
      brochure.propertyId,
      brochure.type,
      brochure.privacy,
      brochure.quality,
      brochure.language,
    );

    // Open brochure in _blank
    this.browserService.blank([
      '/property/export',
      brochure.type,
      brochure.privacy,
      brochure.language,
      brochure.quality,
      brochure.propertyId,
    ].join('/') + (brochure.brokerId && brochure.brokerId !== 'automatic' ? '?broker_id=' + brochure.brokerId : ''));
  }

  /**
   * Request for mortgage
   */
  mortgage(mortgage: PropertyMortgageInterface): void {

    // Step 1
    if (mortgage.step === 1) {

      // Stats
      this.trackerService.trackString(TrackingActionEnum.propertyRowMortgage, mortgage.propertyId);
    }

    this.store$.dispatch(
      new PropertyUpdateMortgage({ mortgage }),
    );
  }

  /**
   * Request for valuation
   */
  valuation(valuation: PropertyValuationInterface): void {

    // Step 1
    if (valuation.step === 1) {

      // Stats
      this.trackerService.trackString(TrackingActionEnum.propertyValuation, valuation.propertyId);
    }

    this.store$.dispatch(
      new PropertyUpdateValuation({ valuation }),
    );
  }

  /**
   * Download property valuation
   */
  valuationDownload(link: string): void {

    this.browserService.blank(link);
  }
}
