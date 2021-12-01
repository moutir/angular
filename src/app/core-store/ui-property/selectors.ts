import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiPropertyStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { PropertyTransferInterface } from '../../shared/interface/property-transfer.interface';
import { PropertyTransferOptionsInterface } from '../../shared/interface/property-transfer-options.interface';
import { selectDataFeatureBrochure, selectDataOptions, selectDataSettings } from '../data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { selectDataByAgency, selectDataContacts } from '../data-contact/selectors';
import { ContactModel } from '../../shared/model/contact.model';
import { PropertyPublicationOptionsInterface } from '../../shared/interface/property-publication-options.interface';
import { PropertyPublicationInterface } from '../../shared/interface/property-publication.interface';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { PropertyBrochureMenuInterface } from '../../shared/interface/property-brochure-menu.interface';
import { PropertyModel } from '../../shared/model/property.model';
import { PropertyMortgageInterface } from '../../shared/interface/property-mortgage.interface';
import { selectDataProperties } from '../data-property/selectors';
import { PropertyValuationInterface } from '../../shared/interface/property-valuation.interface';
import { PropertyBrochureInterface } from '../../shared/interface/property-brochure.interface';
import { PropertyBrochureOptionsInterface } from '../../shared/interface/property-brochure-options.interface';
import { OptionInterface } from '../../shared/interface/option.interface';
import { selectUiBrokerOptions } from '../ui-contact/selectors';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';
import { Dictionary } from '../../shared/class/dictionary';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiPropertyStateInterface>
  = createFeatureSelector<UiPropertyStateInterface>(FEATURE_NAME);

/**
 * Select property IDs in basket
 */
export const selectUiBasketPropertyIds: MemoizedSelector<StateInterface, string[]> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): string[] => state.basketPropertyIds,
);

/**
 * Select property transfer
 */
export const selectUiTransfer: MemoizedSelector<StateInterface, PropertyTransferInterface> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): PropertyTransferInterface => state.transfer,
);

/**
 * Select property transfer options
 */
export const selectUiTransferOptions: MemoizedSelector<StateInterface, PropertyTransferOptionsInterface> = createSelector(
  selectUiTransfer,
  selectDataOptions,
  selectDataByAgency,
  selectDataContacts,
  (
    transfer: PropertyTransferInterface,
    runtimeOptions: RuntimeOptionsInterface,
    byAgency: Dictionary<string[]>,
    contacts: Dictionary<ContactModel>,
  ): PropertyTransferOptionsInterface => {

    const options = {
      agency: [],
      broker: [],
    };

    // Has group of agencies
    if (runtimeOptions.agencyGroup.length > 0) {

      options.agency = options.agency.concat(runtimeOptions.agencyGroup);
    }

    // Has brokers per agency
    if (!!byAgency[transfer.agencyId]) {

      options.broker = byAgency[transfer.agencyId]
        .filter(id => !!contacts[id])
        .map(id => {

          return {
            value: contacts[id].id,
            text: contacts[id].fullName,
          };
        });
    }

    return options;
  },
);

/**
 * Select property publication
 */
export const selectUiPublication: MemoizedSelector<StateInterface, PropertyPublicationInterface> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): PropertyPublicationInterface => state.publication,
);

/**
 * Select property publication options
 */
export const selectUiPublicationOptions: MemoizedSelector<StateInterface, PropertyPublicationOptionsInterface> = createSelector(
  selectDataOptions,
  (settingsOptions: RuntimeOptionsInterface): PropertyPublicationOptionsInterface => {

    return {
      websites: settingsOptions.publicationWebsite,
      portals: settingsOptions.publicationGateway,
    };
  },
);

/**
 * Select mortgage
 */
export const selectUiMortgage: MemoizedSelector<StateInterface, PropertyMortgageInterface> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): PropertyMortgageInterface => state.mortgage,
);

/**
 * Select mortgage's property
 */
export const selectUiMortgageProperty: MemoizedSelector<StateInterface, PropertyModel> = createSelector(
  selectDataProperties,
  selectUiMortgage,
  (
    properties: Dictionary<PropertyModel>,
    mortgage: PropertyMortgageInterface,
  ): PropertyModel => properties[mortgage.propertyId] || new PropertyModel(),
);

/**
 * Select valuation
 */
export const selectUiValuation: MemoizedSelector<StateInterface, PropertyValuationInterface> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): PropertyValuationInterface => state.valuation,
);

/**
 * Select brochure
 */
export const selectUiBrochure: MemoizedSelector<StateInterface, PropertyBrochureInterface> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): PropertyBrochureInterface => state.brochure,
);

/**
 * Select brochure's property
 */
