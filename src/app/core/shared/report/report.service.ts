import { Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Dictionary } from 'app/shared/class/dictionary';

import { StateInterface } from '../../../core-store/state.interface';
import { ReportModel } from '../../../shared/model/report.model';
import { TrackingActionEnum } from '../../../shared/enum/tracking-action.enum';
import { TrackerService } from '../tracker/tracker.service';
import { ReportEventSendEmail } from '../../../core-store/ui-report/actions/report-event-send-email';
import { PositionInterface } from '../../../shared/interface/position.interface';
import { ReportUpdateBrochureMenu } from '../../../core-store/ui-report/actions/report-update-brochure-menu';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { BrowserService } from '../browser/browser.service';
import { HelperService } from '../helper.service';
import { selectDataReport, selectDataReports } from '../../../core-store/data-report/selectors';
import { ReportSendEmailInterface } from '../../../shared/interface/report-send-email.interface';
import { ReportTypeEnum } from '../../../shared/enum/report-type.enum';
import { RuntimeAuthenticationInterface } from '../../../shared/interface/runtime-authentication.interface';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ReportApiService } from '../../../api/shared/report/report-api.service';
import { ReportSearchModel } from '../../../shared/model/report-search.model';
import { ReportUpdateGeneration } from '../../../core-store/ui-report/actions/report-update-generation';
import { ReportGenerationInterface } from '../../../shared/interface/report-generation.interface';
import { ReportGenerationOptionsInterface } from '../../../shared/interface/report-generation-options.interface';
import { ReportEventGenerate } from '../../../core-store/ui-report/actions/report-event-generate';
import { initialState } from '../../../core-store/ui-report/state';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ReportGenerationModel } from '../../../shared/model/report-generation.model';
import { ReportEventChangeGenerationInput } from '../../../core-store/ui-report/actions/report-event-change-generation-input';
import {
  selectUiGeneration,
  selectUiGenerationOptions,
  selectUiGenerationReport,
  selectUiSendEmail,
} from '../../../core-store/ui-report/selectors';
import { ReportActionEnum } from '../../../shared/enum/report-action.enum';
import { selectDataAuthentication, selectDataPermissions } from '../../../core-store/data-runtime/selectors';
import { ReportEventGenerationOpen } from '../../../core-store/ui-report/actions/report-event-generation-open';

