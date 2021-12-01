import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PropertyModel } from '../../shared/model/property.model';
import { PropertySearchlistService } from '../../core/shared/property/property-searchlist.service';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PropertyService } from '../../core/shared/property/property.service';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { PropertyConfig } from '../../core/shared/property/property.config';
import { PropertyPublicationInterface } from '../../shared/interface/property-publication.interface';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { TypeEnum } from '../../shared/enum/type.enum';
import { PropertyTransferInterface } from '../../shared/interface/property-transfer.interface';
import { InputFormInterface } from '../../shared/interface/input-form.interface';
import { PropertyTransferOptionsInterface } from '../../shared/interface/property-transfer-options.interface';
import { PropertyPublicationOptionsInterface } from '../../shared/interface/property-publication-options.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { PropertyMortgageInterface } from '../../shared/interface/property-mortgage.interface';
import { PropertySearchOptionsInterface } from '../../shared/interface/property-search-options.interface';
import { PropertySearchModel } from '../../shared/model/property-search.model';
import { PropertyValuationInterface } from '../../shared/interface/property-valuation.interface';
import { RuntimeFeaturePriceInterface } from '../../shared/interface/runtime-feature-price.interface';
import { PropertyBrochureInterface } from '../../shared/interface/property-brochure.interface';
import { PropertyBrochureOptionsInterface } from '../../shared/interface/property-brochure-options.interface';
import { HistoryInterface } from '../../shared/interface/history.interface';
import { HistoryModel } from '../../shared/model/history.model';
import { HistoryService } from '../../core/shared/history/history.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { ListTypeEnum } from '../../shared/enum/list-type.enum';

@Component({
  selector: 'app-property-searchlist',
  templateUrl: './property-searchlist.component.html',
  styleUrls: ['./property-searchlist.component.scss'],
})
export class PropertySearchlistComponent extends SearchlistComponentAbstract<
  PropertyModel,
  PropertySearchModel,
  PropertySearchOptionsInterface
