import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Dictionary } from 'app/shared/class/dictionary';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { ContactSearchOptionsInterface } from '../../../shared/interface/contact-search-options.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiKeywords, selectUiSearchFilters, selectUiSelection } from '../../../core-store/ui-searchlist/selectors';
import { ListSelectionInterface } from '../../../shared/interface/list-selection.interface';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import {
  selectDataAuthentication,
  selectDataFeature,
  selectDataFeatureContact,
  selectDataOptions,
  selectDataPermissions,
  selectDataSettings,
  selectDataUserPreference,
} from '../../../core-store/data-runtime/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { selectDataContacts } from '../../../core-store/data-contact/selectors';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RuntimeFeatureContactInterface } from '../../../shared/interface/runtime-feature-contact.interface';
import { BrowserService } from '../browser/browser.service';
import { ListTypeEnum } from '../../../shared/enum/list-type.enum';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { ContactTransferOptionsInterface } from '../../../shared/interface/contact-transfer-options.interface';
import { selectUiBrokerOptions, selectUiTransferOptions } from '../../../core-store/ui-contact/selectors';
import { RuntimeSettingsInterface } from '../../../shared/interface/runtime-settings.interface';
import { ContactConfig } from './contact.config';
import { RuntimeFeatureInterface } from '../../../shared/interface/runtime-feature.interface';
import { CustomAttributeTypeEnum } from '../../../shared/enum/custom-attribute-type.enum';
import { selectUiCustomAttributeOptions } from '../../../core-store/ui-custom-attribute/selectors';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';
import { RuntimeUserPreferenceInterface } from '../../../shared/interface/runtime-user-preference.interface';
import { BetaEnum } from '../../../shared/enum/beta.enum';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { SearchlistSearchInterface } from '../../../shared/interface/searchlist-search.interface';