@Injectable()
export class ReportService extends ModelServiceAbstract<ReportModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private browserService: BrowserService,
    private trackerService: TrackerService,
    private helperService: HelperService,
    private reportApiService: ReportApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): ReportModel {

    return new ReportModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ReportSearchModel,
  ): Observable<ModelListInterface<ReportModel>> {

    return this.reportApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: ReportSearchModel): Observable<string[]> {

    return of([]);
  }

  /**
   * Select report by id
   */
  selectReport(id: string): Observable<ReportModel> {

    return this.store$.select(selectDataReport(id));
  }

  /**
   * Returns the report generation state
   */
  selectGeneration(): Observable<ReportGenerationInterface> {

    return this.store$.select(selectUiGeneration);
  }

  /**
   * Returns the report generation options state
   */
  selectGenerationOptions(): Observable<ReportGenerationOptionsInterface> {

    return this.store$.select(selectUiGenerationOptions);
  }

  /**
   * Returns the report for generaion
   */
  selectGenerationReport(): Observable<ReportModel> {

    return this.store$.select(selectUiGenerationReport);
  }

  /**
   * Returns data reports
   */
  selectDataReports(): Observable<Dictionary<ReportModel>> {

    return this.store$.select(selectDataReports);
  }

  /**
   * Select send email
   */
  selectSendEmail(): Observable<ReportSendEmailInterface> {

    return this.store$.select(selectUiSendEmail);
  }

  /**
   * Returns if generation update permission available
   */
  selectHasGenerationUpdate(): Observable<boolean> {

    return this.store$.select(createSelector(
      selectUiGeneration,
      selectUiGenerationReport,
      selectDataPermissions,
      selectDataAuthentication,
      (
        generation: ReportGenerationInterface,
        report: ReportModel,
        permissions: PermissionEnum[],
        authentication: RuntimeAuthenticationInterface,
      ): boolean => {

        return this.hasPermissionUpdate(
          generation.reportType,
          report,
          permissions,
          authentication,
        );
      },
    ));
  }

  /**
   * Has permission to update?
   */
  hasPermissionUpdate(
    reportType: ReportTypeEnum,
    report: ReportModel,
    permissions: PermissionEnum[],
    authentication: RuntimeAuthenticationInterface,
  ): boolean {

    /**
     * Manager permission OR
     * Current user ID equals scheduler sender id OR
     * Current user ID equals owner broker id OR
     * Current user ID equals property broker id
     */
    if (reportType === ReportTypeEnum.owner) {

      return permissions.indexOf(PermissionEnum.reportingManager) > -1 ||
        (report.generation && authentication.contactId === report.generation.reportSenderContactId) ||
        authentication.contactId === report.clientBrokerId ||
        (report.property && authentication.contactId === report.property.broker.id)
      ;
    }

    /**
     * Manager permission OR
     * Current user ID equals promotion broker id
     */
    if (reportType === ReportTypeEnum.developer) {

      return permissions.indexOf(PermissionEnum.reportingManager) > -1 ||
        (report.promotion && authentication.contactId === report.promotion.broker.id)
      ;
    }

    /**
     * Manager permission OR
     * Current user ID equals client broker id
     */
    return permissions.indexOf(PermissionEnum.reportingManager) > -1 ||
      authentication.contactId === report.clientBrokerId
    ;
  }

  /**
   * Reply to report contacts by email
   */
  sendEmail(send: ReportSendEmailInterface): void {

    if (!send.isMassAction) {

      // Stats
      this.trackerService.track(TrackingActionEnum.reportRowEmail);
    }

    this.store$.dispatch(
      new ReportEventSendEmail({ sendEmail: send }),
    );
  }

  /**
   * Display brochures menu at the given position
   */
  openBrochureMenu(id: string, position: PositionInterface): void {

    this.store$.dispatch(
      new ReportUpdateBrochureMenu({
        brochureMenu: {
          reportId: id,
          position: position,
        },
      }),
    );
  }

  /**
   * Open report generation modal for @reportId
   */
  openModalGeneration(
    action: ReportActionEnum,
    reportId: string,
    reportType: ReportTypeEnum,
    reportDateFrom: Date,
    reportDateTo: Date,
    brochureType: string,
    language: LanguageEnum,
  ): void {

    this.store$.dispatch(
      new ReportEventGenerationOpen({
        action,
        reportId,
        reportType,
        reportDateFrom,
        reportDateTo,
        brochureType,
        language,
      }),
    );
  }

  /**
   * Close report generation modal
   */
  closeModalGeneration(): void {

    this.store$.dispatch(
      new ReportUpdateGeneration({
        generation: initialState.generation,
      }),
    );
  }

  /**
   * Generate report
   */
  generate(generation: ReportGenerationInterface): void {

    this.store$.dispatch(
      new ReportEventGenerate({ generation }),
    );
  }

  /**
   * Change report generation input
   */
  changeGenerationInput(model: ReportGenerationModel, input: InputFormInterface): void {

    this.store$.dispatch(
      new ReportEventChangeGenerationInput({
        model,
        input,
      }),
    );
  }

  /**
   * Open brochure for the @reportId
   */
  brochure(
    reportId: string,
    dateFrom: Date,
    dateTo: Date,
    brochureType: string,
    language: LanguageEnum,
  ): void {

    const baseUrl = 'reporting/brochure/' + reportId;
    const params = [
      'type=' + brochureType,
      'from=' + this.helperService.dateToString(dateFrom),
      'to=' + this.helperService.dateToString(dateTo),
      'lang=' + language,
    ].join('&');

    // Open brochure in _blank
    this.browserService.blank(baseUrl + '?' + params);
  }
}
