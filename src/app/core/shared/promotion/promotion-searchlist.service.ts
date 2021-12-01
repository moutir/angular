import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { selectUiKeywords, selectUiSearchFilters } from '../../../core-store/ui-searchlist/selectors';
import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { PromotionSearchOptionsInterface } from '../../../shared/interface/promotion-search-options.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import {
  selectDataAgenciesIncludingMls,
  selectDataFeature,
  selectDataOptions,
  selectDataPermissions,
} from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { selectDataPromotions } from '../../../core-store/data-promotion/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { BrowserService } from '../browser/browser.service';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyOptionEnum } from '../../../shared/enum/agency-option.enum';
import { PromotionConfig } from './promotion.config';
import { RuntimeFeatureInterface } from '../../../shared/interface/runtime-feature.interface';
import { selectUiCustomAttributeOptions } from '../../../core-store/ui-custom-attribute/selectors';
import { CustomAttributeTypeEnum } from '../../../shared/enum/custom-attribute-type.enum';
import { OptionGroupInterface } from '../../../shared/interface/option-group.interface';

@Injectable()
export class PromotionSearchlistService extends SearchlistServiceAbstract<
  PromotionModel,
  PromotionSearchModel,
  PromotionSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: PromotionConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected translateService: TranslateService,
    protected browserService: BrowserService,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): PromotionSearchModel {

    return new PromotionSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorModelsSelectable(uid: string): MemoizedSelector<StateInterface, PromotionModel[]|null> {

    return createSelector(
      this.getSelectorModels(uid),
      (promotions: PromotionModel[]|null): PromotionModel[] => {

        return promotions !== null ? promotions.filter(promotion => promotion.isBlacklisted === false) : null;
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
      (
        promotions: PromotionModel[]|null,
        filters: PromotionSearchModel,
        permissions: PermissionEnum[],
      ): MenuInterface => {

        const selectedPromotions = promotions || [];
        const isEnabled = selectedPromotions.length > 0;
        const menu: MenuInterface = {
          items: [],
        };

        // Archived search
        if (filters.isArchive01 === '1') {

          if (permissions.indexOf(PermissionEnum.promotionDelete) > -1) {

            // Unarchive
            menu.items.push({
              id: OperationEnum.promotionUnarchive,
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

        if (permissions.indexOf(PermissionEnum.promotionWrite) > -1) {

          // Remove MLS
          menu.items.push({
            id: OperationEnum.promotionRemoveMls,
            label: 'label_mls_remove_promotion',
            isEnabled: isEnabled,
            icon: 'visibility_off',
            tooltip: '',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

          // Send email
          menu.items.push({
            id: OperationEnum.promotionSendEmail,
            label: 'label_send_by_email',
            isEnabled: isEnabled,
            icon: 'email',
            tooltip: '',
            items: [],
          });
        }

        if (permissions.indexOf(PermissionEnum.promotionDelete) > -1) {

          // Archive
          menu.items.push({
            id: OperationEnum.promotionArchive,
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
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, PromotionSearchOptionsInterface> {

    return createSelector(
      selectDataOptions,
      selectDataFeature,
      selectDataAgenciesIncludingMls,
      selectUiCustomAttributeOptions(CustomAttributeTypeEnum.promotion),
      (
        options: RuntimeOptionsInterface,
        feature: RuntimeFeatureInterface,
        agencies: OptionInterface[],
        customAttributePromotionOptions: OptionGroupInterface[],
      ): PromotionSearchOptionsInterface => {

        const filters = {
          promotionIds: [],
          contactId: [],
          statusIds: options.promotionStatus,
          agencyId: agencies,
          topLevelAgencyId: ['', options.agencyUser.value, AgencyOptionEnum.group, AgencyOptionEnum.mls],
          customAttributeIds: feature.customAttribute ? customAttributePromotionOptions : [],
        };

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
        formOptions: PromotionSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof PromotionSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          statusIds: {
            translation: 'keyword_status',
            option: 'statusIds',
            isRemovable: true,
          },
          agencyId: {
            translation: 'keyword_agency',
            option: 'agencyId',
            isRemovable: true,
          },
        };

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

            // Promotion IDs
            if (keyword.name === 'promotionIds') {

              updatedKeyword.translation = 'keyword_promotion';

              if (autocompleteOptions.promotion[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.promotion[<string>keyword.value].text;
              }

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

                updatedKeyword.translation = 'label_navigation_promotion_active';
              }

              if (keyword.value === '1') {

                updatedKeyword.translation = 'label_navigation_promotion_archive';
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
  protected selectDefaultFilters(): Observable<PromotionSearchModel> {

    return this.store$.select(createSelector(
      selectDataOptions,
      (
        options: RuntimeOptionsInterface,
      ): PromotionSearchModel => {

        const filters = this.getEmptyFilters();

        const pathname = this.browserService.getWindow().location.pathname; // TODO[later] Remove usage of BrowserService

        // Set filter "isArchive01" based on current URL
        filters.isArchive01 = pathname.indexOf('/archive') > -1 ? '1' : '0';

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
      id: 'id',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<PromotionModel> {

    return selectDataPromotions;
  }
}
