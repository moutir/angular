import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Params } from '@angular/router';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { PropertyModel } from '../../../shared/model/property.model';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PropertySearchOptionsInterface } from '../../../shared/interface/property-search-options.interface';
import { selectDataProperties } from '../../../core-store/data-property/selectors';
import { selectUiForm, selectUiKeywords, selectUiSearchFilters } from '../../../core-store/ui-searchlist/selectors';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import {
  selectDataAgenciesIncludingMls,
  selectDataFeature,
  selectDataFeatureProperty,
  selectDataOptions,
  selectDataPermissions,
} from '../../../core-store/data-runtime/selectors';
import { selectUiTransferOptions } from '../../../core-store/ui-property/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { PropertyTransferOptionsInterface } from '../../../shared/interface/property-transfer-options.interface';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { ListTypeEnum } from '../../../shared/enum/list-type.enum';
import { TypeEnum } from '../../../shared/enum/type.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { BrowserService } from '../browser/browser.service';
import { RuntimeFeaturePropertyInterface } from '../../../shared/interface/runtime-feature-property.interface';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyOptionEnum } from '../../../shared/enum/agency-option.enum';
import { PropertyConfig } from './property.config';
import { RuntimeFeatureInterface } from '../../../shared/interface/runtime-feature.interface';
import { selectUiCustomAttributeOptions } from '../../../core-store/ui-custom-attribute/selectors';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';
import { CustomAttributeTypeEnum } from '../../../shared/enum/custom-attribute-type.enum';
import { ListFiltersInterface } from '../../../shared/interface/list-filters.interface';
import { GeolocPolygonInterface } from '../../../shared/interface/geoloc-polygon.interface';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class PropertySearchlistService extends SearchlistServiceAbstract<
  PropertyModel,
  PropertySearchModel,
  PropertySearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: PropertyConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
    protected browserService: BrowserService,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): PropertySearchModel {

    return new PropertySearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorModelsSelectable(uid: string): MemoizedSelector<StateInterface, PropertyModel[]|null> {

    return createSelector(
      this.getSelectorModels(uid),
      (properties: PropertyModel[]|null): PropertyModel[] => {

        return properties !== null ? properties.filter(property => property.isSharedRestricted === false) : null;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenuOperation(uid: string): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      this.getSelectorModelsSelected(uid),
      selectUiSearchFilters(uid),
      selectDataPermissions,
      selectUiTransferOptions,
      (
        properties: PropertyModel[]|null,
        filters: PropertySearchModel,
        permissions: PermissionEnum[],
        transferOptions: PropertyTransferOptionsInterface,
      ): MenuInterface => {

        const selectedProperties = properties || [];
        const isEnabled = selectedProperties.length > 0;
        const menu: MenuInterface = {
          items: [],
        };

        // Archived search
        if (filters.isArchive01 === '1') {

          if (permissions.indexOf(PermissionEnum.propertyDelete) > -1) {

            // Unarchive
            menu.items.push({
              id: OperationEnum.propertyUnarchive,
              label: 'label_reactivate',
              isEnabled: isEnabled,
              icon: 'add_circle_outline',
              tooltip: '',
              items: [],
            });
          }

          // No more menu items if archived search
          return menu;
        }

        if (permissions.indexOf(PermissionEnum.propertyWrite) > -1) {

          // Basket search
          if (filters.type === ListTypeEnum.basket) {

            // Remove basket
            menu.items.push({
              id: OperationEnum.propertyRemoveBasket,
              label: 'label_remove_from_basket',
              isEnabled: isEnabled,
              icon: 'remove_shopping_cart',
              tooltip: '',
              items: [],
            });

          } else {

            // Add basket
            menu.items.push({
              id: OperationEnum.propertyAddBasket,
              label: 'label_add_to_card',
              isEnabled: isEnabled,
              icon: 'add_shopping_cart',
              tooltip: '',
              items: [],
            });
          }
        }

        // Generate report
        menu.items.push({
          id: OperationEnum.propertyGenerateReport,
          label: 'label_property_generate_report',
          isEnabled: isEnabled,
          icon: 'list_alt',
          tooltip: '',
          items: [],
        });

        if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

          // Send email
          menu.items.push({
            id: OperationEnum.propertySendEmail,
            label: 'label_send_by_email',
            isEnabled: isEnabled,
            icon: 'email',
            tooltip: '',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.propertyWrite) > -1) {

          // Duplicate
          menu.items.push({
            id: OperationEnum.propertyDuplicate,
            label: 'label_duplicate',
            isEnabled: isEnabled,
            icon: 'file_copy',
            tooltip: '',
            items: [],
          });

          const isSelectedOnlySell = selectedProperties.length > 0 && selectedProperties.every(property => property.type === TypeEnum.sell);
          const isSelectedOnlyRent = selectedProperties.length > 0 && selectedProperties.every(property => property.type === TypeEnum.rent);

          // Selected properties are only of type "sell" or mix of both
          if (isSelectedOnlySell === true || isSelectedOnlyRent === false) {

            // Convert type to rent
            menu.items.push({
              id: OperationEnum.propertyConvertTypeRent,
              label: 'label_switch_rental',
              isEnabled: isSelectedOnlySell,
              icon: 'swap_horiz',
              tooltip: '',
              items: [],
            });
          }

          // Selected properties are only of type "rent" or mix of both
          if (isSelectedOnlyRent === true || isSelectedOnlySell === false) {

            // Convert type to sale
            menu.items.push({
              id: OperationEnum.propertyConvertTypeSell,
              label: 'label_switch_sale',
              isEnabled: isSelectedOnlyRent,
              icon: 'swap_horiz',
              tooltip: '',
              items: [],
            });
          }

          // Remove MLS
          menu.items.push({
            id: OperationEnum.propertyRemoveMls,
            label: 'label_mls_remove',
            isEnabled: isEnabled,
            icon: 'visibility_off',
            tooltip: '',
            items: [],
          });

          if (
            permissions.indexOf(PermissionEnum.propertyPublishWebsite) > -1 ||
            permissions.indexOf(PermissionEnum.propertyPublishPortal) > -1
          ) {

            // Manage publication
            menu.items.push({
              id: OperationEnum.propertyManagePublication,
              label: 'label_manage_publication',
              isEnabled: isEnabled,
              icon: 'rss_feed',
              tooltip: '',
              items: [],
            });
          }

          if (transferOptions.agency.length > 0) {

            // Transfer broker
            menu.items.push({
              id: OperationEnum.propertyTransferBroker,
              label: 'label_transfer',
              isEnabled: isEnabled,
              icon: 'people',
              tooltip: '',
              items: [],
            });
          }
        }

        if (permissions.indexOf(PermissionEnum.propertyDelete) > -1) {

          // Archive
          menu.items.push({
            id: OperationEnum.propertyArchive,
            label: 'label_archive',
            isEnabled: isEnabled,
            icon: 'block',
            tooltip: '',
            items: [],
          });
        }

        return menu;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, PropertySearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataFeature,
      selectDataAgenciesIncludingMls,
      selectUiCustomAttributeOptions(CustomAttributeTypeEnum.property),
      (
        form: PropertySearchModel,
        options: RuntimeOptionsInterface,
        feature: RuntimeFeatureInterface,
        agencies: OptionInterface[],
        customAttributePropertyOptions: OptionGroupInterface[],
      ): PropertySearchOptionsInterface => {

        const filters = {
          type: options.propertyType,
          categoryIds: options.propertyCategory,
          statusIds: options.propertyStatus,
          prices: [],
          bedrooms: options.bedroom,
          rooms: options.room,
          spaces: options.space,
          sectors: feature.sector ? options.sector : [],
          livingArea: options.livingArea,
          landArea: options.landArea,
          positionIds: options.position,
          viewIds: options.view,
          brokerIds: [],
          publicationIds: [],
          rankingIds: options.ranking,
          agencyId: agencies,
          publicationStatusId: options.publicationStatus,
          visibilityId: options.visibility,
          isDirectTransaction01: options.isDirectTransaction01,
          isPromotion01: options.isPromotion01,
          isSellToForeigner01: options.isSellToForeigner01,
          topLevelAgencyId: ['', options.agencyUser.value, AgencyOptionEnum.group, AgencyOptionEnum.mls],
          customAttributeIds: feature.customAttribute ? customAttributePropertyOptions : [],
        };

        // Sell options
        if (form.type === ListTypeEnum.sell) {

          filters.prices = options.priceSell;
          filters.brokerIds = options.brokerSell;
        }

        // Rent options
        if (form.type === ListTypeEnum.rent) {

          filters.prices = options.priceRent;
          filters.brokerIds = options.brokerRent;
        }

        // Publication website
        if (options.publicationWebsite.length > 0) {

          filters.publicationIds.push({
            label: 'label_websites',
            options: options.publicationWebsite.map(option => {

              return {
                value: 'ws-' + option.value,
                text: option.text,
              };
            }),
          });
        }

        // Publication gateway
        if (options.publicationGateway.length > 0) {

          filters.publicationIds.push({
            label: 'label_gateways',
            options: options.publicationGateway.map(option => {

              return {
                value: 'rp-' + option.value,
                text: option.text,
              };
            }),
          });
        }

        return filters;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorKeywords(uid: string): MemoizedSelector<StateInterface, KeywordInterface[]> {

    return createSelector(
      selectUiKeywords(uid),
      this.getSelectorFormOptions(uid),
      selectDataAutocompleteOptions,
      (
        keywords: KeywordInterface[],
        formOptions: PropertySearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof PropertySearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          type: {
            translation: 'keyword_type',
            option: 'type',
            isRemovable: false,
          },
          categoryIds: {
            translation: 'keyword_category',
            option: 'categoryIds',
            isRemovable: true,
          },
          bedrooms: {
            translation: 'keyword_bedrooms',
            option: 'bedrooms',
            isRemovable: true,
          },
          rooms: {
            translation: 'keyword_rooms',
            option: 'rooms',
            isRemovable: true,
          },
          spaces: {
            translation: 'keyword_generic_label_only',
            option: 'spaces',
            isRemovable: true,
          },
          sectors: {
            translation: 'keyword_sector',
            option: 'sectors',
            isRemovable: true,
          },
          livingArea: {
            translation: 'keyword_habitable_area',
            option: 'livingArea',
            isRemovable: true,
          },
          landArea: {
            translation: 'keyword_land_area',
            option: 'landArea',
            isRemovable: true,
          },
          positionIds: {
            translation: 'keyword_position',
            option: 'positionIds',
            isRemovable: true,
          },
          viewIds: {
            translation: 'keyword_view',
            option: 'viewIds',
            isRemovable: true,
          },
          statusIds: {
            translation: 'keyword_status',
            option: 'statusIds',
            isRemovable: true,
          },
          publicationStatusId: {
            translation: 'keyword_publication',
            option: 'publicationStatusId',
            isRemovable: true,
          },
          visibilityId: {
            translation: 'keyword_visibility',
            option: 'visibilityId',
            isRemovable: true,
          },
          isDirectTransaction01: {
            translation: 'keyword_transaction',
            option: 'isDirectTransaction01',
            isRemovable: true,
          },
          isPromotion01: {
            translation: 'keyword_development',
            option: 'isPromotion01',
            isRemovable: true,
          },
          isSellToForeigner01: {
            translation: 'keyword_sale_foreigner',
            option: 'isSellToForeigner01',
            isRemovable: true,
          },
          rankingIds: {
            translation: 'keyword_ranking',
            option: 'rankingIds',
            isRemovable: true,
          },
          agencyId: {
            translation: 'keyword_agency',
            option: 'agencyId',
            isRemovable: true,
          },
          prices: {
            translation: 'keyword_price',
            option: 'prices',
            isRemovable: true,
          },
          brokerIds: {
            translation: 'keyword_broker',
            option: 'brokerIds',
            isRemovable: true,
          },
        };

        let polygonCounter = 0;

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Keyword name is mapped to a form option
            if (keywordOptionMapping[keyword.name]) {

              updatedKeyword.translation = keywordOptionMapping[keyword.name].translation;

              const label = (<OptionInterface[]>formOptions[keywordOptionMapping[keyword.name].option] || [])
                .find(option => option.value === keyword.value);

              if (label) {

                updatedKeyword.label = label.text;
              }

              updatedKeyword.isRemovable = keywordOptionMapping[keyword.name].isRemovable;

              return updatedKeyword;
            }

            // Publication IDs
            if (keyword.name === 'publicationIds') {

              updatedKeyword.translation = 'keyword_published';
              updatedKeyword.isRemovable = true;

              formOptions.publicationIds
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

              return updatedKeyword;
            }

            // Promotion IDs
            if (keyword.name === 'promotionIds') {

              updatedKeyword.translation = 'keyword_promotion';

              if (autocompleteOptions.promotion[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.promotion[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Property IDs
            if (keyword.name === 'propertyIds') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              // Yes, it is using location options, you are not dreaming (logic from legacy)
              if (autocompleteOptions.location[<string>keyword.value]) {

                updatedKeyword.translation = 'keyword_location';
                updatedKeyword.label = autocompleteOptions.location[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Contact ID
            if (keyword.name === 'contactId') {

              updatedKeyword.translation = 'keyword_contact';

              if (autocompleteOptions.contact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.contact[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Is archive
            if (keyword.name === 'isArchive01') {

              updatedKeyword.isRemovable = false;

              if (keyword.value === '0') {

                updatedKeyword.translation = 'label_property_active';
              }

              if (keyword.value === '1') {

                updatedKeyword.translation = 'label_property_archive';
              }

              return updatedKeyword;
            }

            // Custom attribute IDs
            if (keyword.name === 'customAttributeIds') {

              updatedKeyword.translation = 'keyword_custom_attribute';
              updatedKeyword.isRemovable = true;

              formOptions.customAttributeIds
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.labelKey = optionGroup.label;
                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

              return updatedKeyword;
            }

            // Polygon
            if (keyword.name === 'polygons') {

              polygonCounter++;

              updatedKeyword.translation = 'keyword_polygon';
              updatedKeyword.label = String(polygonCounter);

              return updatedKeyword;
            }

            return updatedKeyword;
          })
          .filter(keyword => keyword !== null)
          .sort((a, b) => {

            const aScore = (a.isRemovable ? 1 : 0);
            const bScore = (b.isRemovable ? 1 : 0);

            return aScore !== bScore ? aScore - bScore : a.name.localeCompare(b.name);
          });
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<PropertySearchModel> {

    return this.store$.select(createSelector(
      selectDataFeatureProperty,
      selectDataOptions,
      (
        featureProperty: RuntimeFeaturePropertyInterface,
        options: RuntimeOptionsInterface,
      ): PropertySearchModel => {

        const filters = this.getEmptyFilters();

        const pathname = this.browserService.getWindow().location.pathname; // TODO[later] Remove usage of BrowserService
        const paths: string[] = pathname.split('/');

        // Set filters "type" and "isArchive01" based on current URL
        filters.type = <ListTypeEnum>paths[paths.length - 1];
        filters.isArchive01 = pathname.indexOf('/archive/') > -1 ? '1' : '0';

        // Set filter "status ID" from property feature
        filters.statusIds = featureProperty.listDefaultStatusId;

        // Set filter agency ID if agency is part of a group or MLS
        if (options.agencyGroup.length > 0 || options.agencyMls.length > 0) {

          filters.agencyId = options.agencyUser.value;
        }

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'creation',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<PropertyModel> {

    return selectDataProperties;
  }

  /**
   * @inheritDoc
   */
  protected getQueryParamFromFilter(key: string, filters: ListFiltersInterface): string {

    if (key === 'polygons') {

      return (<GeolocPolygonInterface[]>filters[key])
        .map(polygon => polygon.vertices.map(vertex => [vertex.lat, vertex.lng].join('~')).join(';'))
        .join(',');
    }

    return super.getQueryParamFromFilter(key, filters);
  }

  /**
   * @inheritDoc
   */
  protected getFilterFromQueryParam(key: string, queryParams: Params, filters: PropertySearchModel): object {

    if (key === 'polygons') {

      const polygons: GeolocPolygonInterface[] = [];

      queryParams[key]
        .split(',')
        .forEach((polygonString, i) => {

          polygons[i] = {
            id: 'polygon-' + i,
            color: '', // No color for now, this problem will be solved in another time
            vertices: polygonString.split(';').map(vertexString => {

              const vertex = vertexString.split('~');

              return {
                lat: parseFloat(vertex[0]),
                lng: parseFloat(vertex[1]),
              };
            }),
          };

        });

      return polygons;
    }

    return super.getFilterFromQueryParam(key, queryParams, filters);
  }
}
