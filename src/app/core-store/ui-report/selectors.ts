import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { FEATURE_NAME, UiReportStateInterface } from './state';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { StateInterface } from '../state.interface';
import { ReportBrochureMenuInterface } from '../../shared/interface/report-brochure-menu.interface';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { selectDataFeatureReport, selectDataLanguageCurrent, selectDataOptions } from '../data-runtime/selectors';
import { ReportSearchModel } from '../../shared/model/report-search.model';
import { selectUiForm } from '../ui-searchlist/selectors';
import { RuntimeFeatureReportInterface } from '../../shared/interface/runtime-feature-report.interface';
import { ReportGenerationInterface } from '../../shared/interface/report-generation.interface';
import { ReportGenerationOptionsInterface } from '../../shared/interface/report-generation-options.interface';
import { ReportModel } from '../../shared/model/report.model';
import { selectDataReports } from '../data-report/selectors';
import { ReportSendEmailInterface } from '../../shared/interface/report-send-email.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiReportStateInterface>
  = createFeatureSelector<UiReportStateInterface>(FEATURE_NAME);

/**
 * Select the brochure menu state
 */
export const selectUiBrochureMenu: MemoizedSelector<StateInterface, ReportBrochureMenuInterface> = createSelector(
  selectUiState,
  (state: UiReportStateInterface): ReportBrochureMenuInterface => state.brochureMenu,
);

/**
 * Select the report for generation
 */
export const selectUiGenerationReport: MemoizedSelector<StateInterface, ReportModel> = createSelector(
  selectUiState,
  selectDataReports,
  (
    state: UiReportStateInterface,
    reports: Dictionary<ReportModel>,
  ): ReportModel => reports[state.generation.reportId] || new ReportModel(),
);

/**
 * Select the report generation state
 */
export const selectUiGeneration: MemoizedSelector<StateInterface, ReportGenerationInterface> = createSelector(
  selectUiState,
  (state: UiReportStateInterface): ReportGenerationInterface => state.generation);

/**
 * Select the report generation options state
 */
export const selectUiGenerationOptions: MemoizedSelector<StateInterface, ReportGenerationOptionsInterface> = createSelector(
  selectDataOptions,
  (options: RuntimeOptionsInterface): ReportGenerationOptionsInterface => {

    return {
      hasBroker: options.hasBroker,
      hasInformation: options.hasInformation,
      hasPrice: options.hasPrice,
      hasLead: options.hasLead,
      hasSummary: options.hasSummary,
      hasMarketingExpense: options.hasMarketingExpense,
      hasTimeEvolution: options.hasTimeEvolution,
      hasOffer: options.hasOffer,
      hasProposition: options.hasProposition,
      hasPastVisit: options.hasPastVisit,
      hasPlannedVisit: options.hasPlannedVisit,
      hasCommunication: options.hasCommunication,
      frequency: options.frequency,
      dateRange: options.dateRange,
    };
  },
);

/**
 * Select the report send email state
 */
export const selectUiSendEmail: MemoizedSelector<StateInterface, ReportSendEmailInterface> = createSelector(
  selectUiState,
  (state: UiReportStateInterface): ReportSendEmailInterface => state.sendEmail);

/**
 * Select the brochure menu items
 */
export const selectUiBrochureMenuItems = (uid: string): MemoizedSelector<StateInterface, MenuInterface> => createSelector(
  selectUiForm(uid),
  selectUiBrochureMenu,
  selectDataLanguageCurrent,
  selectDataOptions,
  selectDataFeatureReport,
  (
    form: ReportSearchModel,
    brochureMenu: ReportBrochureMenuInterface,
    currentLanguage: string,
    options: RuntimeOptionsInterface,
    featureReport: RuntimeFeatureReportInterface,
  ): MenuInterface => {

    const label = '{type}';
    const menu: MenuInterface = {
      items: [],
    };
    const brochureTypes = {
      'owner': options.reportOwnerBrochureType,
      'buyer': options.reportOtherBrochureType,
      'tenant': options.reportOtherBrochureType,
      'intermediary': options.reportOtherBrochureType,
      'developer': options.reportDeveloperBrochureType,
    };

    // For each brochure type
    brochureTypes[form.reportType].forEach(brochureType => {

      // Main link to default language brochure
      const menuItem: MenuItemInterface = {
        id: JSON.stringify({
          reportId: brochureMenu.reportId,
          reportType: form.reportType,
          reportDateFrom: form.dateFrom,
          reportDateTo: form.dateTo,
          brochureType: brochureType.value,
          language: currentLanguage,
        }),
        label: label.replace('{type}', brochureType.text),
        icon: '',
        tooltip: '',
        isEnabled: true,
        items: [],
      };

      // No sub menus for report schedule menu item
      if (brochureType.value === 'report_schedule') {

        // Scheduler not available for the user
        if (featureReport.isSchedulerEnabled  === false) {

          return;
        }

        // Add menu item
        menu.items.push(menuItem);

        return;
      }

      // For each language
      options.languageCommunication.forEach(language => {

          // Add menu child
          menuItem.items.push({
            id: JSON.stringify({
              reportId: brochureMenu.reportId,
              reportType: form.reportType,
              reportDateFrom: form.dateFrom,
              reportDateTo: form.dateTo,
              brochureType: brochureType.value,
              language: language.value,
            }),
            label: label.replace('{type}', brochureType.text),
            icon: 'flag-' + language.value,
            tooltip: '',
            isEnabled: true,
            items: [],
          });
      });

      // Add menu item
      menu.items.push(menuItem);
    });

    return menu;
  },
);