> implements OnInit {

  /**
   * Property list type
   */
  @Input() listType: ListTypeEnum = ListTypeEnum.basket;

  /**
   * Constants
   */
  readonly OPERATION_PROPERTY_TRANSFER_BROKER: string = OperationEnum.propertyTransferBroker;
  readonly OPERATION_PROPERTY_MANAGE_PUBLICATION: string = OperationEnum.propertyManagePublication;
  readonly OPERATION_PROPERTY_REMOVE_MLS: string = OperationEnum.propertyRemoveMls;

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  runtimeFeaturePrice$: Observable<RuntimeFeaturePriceInterface>;
  brochureMenuItems$: Observable<MenuInterface>;
  propertyTransfer$: Observable<PropertyTransferInterface>;
  propertyTransferOptions$: Observable<PropertyTransferOptionsInterface>;
  propertyPublication$: Observable<PropertyPublicationInterface>;
  propertyPublicationOptions$: Observable<PropertyPublicationOptionsInterface>;
  propertyMortgage$: Observable<PropertyMortgageInterface>;
  propertyMortgageProperty$: Observable<PropertyModel>;
  propertyValuation$: Observable<PropertyValuationInterface>;
  propertyBrochure$: Observable<PropertyBrochureInterface>;
  propertyBrochureOptions$: Observable<PropertyBrochureOptionsInterface>;
  propertyBrochureProperty$: Observable<PropertyModel>;
  propertyHistory$: Observable<HistoryInterface>;
  historyModels$: Observable<HistoryModel[]>;

  /**
   * List of operation names that have a subform
   */
  private operationSubform: string[] = [
    OperationEnum.propertyTransferBroker,
    OperationEnum.propertyManagePublication,
    OperationEnum.propertyRemoveMls,
  ];

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: PropertyConfig,
    protected searchlistService: PropertySearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected propertyService: PropertyService,
    protected historyService: HistoryService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.runtimeFeaturePrice$ = this.runtimeService.selectFeaturePrice();
    this.brochureMenuItems$ = this.propertyService.selectBrochureMenuItems();
    this.propertyTransfer$ = this.propertyService.selectTransfer();
    this.propertyTransferOptions$ = this.propertyService.selectTransferOptions();
    this.propertyPublication$ = this.propertyService.selectPublication();
    this.propertyPublicationOptions$ = this.propertyService.selectPublicationOptions();
    this.propertyMortgage$ = this.propertyService.selectMortgage();
    this.propertyMortgageProperty$ = this.propertyService.selectMortgageProperty();
    this.propertyValuation$ = this.propertyService.selectValuation();
    this.propertyBrochure$ = this.propertyService.selectBrochure();
    this.propertyBrochureOptions$ = this.propertyService.selectBrochureOptions();
    this.propertyBrochureProperty$ = this.propertyService.selectBrochureProperty();
    this.propertyHistory$ = this.historyService.selectHistory();
    this.historyModels$ = this.historyService.selectHistoryModels();
  }

  /**
   * @inheritDoc
   */
  onClickModel(model: PropertyModel): void {

    // Nothing happens for an unshared property
    if (model.isSharedRestricted === true) {

      return;
    }

    this.propertyService.page(model);
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    this
      .selection$
      .pipe(take(1))
      .subscribe(selection => {

        // Operations that trigger instantly
        switch (menuItem.id) {

          case OperationEnum.propertyAddBasket:
            
          localStorage.setItem("propertyIds", JSON.stringify(selection.ids)); 
            var propertyME = JSON.parse(localStorage.getItem("contactIds"));
            this.propertyService.addBasket(propertyME);
            break;

          case OperationEnum.propertyRemoveBasket:
            this.propertyService.removeBasket(selection.ids);
            break;

          case OperationEnum.propertyArchive:
            this.propertyService.archive(selection.ids);
            break;

          case OperationEnum.propertyConvertTypeRent:
            this.propertyService.convertType(selection.ids, TypeEnum.rent);
            break;

          case OperationEnum.propertyConvertTypeSell:
            this.propertyService.convertType(selection.ids, TypeEnum.sell);
            break;

          case OperationEnum.propertyDuplicate:
            this.propertyService.duplicate(selection.ids);
            break;

          case OperationEnum.propertyGenerateReport:
            this.propertyService.generateReport(selection.ids);
            break;

          case OperationEnum.propertySendEmail:
            this.propertyService.sendEmail(selection.ids);
            break;

          case OperationEnum.propertyUnarchive:
            this.propertyService.unarchive(selection.ids);
            break;
        }

        // Operation with subform
        if (this.operationSubform.indexOf(menuItem.id) > -1) {

          return;
        }

        // Reset current operation
        this.resetOperation();
      });
  }

  /**
   * Clicked a brochure menu item
   */
  onClickMenuItemBrochure(menuItem: MenuItemInterface): void {

    // TODO[later] Improve: Extract data from the menu item ID (not awesome, but preferred over using `menuItem.data: any`)
    const brochure: PropertyBrochureInterface = JSON.parse(menuItem.id);

    // Start on step 1
    brochure.step = 1;

    // Force automatic broker
    brochure.brokerId = 'automatic';

    // No property ID defined
    if (brochure.propertyId === '') {

      return;
    }

    // Request for brochure
    this.propertyService.brochure(brochure);
  }

  /**
   * Changed input in modal for operation: transfer
   */
  onChangeInputTransfer(input: InputFormInterface): void {

    this.propertyService.updateTransferInput(input);
  }

  /**
   * Changed input brochure
   */
  onChangeInputBrochure(input: InputFormInterface): void {

    this.propertyService.updateBrochureInput(input);
  }

  /**
   * Submitted modal for operation: transfer
   */
  onSubmitModalTransfer(event: ModalChoiceInterface<PropertyTransferInterface>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.propertyService.transfer(event.data);
  }

  /**
   * Submitted modal for operation: publication
   */
  onSubmitModalPublication(event: ModalChoiceInterface<PropertyPublicationInterface>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.propertyService.publication(event.data);
  }

  /**
   * Submitted modal for operation: remove MLS
   */
  onSubmitModalRemoveMls(event: ModalChoiceInterface<string[]>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.propertyService.removeMls(event.data);
  }

  /**
   * Submitted modal for mortgage
   */
  onSubmitModalMortgage(event: ModalChoiceInterface<PropertyMortgageInterface>): void {

    return this.propertyService.mortgage(event.data);
  }

  /**
   * Submitted modal for valuation
   */
  onSubmitModalValuation(event: ModalChoiceInterface<PropertyValuationInterface>): void {

    return this.propertyService.valuation(event.data);
  }

  /**
   * Submitted modal for brochure
   */
  onSubmitModalBrochure(event: ModalChoiceInterface<PropertyBrochureInterface>): void {

    return this.propertyService.brochure(event.data);
  }

  /**
   * Submitted history modal
   */
  onSubmitModalHistory(event: ModalChoiceInterface<HistoryInterface>): void {

    // User cancelled
    if (event.isValid === false) {

      this.historyService.closeModal();
    }
  }
}
