import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { ReportApiService } from '../../../api/shared/report/report-api.service';
import { ReportEventSendEmail } from '../actions/report-event-send-email';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { RuntimeUpdateContextual } from '../../ui-runtime/actions/runtime-update-contextual';
import { ReportUpdateBrochureMenu } from '../actions/report-update-brochure-menu';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { ReportUpdateGeneration } from '../actions/report-update-generation';
import { ReportEventGenerate } from '../actions/report-event-generate';
import { initialState } from '../state';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { ReportEventChangeGenerationInput } from '../actions/report-event-change-generation-input';
import { HelperService } from '../../../core/shared/helper.service';
import { ReportActionEnum } from '../../../shared/enum/report-action.enum';
import { ReportEventGenerationOpen } from '../actions/report-event-generation-open';
import { ReportModel } from '../../../shared/model/report.model';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { ReportTypeEnum } from '../../../shared/enum/report-type.enum';
import { ReportUpdateSendEmail } from '../actions/report-update-send-email';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ReportService } from '../../../core/shared/report/report.service';

@Injectable()
export class ReportEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private browserService: BrowserService,
    private reportApiService: ReportApiService,
    private reportService: ReportService,
    private helperService: HelperService,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Redirect to email creation URL
   *
   * @action ReportEventSendEmail
   */
  ReportEventSendEmail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventSendEmail>(ReportEventSendEmail.TYPE),
    filter(action => action.payload.sendEmail.isMassAction === false),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      const propertyId: string[] = [];
      const promotionId: string[] = [];
      const recipientId: string[] = [];

      action.payload.sendEmail.reports
        .forEach(report => {

          if (report.property.id && propertyId.indexOf(report.property.id) === -1) {

            propertyId.push(report.property.id);
          }

          if (report.promotion.id && promotionId.indexOf(report.promotion.id) === -1) {

            promotionId.push(report.promotion.id);
          }

          if (report.contact.id && recipientId.indexOf(report.contact.id) === -1) {

            recipientId.push(report.contact.id);
          }
        });

      const baseUrl = feature.emailing === true ? '/emailing' : '/emailing/emailCreation';
      const params = []
        .concat(
          propertyId.map(id => 'property_id[]=' + id),
          promotionId.map(id => 'promo_id[]=' + id),
          recipientId.map(id => 'recipient_id[]=' + id),
        )
        .join('&');

      this.browserService.blank(baseUrl + '?' + params);

      return [];
    }),
  ));

  /**
   * Open report generation modal
   *
   * @action ReportEventSend send.type === ReportTypeEnum.owner
   */
  ReportEventSendEmailOwnerMass$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventSendEmail>(ReportEventSendEmail.TYPE),
    filter(action => action.payload.sendEmail.isMassAction === true && action.payload.sendEmail.type === ReportTypeEnum.owner),
    switchMap(action => zip(of(action), this.runtimeService.selectCurrentLanguageId())),
    switchMap(([action, language]) => {

      return [
        new ReportEventGenerationOpen({
          action: ReportActionEnum.send,
          reportId: '',
          reportType: action.payload.sendEmail.type,
          reportDateFrom: action.payload.sendEmail.dateFrom,
          reportDateTo: action.payload.sendEmail.dateTo,
          brochureType: 'report_landlord',
          language,
        }),

        new ReportUpdateSendEmail({
          sendEmail: {
            reports: action.payload.sendEmail.reports,
            language,
            type: ReportTypeEnum.owner,
            dateFrom: action.payload.sendEmail.dateFrom,
            dateTo: action.payload.sendEmail.dateTo,
            isMassAction: true,
          },
        }),
      ];
    }),
  ));

  /**
   * Perform API call to send reports
   *
   * @action ReportEventSend sendEmail.type !== ReportTypeEnum.owner
   */
  ReportEventSendEmailOtherMass$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventSendEmail>(ReportEventSendEmail.TYPE),
    filter(action => action.payload.sendEmail.isMassAction === true && action.payload.sendEmail.type !== ReportTypeEnum.owner),
    switchMap(action => zip(of(action), this.runtimeService.selectCurrentLanguageId())),
    map(([action, language]) => new EntityEventOperation({
      entity: EntityEnum.report,
      ids: action.payload.sendEmail.reports.map(r => r.id),
      message: 'notification_report_send_email',
      operation: 'send-email',
      apiCall: () => this.reportApiService.sendEmail({ ...action.payload.sendEmail, language }),
    })),
  ));

  /**
   * Display brochure menu when requesting it
   *
   * @action ReportUpdateBrochureMenu
   */
  ReportUpdateBrochureMenu$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportUpdateBrochureMenu>(ReportUpdateBrochureMenu.TYPE),
    map(action => new RuntimeUpdateContextual({
      contextual: {
        uid: 'report-brochure-menu',
        position: action.payload.brochureMenu.position,
      },
    })),
  ));

  /**
   * Perform API call to fetch report configuration and open modal
   *
   * @action ReportEventGenerationOpen
   */
  ReportEventGenerationOpen$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventGenerationOpen>(ReportEventGenerationOpen.TYPE),
    switchMap(action => zip(of(action), this.reportService.selectDataReports())),
    switchMap(([action, reports]) => {

      const report = reports[action.payload.reportId] || new ReportModel();

      const newGeneration = {
        ...initialState.generation,
        action: action.payload.action,
        reportId: action.payload.reportId,
        reportType: action.payload.reportType,
        reportDateFrom: action.payload.reportDateFrom,
        reportDateTo: action.payload.reportDateTo,
        brochureType: action.payload.brochureType,
        language: action.payload.language,
        propertyId: report.property.id || '',
        contactId: report.contact.id || '',
      };

      return concat(

        // Set as loading
        of(new ReportUpdateGeneration({
          generation: {
            ...initialState.generation,
            action: action.payload.action,
            reportId: action.payload.reportId,
            reportType: action.payload.reportType,
            step: 1,
            isLoading: true,
          },
        })),

        // API call
        this
          .reportApiService
          .configuration(action.payload.reportType)
          .pipe(

            // Success
            switchMap(model => {

              if (model === null) {

                return [

                  // Set as loading finished
                  new ReportUpdateGeneration({
                    generation: {
                      ...newGeneration,
                      step: 2,
                      isLoading: false,
                    },
                  }),
                ];
              }

              // If scheduler enabled it's report's generation data, else broker configuration
              newGeneration.model = (action.payload.action === ReportActionEnum.schedule &&
                report.generation.isSchedulerEnabled === true) ? report.generation : model;

              return [

                // Update report generation
                new ReportUpdateGeneration({
                  generation: {
                    ...newGeneration,
                    step: 2,
                    isLoading: false,
                  },
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Broadcast error
              new RuntimeEventError({ id: '33', error: error }),

              // Update report generation
              new ReportUpdateGeneration({
                generation: {
                  ...newGeneration,
                  step: 2,
                  isLoading: false,
                },
              }),
            ]),
          ),
        );
    })),
  );

  /**
   * Update generation model on change event
   *
   * @action ReportEventChangeGenerationInput
   */
  ReportEventChangeGenerationInput$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventChangeGenerationInput>(ReportEventChangeGenerationInput.TYPE),
    switchMap(action => zip(of(action), this.reportService.selectGeneration())),
    map(([action, generation]) => new ReportUpdateGeneration({
      generation: {
        ...generation,
        model: action.payload.model,
      }}),
    )),
  );

  /**
   * Redirect to owner report generation URL
   *
   * @action ReportEventGenerate action === ReportActionEnum.download
   */
  ReportEventGenerateDownload$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventGenerate>(ReportEventGenerate.TYPE),
    filter(action => action.payload.generation.action === ReportActionEnum.download),
    switchMap(action => {

      const generation = action.payload.generation;
      const baseUrl = '/reporting/brochure/' + generation.reportId;
      const dateFrom = generation.reportDateFrom ? this.helperService.dateToString(generation.reportDateFrom) : '';
      const dateTo = generation.reportDateTo ? this.helperService.dateToString(generation.reportDateTo) : '';
      const params = [
        'type=' + generation.brochureType,
        'from=' + dateFrom,
        'to=' + dateTo,
        'lang=' + generation.language,
        'informations=' + generation.model.informations,
        'broker=' + generation.model.broker,
        'price=' + generation.model.price,
        'leads=' + generation.model.leads,
        'time=' + generation.model.time,
        'sending=' + generation.model.sending,
        'past_visits=' + generation.model.pastVisits,
        'next_visits=' + generation.model.nextVisits,
        'marketing_expenses=' + generation.model.marketingExpenses,
        'summary=' + generation.model.summary,
        'offers=' + generation.model.offers,
        'communications=' + generation.model.communications,
        'hide_intermediary_task=' + (generation.model.isHideIntermediaryTask ? '1' : '0'),
      ].join('&');

      this.browserService.blank(baseUrl + '?' + params);

      return [

        // Back to step 0
        new ReportUpdateGeneration({
          generation: initialState.generation,
        }),
      ];
    }),
  ));

  /**
   * Perform API call to schedule report
   *
   * @action ReportEventGenerate action === ReportActionEnum.schedule
   */
  ReportEventGenerateSchedule$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventGenerate>(ReportEventGenerate.TYPE),
    filter(action => action.payload.generation.action === ReportActionEnum.schedule),
    switchMap(action => {

      return concat(

        // Notification
        of(new RuntimeEventNotification({
          type: NotificationTypeEnum.info,
          message: 'notification_report_schedule_wait',
        })),

        // Set as loading
        of(new ReportUpdateGeneration({
          generation: {
            ...action.payload.generation,
            isLoading: true,
          },
        })),

        // API call
        this
          .reportApiService
          .schedule(action.payload.generation)
          .pipe(

            // Success
            switchMap(response => {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: 'notification_report_schedule_success',
                }),

                // Update report list
                new EntityEventChanged({
                  entity: EntityEnum.report,
                  ids: [action.payload.generation.reportId],
                }),

                // Reset and close generation modal
                new ReportUpdateGeneration({
                  generation: {
                    ...initialState.generation,
                  },
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '34', error: error }),

              // Set as not loading
              new ReportUpdateGeneration({
                generation: {
                  ...action.payload.generation,
                  isLoading: false,
                },
              }),
            ]),
          ),
        );
    }),
  ));

  /**
   * Perform API call to send report
   *
   * @action ReportEventGenerate action === ReportActionEnum.send
   */
  ReportEventGenerateSend$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ReportEventGenerate>(ReportEventGenerate.TYPE),
    filter(action => action.payload.generation.action === ReportActionEnum.send),
    switchMap(action => zip(of(action), this.reportService.selectSendEmail())),
    switchMap(([action, sendEmail]) => {

      return concat(

        // Notification
        of(new RuntimeEventNotification({
          type: NotificationTypeEnum.info,
          message: sendEmail.reports.length > 1 ?
          'notification_report_send_email_wait_plural' : 'notification_report_send_email_wait_singular',
        })),

        // Set as loading
        of(new ReportUpdateGeneration({
          generation: {
            ...action.payload.generation,
            isLoading: true,
          },
        })),

        // API call
        this
          .reportApiService
          .sendEmail(sendEmail, action.payload.generation)
          .pipe(

            // Success
            switchMap(response => {

              if (response.success === false) {

                return [

                  // Notification
                  new RuntimeEventNotification({
                    type: NotificationTypeEnum.failure,
                    message: 'notification_rollback',
                  }),

                  // Set as not loading
                  new ReportUpdateGeneration({
                    generation: {
                      ...action.payload.generation,
                      isLoading: false,
                    },
                  }),
                ];
              }

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.success,
                  message: sendEmail.reports.length > 1 ?
                  'notification_report_send_email_plural' : 'notification_report_send_email_singular',
                }),

                // Reset and close generation modal
                new ReportUpdateGeneration({
                  generation: {
                    ...initialState.generation,
                  },
                }),
              ];
            }),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '35', error: error }),

              // Set as not loading
              new ReportUpdateGeneration({
                generation: {
                  ...action.payload.generation,
                  isLoading: false,
                },
              }),
            ]),
          ),
        );
    }),
  ));
}
