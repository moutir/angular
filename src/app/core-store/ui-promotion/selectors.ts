import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { FEATURE_NAME, UiPromotionStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { PromotionModel } from '../../shared/model/promotion.model';
import { selectDataPromotions } from '../data-promotion/selectors';
import { PromotionBrochureMenuInterface } from '../../shared/interface/promotion-brochure-menu.interface';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { selectDataFeatureBrochure, selectDataOptions, selectDataSettings } from '../data-runtime/selectors';
import { RuntimeSettingsInterface } from '../../shared/interface/runtime-settings.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { RuntimeFeatureBrochureInterface } from '../../shared/interface/runtime-feature-brochure.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiPromotionStateInterface>
  = createFeatureSelector<UiPromotionStateInterface>(FEATURE_NAME);

/**
 * Select the promotion to preview
 */
export const selectUiPreviewPromotion: MemoizedSelector<StateInterface, PromotionModel|null> = createSelector(
  selectDataPromotions,
  selectUiState,
  (
    promotions: Dictionary<PromotionModel>,
    state: UiPromotionStateInterface,
  ): PromotionModel|null => promotions[state.previewPromotionId] || null,
);

/**
 * Select the brochure menu state
 */
export const selectUiBrochureMenu: MemoizedSelector<StateInterface, PromotionBrochureMenuInterface> = createSelector(
  selectUiState,
  (state: UiPromotionStateInterface): PromotionBrochureMenuInterface => state.brochureMenu,
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
    brochureMenu: PromotionBrochureMenuInterface,
    settings: RuntimeSettingsInterface,
    options: RuntimeOptionsInterface,
    featureBrochure: RuntimeFeatureBrochureInterface,
  ): MenuInterface => {

    const label = '{type} ({privacy})';
    const menu: MenuInterface = {
      items: [],
    };

    // For each promotion brochure type
    options.promotionBrochureType.forEach(brochureTypeOption => {

      // For each brochure privacy
      (featureBrochure.mapping.brochureIdToPrivacyIds[brochureTypeOption.value] || []).forEach(brochurePrivacyId => {

        const brochurePrivacyOption = options.brochurePrivacy.find(option => option.value === brochurePrivacyId);

        if (!brochurePrivacyOption) {

          return;
        }

        // Main link to first quality brochure
        const menuItem: MenuItemInterface = {
          id: JSON.stringify({
            promotionId: brochureMenu.promotionId,
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
                promotionId: brochureMenu.promotionId,
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
