import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { ReportingSearchOptionsInterface } from '../../../shared/interface/reporting-search-options.interface';
import { ReportingSearchModel } from '../../../shared/model/reporting-search.model';
import { selectDataReportings } from '../../../core-store/data-reporting/selectors';
import { selectUiForm, selectUiKeywords, selectUiSearchFilters } from '../../../core-store/ui-searchlist/selectors';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ReportingStatusEnum } from '../../../shared/enum/reporting-status.enum';
import { selectDataFeatureReporting, selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RuntimeFeatureReportingInterface } from '../../../shared/interface/runtime-feature-reporting.interface';
import { ReportingConfig } from './reporting.config';

@Injectable()
export class ReportingSearchlistService extends SearchlistServiceAbstract<
  ReportingModel,
  ReportingSearchModel,
  ReportingSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ReportingConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected translateService: TranslateService,
    protected helperService: HelperService,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): ReportingSearchModel {

    return new ReportingSearchModel();
  }

  /**
   * Select the type tab index
   */
  selectTypeTabIndex(uid: string): Observable<number> {

    return this.store$.select(
      createSelector(
        selectUiForm(uid),
        this.getSelectorFormOptions(uid),
        (
          form: ReportingSearchModel,
          formOptions: ReportingSearchOptionsInterface,
        ): number => {

          const index = formOptions.reportType
            .map(option => option.value)
            .indexOf(form.reportType);

          return index === -1 ? 0 : index;
        },
      ),
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorModelsSelectable(uid: string): MemoizedSelector<StateInterface, ReportingModel[]|null> {

    return createSelector(
      this.getSelectorModels(uid),
      (reports: ReportingModel[]|null): ReportingModel[] => {

        return reports !== null ? reports.filter(report => report.processStatus === ReportingStatusEnum.pending) : null;
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
      (
        reports: ReportingModel[]|null,
        filters: ReportingSearchModel,
      ): MenuInterface => {

        const selectedReports = reports || [];
        const isEnabled = selectedReports.length > 0;
        const menu: MenuInterface = {
          items: [],
        };

        // Send report
        menu.items.push({
          id: OperationEnum.reportingSend,
          label: 'label_process_send_report_plural',
          isEnabled: isEnabled,
          icon: 'check_circle',
          tooltip: '',
          items: [],
        });

        // Refuse report
        menu.items.push({
          id: OperationEnum.reportingRefuse,
          label: 'label_process_refuse_report_plural',
          isEnabled: isEnabled,
          icon: 'cancel',
          tooltip: '',
          items: [],
        });

        return menu;
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, ReportingSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      (form: ReportingSearchModel, options: RuntimeOptionsInterface): ReportingSearchOptionsInterface => {

        const filters = {
          categoryIds: options.propertyCategory,
          prices: options.priceSell,
          bedrooms: options.bedroom,
          rooms: options.bedroom,
          livingArea: options.livingArea,
          landArea: options.landArea,
          positionIds: options.position,
          viewIds: options.view,
          brokerIds: options.brokerSell,
          propertyStatusIds: options.propertyStatus,
          processStatusIds: options.reportingStatus,
          reportType: options.reportingType,
          publicationIds: [],
          rankingIds: options.ranking,
          publicationStatusId: options.publicationStatus,
          visibilityId: options.visibility,
          isDirectTransaction01: options.isDirectTransaction01,
          isPromotion01: options.isPromotion01,
          isSellToForeigner01: options.isSellToForeigner01,
          processDateFrom: [],
          processDateTo: [],
        };

        filters.prices = options.priceSell;
        filters.brokerIds = options.brokerSell;

        // Publication website
        if (options.publicationWebsite.length > 0) {

          filters.publicationIds.push({
            label: this.translateService.instant('label_websites'),
            options: options.publicationWebsite,
          });
        }

        // Publication gateway
        if (options.publicationGateway.length > 0) {

          filters.publicationIds.push({
            label: this.translateService.instant('label_gateways'),
            options: options.publicationGateway,
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
        formOptions: ReportingSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof ReportingSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          reportType: {
            translation: 'keyword_report_type',
            option: 'reportType',
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
          livingArea: {
            translation: 'keyword_living_area',
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
          propertyStatusIds: {
            translation: 'keyword_status',
            option: 'propertyStatusIds',
            isRemovable: true,
          },
          processStatusIds: {
            translation: 'keyword_status',
            option: 'processStatusIds',
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
          processDateFrom: {
            translation: 'keyword_date_from',
            option: 'processDateFrom',
            isRemovable: true,
          },
          processDateTo: {
            translation: 'keyword_date_to',
            option: 'processDateTo',
            isRemovable: true,
          },
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Dates
            if (keyword.name === 'processDateFrom' || keyword.name === 'processDateTo') {

              if (keyword.value instanceof Date === false && !Date.parse(String(keyword.value))) {

                return null;
              }

              updatedKeyword.value = this.helperService.dateToString(new Date(keyword.value), DateFormatEnum.switzerland);
              updatedKeyword.label = updatedKeyword.value;
            }

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
  protected selectDefaultFilters(): Observable<ReportingSearchModel> {

    return this.store$.select(createSelector(
      selectDataFeatureReporting,
      (
        featureReporting: RuntimeFeatureReportingInterface,
      ): ReportingSearchModel => {

        const filters = this.getEmptyFilters();

        filters.reportType = 'owner'; // TODO[later] Use same logic as in MatchingGroupSearchlistService:selectDefaultFilters()

        // Set filter "process status ID" from report feature
        filters.processStatusIds = featureReporting.listDefaultProcessStatusId;

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'report_created_at',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<ReportingModel> {

    return selectDataReportings;
  }
}