@Injectable()
export class ContactSearchlistService extends SearchlistServiceAbstract<
  ContactModel,
  ContactSearchModel,
  ContactSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ContactConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
    protected browserService: BrowserService,
    protected helperService: HelperService,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): ContactSearchModel {

    return new ContactSearchModel();
  }

  /**
   * @inheritDoc
   */
  updateForm(uid: string, input: InputFormInterface, model: ContactModel): void {

    // Free search too short
    if (input.name === 'contactTextSearch' && String(input.value).length < 3) {

      input.value = '';
    }

    super.updateForm(uid, input, model);
  }

  /**
   * @inheritDoc
   */
  protected getSelectorModelsSelectable(uid: string): MemoizedSelector<StateInterface, ContactModel[]|null> {

    return createSelector(
      this.getSelectorModels(uid),
      (contacts: ContactModel[]|null): ContactModel[] => {

        return contacts !== null ? contacts.filter(contact => contact.isBlacklisted === false && contact.isConfidential === false) : null;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorMenuOperation(uid: string): MemoizedSelector<StateInterface, MenuInterface> {

    return createSelector(
      selectUiSelection(uid),
      selectUiSearchFilters(uid),
      selectDataPermissions,
      selectUiTransferOptions,
      selectDataSettings,
      (
        selection: ListSelectionInterface,
        filters: ContactSearchModel,
        permissions: PermissionEnum[],
        transferOptions: ContactTransferOptionsInterface,
        runtimeSettings: RuntimeSettingsInterface,
      ): MenuInterface => {
        //console.log("il prend il id de selection ",uid)
        const isEnabled = selection.ids.length > 0;
        const menu: MenuInterface = {
          items: [],
        };

        // Archived search
        if (filters.isArchive01 === '1') {

          if (permissions.indexOf(PermissionEnum.contactDelete) > -1) {

            // Unarchive
            menu.items.push({
              id: OperationEnum.contactUnarchive,
              label: 'label_reactivate',
              isEnabled: isEnabled,
              icon: 'add_circle_outline',
              tooltip: '',
              items: [],
            });
          }

          if (selection.ids.length === 1 &&
            permissions.indexOf(PermissionEnum.contactWrite) > -1 &&
            permissions.indexOf(PermissionEnum.contactTransferActivity) > -1) {

            // Transfer activity
            menu.items.push({
              id: OperationEnum.contactTransferActivity,
              label: 'label_transfer_activity',
              isEnabled: isEnabled,
              icon: 'forward',
              tooltip: '',
              items: [],
            });
          }

          // No more menu items if archived search
          return menu;
        }

        if (permissions.indexOf(PermissionEnum.contactWrite) > -1) {

          // Basket search
          if (filters.mode === ListTypeEnum.basket) {

            // Remove basket
            menu.items.push({
              id: OperationEnum.contactRemoveBasket,
              label: 'label_remove_from_basket',
              isEnabled: isEnabled,
              icon: 'remove_shopping_cart',
              tooltip: '',
              items: [],
            })
            //,console.log("",ListTypeEnum.basket);
            
          } else {

            // Add basket
            menu.items.push({
              id: OperationEnum.contactAddBasket,
              label: 'label_add_to_card',
              isEnabled: isEnabled,
              icon: 'add_shopping_cart',
              tooltip: '',
              items: [],
            });
          }
        }

        if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

          const isLimitReached = runtimeSettings.emailLimit > 0 && selection.ids.length > runtimeSettings.emailLimit;

          // Send email
          menu.items.push({
            id: OperationEnum.contactSendEmail,
            label: 'label_email_send',
            isEnabled: isEnabled && isLimitReached === false,
            icon: 'email',
            tooltip: isLimitReached ? 'tooltip_email_limit' : '',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.contactRead) > -1) {

          // Modify broker
          menu.items.push({
            id: OperationEnum.contactModifyBroker,
            label: 'label_edit_broker',
            isEnabled: isEnabled,
            icon: 'people',
            tooltip: '',
            items: [],
          });
        }

        if (selection.ids.length === 1 &&
          permissions.indexOf(PermissionEnum.contactWrite) > -1 &&
          permissions.indexOf(PermissionEnum.contactTransferActivity) > -1) {

          // Transfer activity
          menu.items.push({
            id: OperationEnum.contactTransferActivity,
            label: 'label_transfer_activity',
            isEnabled: isEnabled,
            icon: 'forward',
            tooltip: '',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.contactWrite) > -1) {

          if (transferOptions.agency.length > 0) {

            // Transfer broker
            menu.items.push({
              id: OperationEnum.contactTransferBroker,
              label: 'label_transfer',
              isEnabled: isEnabled,
              icon: 'person',
              tooltip: '',
              items: [],
            });
          }
        }

        if (permissions.indexOf(PermissionEnum.contactDelete) > -1) {

          // Archive
          menu.items.push({
            id: OperationEnum.contactArchive,
            label: 'label_archive',
            isEnabled: isEnabled,
            icon: 'block',
            tooltip: '',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.contactExport) > -1) {

          const isLimitReached = runtimeSettings.exportLimit > 0 && selection.ids.length > runtimeSettings.exportLimit;

          // Summary export
          menu.items.push({
            id: OperationEnum.contactExportSummary,
            label: 'label_summary_export',
            isEnabled: isEnabled && isLimitReached === false,
            icon: 'assignment_returned',
            tooltip: isLimitReached ? 'tooltip_export_limit' : '',
            items: [],
          });

          // Full export
          menu.items.push({
            id: OperationEnum.contactExportFull,
            label: 'label_full_export',
            isEnabled: isEnabled && isLimitReached === false,
            icon: 'cloud_download',
            tooltip: isLimitReached ? 'tooltip_export_limit' : '',
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
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, ContactSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      selectDataPermissions,
      selectUiBrokerOptions,
      selectDataFeature,
      selectUiCustomAttributeOptions(CustomAttributeTypeEnum.contact),
      (
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        brokerOptions: OptionInterface[],
        feature: RuntimeFeatureInterface,
        customAttributeContactOptions: OptionGroupInterface[],
      ): ContactSearchOptionsInterface => {

        const filters = {
          mode: options.contactMode,
          circle: options.circle,
          typeIds: options.contactType,
          languageId: options.languageCommunication,
          brokerIds: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
          searchManagerIds: permissions.indexOf(PermissionEnum.contactRead) > -1 ? brokerOptions : [],
          brokerByAgency: permissions.indexOf(PermissionEnum.contactRead) > -1 ? options.brokerByAgency : [],
          searchManagerByAgency: permissions.indexOf(PermissionEnum.contactRead) > -1 ? options.brokerByAgency : [],
          rankingIds: options.ranking,
          visibilityId: options.visibility,
          transactionId: options.transaction,
          bedrooms: options.bedroom,
          rooms: options.bedroom,
          area: options.area,
          positionIds: options.position,
          viewIds: options.view,
          searchConditionId: options.contactSearch,
          contactConditionIds: options.contactSpecialType,
          searchTypeId: options.contactSearchType,
          originIds: options.contactOrigin,
          categoryIds: options.propertyCategory,
          prices: [],
          lastContactId: options.lastContact,
          isDirectClient01: options.isDirectClient01,
          isVip01: options.isVip01,
          isInvalidEmail01: [],
          customAttributeIds: feature.customAttribute ? customAttributeContactOptions : [],
        };

        // Sale prices
        if (options.priceSell.length > 0) {

          filters.prices.push({
            label: 'label_search_buy',
            options: options.priceSell.map(option => {

              return {
                value: 'sell_' + option.value,
                text: option.text,
              };
            }),
          });
        }

        // Rental prices
        if (options.priceRent.length > 0) {

          filters.prices.push({
            label: 'label_rental_singular',
            options: options.priceRent.map(option => {

              return {
                value: 'rental_' + option.value,
                text: option.text,
              };
            }),
          });
        }
       // var contactME = JSON.parse(localStorage.getItem("contactIds"));
       // console.log("localstorage",contactME);
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
      selectDataUserPreference,
      (
        keywords: KeywordInterface[],
        formOptions: ContactSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
        userPreference: RuntimeUserPreferenceInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof ContactSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          mode: {
            translation: 'keyword_mode',
            option: 'mode',
            isRemovable: false,
          },
          circle: {
            translation: 'keyword_circle',
            option: 'circle',
            isRemovable: false,
          },
          typeIds: {
            translation: 'keyword_type',
            option: 'typeIds',
            isRemovable: true,
          },
          languageId: {
            translation: 'keyword_language',
            option: 'languageId',
            isRemovable: true,
          },
          brokerIds: {
            translation: 'keyword_broker',
            option: 'brokerIds',
            isRemovable: true,
          },
          searchManagerIds: {
            translation: 'keyword_contact_search_manager',
            option: 'searchManagerIds',
            isRemovable: true,
          },
          isDirectClient01: {
            translation: 'keyword_direct_client',
            option: 'isDirectClient01',
            isRemovable: true,
          },
          rankingIds: {
            translation: 'keyword_ranking',
            option: 'rankingIds',
            isRemovable: true,
          },
          visibilityId: {
            translation: 'keyword_visibility',
            option: 'visibilityId',
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
          area: {
            translation: 'keyword_area',
            option: 'area',
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
          categoryIds: {
            translation: 'keyword_category',
            option: 'categoryIds',
            isRemovable: true,
          },
          originIds: {
            translation: 'keyword_source',
            option: 'originIds',
            isRemovable: true,
          },
          transactionId: {
            translation: 'keyword_transaction',
            option: 'transactionId',
            isRemovable: true,
          },
          isVip01: {
            translation: 'keyword_vip',
            option: 'isVip01',
            isRemovable: true,
          },
          searchConditionId: {
            translation: 'keyword_generic_label_only',
            option: 'searchConditionId',
            isRemovable: true,
          },
          contactConditionIds: {
            translation: 'keyword_generic_label_only',
            option: 'contactConditionIds',
            isRemovable: true,
          },
          searchTypeId: {
            translation: 'keyword_contact_search_type',
            option: 'searchTypeId',
            isRemovable: true,
          },
          lastContactId: {
            translation: 'keyword_last_contact',
            option: 'lastContactId',
            isRemovable: true,
          },
          isInvalidEmail01: {
            translation: 'keyword_invalid_email',
            option: 'isInvalidEmail01',
            isRemovable: true,
          },
        };

        // Option groups to search for values in sub options
        const optionGroups = {
          typeIds: formOptions.typeIds,
          originIds: formOptions.originIds,
          brokerIds: formOptions.brokerByAgency,
          searchManagerIds: formOptions.searchManagerByAgency,
        };

        return keywords
          .map(keyword => {

            // Remove circle keyword if not beta performance
            if (
              keyword.name === 'circle' &&
              (!userPreference.beta.hasOwnProperty(BetaEnum.performance) || !userPreference.beta[BetaEnum.performance])
            ) {

              return null;
            }

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

              // No label found, but is defined as option group
              if (!label && optionGroups.hasOwnProperty(keyword.name)) {

                optionGroups[keyword.name]
                  .some(optionGroup => {

                    const newLabel = optionGroup.options.find(option => option.value === keyword.value);

                    if (newLabel) {

                      updatedKeyword.label = newLabel.text;
                    }

                    return !!newLabel;
                  });

                return updatedKeyword;
              }

              return updatedKeyword;
            }

            // Contact free search or property free search
            if (keyword.name === 'contactTextSearch' || keyword.name === 'propertyTextSearch') {

              updatedKeyword.translation = 'keyword_text_search';
              updatedKeyword.label = <string>keyword.value;

              return updatedKeyword;
            }

            // Min/max keywords
            const keywordMinMax = {
              'bedroomMin': 'keyword_bedroom_min',
              'bedroomMax': 'keyword_bedroom_max',
              'roomMin': 'keyword_room_min',
              'roomMax': 'keyword_room_max',
              'priceMin': 'keyword_price_min',
              'priceMax': 'keyword_price_max',
              'areaMin': 'keyword_area_min',
              'areaMax': 'keyword_area_max',
            };

            if (keywordMinMax[keyword.name]) {

              updatedKeyword.translation = keywordMinMax[keyword.name];
              updatedKeyword.label = this.helperService.formatNumber(<string>keyword.value);

              return updatedKeyword;
            }

            // Contact free search or property free search
            if (keyword.name === 'contactTextSearch' || keyword.name === 'propertyTextSearch') {

              updatedKeyword.translation = 'keyword_text_search';
              updatedKeyword.label = <string>keyword.value;

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

            // Property IDs
            if (keyword.name === 'propertyIds') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }
            }

            // Location IDs
            if (keyword.name === 'locationIds') {

              updatedKeyword.translation = 'keyword_location';

              if (autocompleteOptions.location[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.location[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Location path
            if (keyword.name === 'locationPath') {

              updatedKeyword.translation = 'keyword_location';

              if (autocompleteOptions.locationPath[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.locationPath[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Is archive
            if (keyword.name === 'isArchive01') {

              updatedKeyword.isRemovable = false;

              if (keyword.value === '0') {

                updatedKeyword.translation = 'label_contact_active';
              }

              if (keyword.value === '1') {

                updatedKeyword.translation = 'label_contacts_archive';
              }

              return updatedKeyword;
            }

            // Prices
            if (keyword.name === 'prices') {

              updatedKeyword.translation = 'keyword_price';
              updatedKeyword.isRemovable = true;

              formOptions.prices
                .some(optionGroup => {

                  const label = optionGroup.options.find(option => option.value === keyword.value);

                  if (label) {

                    updatedKeyword.translation = [updatedKeyword.translation, label.value.split('_')[0]].join('_');
                    updatedKeyword.label = label.text;
                  }

                  return !!label;
                });

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
  protected selectDefaultFilters(): Observable<ContactSearchModel> {

    return this.store$.select(createSelector(
      selectDataFeatureContact,
      selectDataAuthentication,
      (
        featureContact: RuntimeFeatureContactInterface,
        authentication: RuntimeAuthenticationInterface,
      ): ContactSearchModel => {

        const filters = this.getEmptyFilters();

        filters.circle = authentication.isMultiAgency ? 'circle_group' : 'circle_agency';

        // Set filters "mode" and "isArchive01" based on current URL
        const pathname = this.browserService.getWindow().location.pathname; // TODO[later] Remove usage of BrowserService
        const paths: string[] = pathname.split('/');
        filters.mode = <ListTypeEnum>paths[paths.length - 1];
        filters.isArchive01 = pathname.indexOf('/archive') > -1 ? '1' : '0';

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  selectSearchPreference(uid: string): Observable<SearchlistSearchInterface> {

    return this.store$.select(createSelector(
      selectDataUserPreference,
      selectDataAuthentication,
      (
        userPreference: RuntimeUserPreferenceInterface,
        authentication: RuntimeAuthenticationInterface,
      ): SearchlistSearchInterface => {

        const search = this.getSearchPreference(uid, userPreference);

        if (!search.filters) {

          return search;
        }

        // Beta performance user
        if (
          !search.filters['circle'] &&
          userPreference.beta.hasOwnProperty(BetaEnum.performance) &&
          userPreference.beta[BetaEnum.performance]
        ) {

          search.filters['circle'] = authentication.isMultiAgency ? 'circle_group' : 'circle_agency';
        }

        return search;
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
  protected selectDataModels(): (state: StateInterface) => Dictionary<ContactModel> {

    return selectDataContacts;
  }
}