export const selectUiBrochureProperty: MemoizedSelector<StateInterface, PropertyModel> = createSelector(
  selectDataProperties,
  selectUiBrochure,
  (
    properties: Dictionary<PropertyModel>,
    brochure: PropertyBrochureInterface,
  ): PropertyModel => properties[brochure.propertyId] || new PropertyModel(),
);

/**
 * Select brochure options
 */
export const selectUiBrochureOptions: MemoizedSelector<StateInterface, PropertyBrochureOptionsInterface> = createSelector(
  selectUiBrochure,
  selectDataOptions,
  selectUiBrokerOptions,
  selectDataFeatureBrochure,
  (
    brochure: PropertyBrochureInterface,
    options: RuntimeOptionsInterface,
    brokerOptions: OptionInterface[],
    featureBrochure: RuntimeFeatureBrochureInterface,
  ): PropertyBrochureOptionsInterface => {

    const privacyIds = featureBrochure.mapping.brochureIdToPrivacyIds[brochure.typeId] || [];

    return {
      typeId: options.propertyBrochureType,
      privacyId: options.brochurePrivacy.filter(option => privacyIds.indexOf(option.value) > -1),
      quality: options.brochureQuality,
      language: options.languageCommunication,
      brokerId: [{
        value: 'automatic',
        text: 'label_automatic_selection',
      }].concat(brokerOptions),
    };
  },
);

/**
 * Select the property to preview
 */
export const selectUiPreviewProperty: MemoizedSelector<StateInterface, PropertyModel|null> = createSelector(
  selectDataProperties,
  selectUiState,
  (
    properties: Dictionary<PropertyModel>,
    state: UiPropertyStateInterface,
  ): PropertyModel|null => properties[state.previewPropertyId] || null,
);

/**
 * Select the brochure menu state
 */
export const selectUiBrochureMenu: MemoizedSelector<StateInterface, PropertyBrochureMenuInterface> = createSelector(
  selectUiState,
  (state: UiPropertyStateInterface): PropertyBrochureMenuInterface => state.brochureMenu,
);

/**
 * Select the brochure menu items
 */
export const selectUiBrochureMenuItems: MemoizedSelector<StateInterface, MenuInterface> = createSelector(
  selectUiBrochureMenu,
  selectDataSettings,
  selectDataOptions,
  selectDataFeatureBrochure,
  (
    brochureMenu: PropertyBrochureMenuInterface,
    settings: RuntimeSettingsInterface,
    options: RuntimeOptionsInterface,
    featureBrochure: RuntimeFeatureBrochureInterface,
  ): MenuInterface => {

    const label = '{type} ({privacy})';
    const menu: MenuInterface = {
      items: [],
    };

    // For each property brochure type
    options.propertyBrochureType.forEach(brochureTypeOption => {

      // For each brochure privacy
      (featureBrochure.mapping.brochureIdToPrivacyIds[brochureTypeOption.value] || []).forEach(brochurePrivacyId => {

        const brochurePrivacyOption = options.brochurePrivacy.find(option => option.value === brochurePrivacyId);

        if (!brochurePrivacyOption) {

          return;
        }

        // Main link to first quality brochure
        const menuItem: MenuItemInterface = {
          id: JSON.stringify({
            propertyId: brochureMenu.propertyId,
            typeId: brochureTypeOption.value,
            type: featureBrochure.mapping.brochureIdToBrochureType[brochureTypeOption.value],
            privacyId: brochurePrivacyOption.value,
            privacy: featureBrochure.mapping.privacyIdToPrivacyType[brochurePrivacyOption.value],
            quality: options.brochureQuality[0].value,
            language: settings.language.current,
          }),
          label: label.replace('{type}', brochureTypeOption.text).replace('{privacy}', brochurePrivacyOption.text),
          icon: '',
          tooltip: '',
          isEnabled: true,
          items: [],
        };

        // For each language
        options.languageCommunication.forEach(language => {

          // For each quality
          options.brochureQuality.forEach(brochureQualityOption => {

            // Add menu child
            menuItem.items.push({
              id: JSON.stringify({
                propertyId: brochureMenu.propertyId,
                typeId: brochureTypeOption.value,
                type: featureBrochure.mapping.brochureIdToBrochureType[brochureTypeOption.value],
                privacyId: brochurePrivacyOption.value,
                privacy: featureBrochure.mapping.privacyIdToPrivacyType[brochurePrivacyOption.value],
                quality: brochureQualityOption.value,
                language: language.value,
              }),
              label: 'label_quality_' + brochureQualityOption.value,
              icon: 'flag-' + language.value,
              tooltip: '',
              isEnabled: true,
              items: [],
            });
          });
        });

        // Add menu item
        menu.items.push(menuItem);
      });
    });

    return menu;
  },
);
