import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Dictionary } from 'app/shared/class/dictionary';
import { Location } from '@angular/common';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { ReportModel } from '../../../shared/model/report.model';
import { ReportSearchOptionsInterface } from '../../../shared/interface/report-search-options.interface';
import { ReportSearchModel } from '../../../shared/model/report-search.model';
import { selectDataReports } from '../../../core-store/data-report/selectors';
import { selectUiForm, selectUiKeywords, selectUiSearchFilters } from '../../../core-store/ui-searchlist/selectors';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import {
  selectDataAuthentication,
  selectDataFeatureReport,
  selectDataOptions,
  selectDataPermissions,
} from '../../../core-store/data-runtime/selectors';
import { HelperService } from '../helper.service';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RuntimeFeatureReportInterface } from '../../../shared/interface/runtime-feature-report.interface';
import { DateFormatEnum } from '../../../shared/enum/date-format.enum';
import { selectUiBrochureMenuItems } from '../../../core-store/ui-report/selectors';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { ReportTypeEnum } from '../../../shared/enum/report-type.enum';
import { ReportConfig } from './report.config';
import { ReportService } from './report.service';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';

@Injectable()
export class ReportSearchlistService extends SearchlistServiceAbstract<
  ReportModel,
  ReportSearchModel,
  ReportSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ReportConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected translateService: TranslateService,
    protected reportService: ReportService,
    protected helperService: HelperService,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): ReportSearchModel {

    return new ReportSearchModel();
  }

  /**
   * @inheritDoc
   */
  protected getSelectorModelsSelectable(uid: string): MemoizedSelector<StateInterface, ReportModel[]|null> {

    return createSelector(
      this.getSelectorModels(uid),
      selectUiSearchFilters(uid),
      selectDataPermissions,
      selectDataAuthentication,
      (
        reports: ReportModel[]|null,
        filters: ReportSearchModel,
        permissions: PermissionEnum[],
        authentication: RuntimeAuthenticationInterface,
      ): ReportModel[] => {

        return reports !== null ?
          reports.filter(
            report => report.hasEmail === true &&
              this.reportService.hasPermissionUpdate(
                filters.reportType,
                report,
                permissions,
                authentication,
              ),
          ) :
          null;
      },
    );
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
          form: ReportSearchModel,
          formOptions: ReportSearchOptionsInterface,
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
   * Returns the brochures menu definition
   */
  selectBrochureMenuItems(uid: string): Observable<MenuInterface> {

    return this.store$.select(selectUiBrochureMenuItems(uid));
  }

  /**
   * Select report feature
   */
  selectFeatureReport(): Observable<RuntimeFeatureReportInterface> {

    return this.store$.select(selectDataFeatureReport);
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
        reports: ReportModel[]|null,
        filters: ReportSearchModel,
        permissions: PermissionEnum[],
      ): MenuInterface => {

        const selectedReports = reports || [];
        const isEnabled = selectedReports.length > 0;
        const menu: MenuInterface = {
          items: [],
        };

        if (permissions.indexOf(PermissionEnum.mailboxWrite) > -1) {

          // Send by email
          menu.items.push({
            id: OperationEnum.reportSendEmail,
            label: 'label_send_by_email',
            isEnabled: isEnabled,
            icon: 'email',
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
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, ReportSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      selectDataPermissions,
      selectDataFeatureReport,
      (
        form: ReportSearchModel,
        options: RuntimeOptionsInterface,
        permissions: PermissionEnum[],
        featureReport: RuntimeFeatureReportInterface,
      ): ReportSearchOptionsInterface => {

        // Buyer, tenant and intermediary report types need task read permission
        const reportTypes = options.reportType.filter(
          t => (permissions.indexOf(PermissionEnum.taskRead) > -1 ||
            (t.value !== ReportTypeEnum.buyer && t.value !== ReportTypeEnum.tenant && t.value !== ReportTypeEnum.intermediary)),
        );

        let filters = {
          reportType: reportTypes,
          propertyIds: [],
          clientIds: [],
          brokerIds: [],
          dateFrom: [],
          dateTo: [],
          propertyTypeId: [],
          scheduleId: [],
        };

        if (form.reportType === ReportTypeEnum.owner) {

          filters = {
            ...filters,
            reportType: reportTypes,
            propertyTypeId: options.reportPropertyType,
            scheduleId: featureReport.isSchedulerEnabled === true ? options.reportScheduleType : [],
          };
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
      selectUiForm(uid),
      this.getSelectorFormOptions(uid),
      selectDataAutocompleteOptions,
      (
        keywords: KeywordInterface[],
        form: ReportSearchModel,
        formOptions: ReportSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof ReportSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
          reportType: {
            translation: 'keyword_report_type',
            option: 'reportType',
            isRemovable: false,
          },
          dateFrom: {
            translation: 'keyword_date_from',
            option: 'dateFrom',
            isRemovable: true,
          },
          dateTo: {
            translation: 'keyword_date_to',
            option: 'dateTo',
            isRemovable: true,
          },
          propertyTypeId: {
            translation: 'keyword_property_type',
            option: 'propertyTypeId',
            isRemovable: true,
          },
          scheduleId: {
            translation: 'keyword_schedule_type',
            option: 'scheduleId',
            isRemovable: true,
          },
        };

        return keywords
          .map(keyword => {

            const updatedKeyword = {
              ...keyword,
            };

            // Ignore keyword if not applicable for the report type
            if (form.reportType !== ReportTypeEnum.owner &&
              (keyword.name === 'propertyIds' || keyword.name === 'propertyTypeId' || keyword.name === 'scheduleId'))  {

              return null;
            }

            // Dates
            if (keyword.name === 'dateFrom' || keyword.name === 'dateTo') {

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

            // Property IDs
            if (keyword.name === 'propertyIds') {

              updatedKeyword.translation = 'keyword_property';

              if (autocompleteOptions.property[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.property[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Client IDs
            if (keyword.name === 'clientIds') {

              updatedKeyword.translation = 'keyword_client';

              if (autocompleteOptions.reportContact[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.reportContact[<string>keyword.value].text;
              }

              return updatedKeyword;
            }

            // Broker IDs
            if (keyword.name === 'brokerIds') {

              updatedKeyword.translation = 'keyword_broker';

              if (autocompleteOptions.broker[<string>keyword.value]) {

                updatedKeyword.label = autocompleteOptions.broker[<string>keyword.value].text;
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
  protected selectDefaultFilters(): Observable<ReportSearchModel> {

    return this.store$.select(createSelector(
      selectDataOptions,
      selectDataFeatureReport,
      (
        options: RuntimeOptionsInterface,
        featureReport: RuntimeFeatureReportInterface,
      ): ReportSearchModel => {

        const filters = this.getEmptyFilters();

        filters.reportType = options.reportType && options.reportType[0] ? <ReportTypeEnum>options.reportType[0].value : null;

        // Set filter "report property type" from report feature
        filters.propertyTypeId = featureReport.listDefaultPropertyTypeId;

        return filters;
      },
    ));
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'name',
      order: OrderEnum.desc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<ReportModel> {

    return selectDataReports;
  }
}
