import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of, zip } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { EmailingPageService } from '../../../core/shared/emailing/emailing-page.service';
import { EmailingService } from '../../../core/shared/emailing/emailing.service';
import { EmailingEventSearchEntity } from '../actions/emailing-event-search-entity';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { RuntimeEventNotification } from '../../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { PageUpdateAction } from '../../ui-page/actions/page-update-action';
import { PageActionEnum } from '../../../shared/enum/page-action.enum';
import { EmailingEventSend } from '../actions/emailing-event-send';
import { ConfirmService } from '../../../core/shared/confirm.service';
import { EmailingEventEntitiesFromRoute } from '../actions/emailing-event-entities-from-route';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EmailingEventLoadDocuments } from '../actions/emailing-event-load-documents';
import { EmailingEventLoadConfiguration } from '../actions/emailing-event-load-configuration';
import { EmailingEventChangeConfiguration } from '../actions/emailing-event-change-configuration';
import { EmailingUpdateSummaries } from '../actions/emailing-update-summaries';
import { EmailingEventLoadPreview } from '../actions/emailing-event-load-preview';
import { EmailingUpdatePreview } from '../actions/emailing-update-preview';

@Injectable()
export class EmailingEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    protected emailingService: EmailingService,
    private pageService: EmailingPageService,
    private confirmService: ConfirmService,
    private translateService: TranslateService,
    private runtimeService: RuntimeService,
    private modelService: EmailingService,
  ) {

  }

  /**
   * Perform API call to load emailing configuration
   *
   * @action EmailingEventLoadConfiguration
   */
  EmailingEventLoadConfiguration$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventLoadConfiguration>(EmailingEventLoadConfiguration.TYPE),
    switchMap(action => {

      const params = action.payload.queryParams;
      const leadIds = (params['lead_id[]'] || '').toString().split(',').filter(s => !!s);
      const replyTo = params['in_reply_to'] || '';
      const replyMode = params['reply_mode'] || '';

      return concat(

        // Update page action
        of(new PageUpdateAction({
          action: PageActionEnum.loading,
        })),

        // Load entities from route
        of(new EmailingEventEntitiesFromRoute({
          queryParams: action.payload.queryParams,
        })),

        this
          .modelService
          .configuration(leadIds, replyTo, replyMode)
          .pipe(

            // Success
            switchMap(configuration => [

              // Change configuration
              new EmailingEventChangeConfiguration({ configuration: configuration }),

              // Update page action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),
            ]),

            // Error
            catchError(error => [

              // Broadcast error
              new RuntimeEventError({ id: '57', error: error }),

              // Update page action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),
            ]),
          ),
        );
    }),
  ));

  /**
   * Perform API call to fetch entities from route
   *
   * @action EmailingEventEntitiesFromRoute
   */
  EmailingEventEntitiesFromRoute$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventEntitiesFromRoute>(EmailingEventEntitiesFromRoute.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectAuthentication(),
    )),
    switchMap(([action, authentication]) => {

      const params = action.payload.queryParams;
      const actions: Array<Observable<Action>> = [];
      const contactIds = (params['recipient_id[]'] || '').toString().split(',').filter(id => !!id && id !== 'null');
      const propertyIds = (params['property_id[]'] || '').toString().split(',').filter(id => !!id && id !== 'null');
      const promotionIds = (params['promo_id[]'] || '').toString().split(',').filter(id => !!id && id !== 'null');

      // Contacts
      if (contactIds.length > 0 && contactIds[0] !== '') {

        const contactFilters = new ContactSearchModel();
        contactFilters.contactIds = contactIds;

        actions.push(of(
          new EmailingEventSearchEntity({
            entity: EntityEnum.contact,
            uid: 'recipients',
            pagination: { page: 1, perPage: 500 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: contactFilters,
          })),
        );
      }

      // Properties
      if (propertyIds.length > 0 && propertyIds[0] !== '') {

        const propertyFilters = new PropertySearchModel();
        propertyFilters.ids = propertyIds;

        actions.push(of(
          new EmailingEventSearchEntity({
            entity: EntityEnum.property,
            uid: 'properties',
            pagination: { page: 1, perPage: 500 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: propertyFilters,
          })),
        );
      }

      // Promotions
      if (promotionIds.length > 0 && promotionIds[0] !== '') {

        const promotionFilters = new PromotionSearchModel();
        promotionFilters.promotionIds = promotionIds;

        actions.push(of(
          new EmailingEventSearchEntity({
            entity: EntityEnum.promotion,
            uid: 'promotions',
            pagination: { page: 1, perPage: 500 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: promotionFilters,
          })),
        );
      }

      // Load documents
      actions.push(of(
        new EmailingEventLoadDocuments({
          agencyId: authentication.agencyId,
          contactIds: contactIds,
          propertyIds: propertyIds,
          promotionIds: promotionIds,
        }),
      ));

      return concat( ...actions );
    }),
  ));

  /**
   * Perform API call to send email model
   *
   * @action EmailingEventSend
   */
  EmailingEventSend$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventSend>(EmailingEventSend.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const contacts = [ ...model.recipients, ...model.recipientsCC ];

      return zip(
        of(action),
        of(model),
        this.confirmService.message(
          contacts.length > 1 ?
          this.translateService.instant('label_confirm_send_mail_plural', { count: contacts.length }) :
          'label_confirm_send_mail_singular',
        ),
      );
    }),
    switchMap(([action, model, isValid]) => {

      if (isValid === false) {

        return [];
      }

      return concat(

        // Update page action
        of(new PageUpdateAction({
          action: PageActionEnum.loading,
        })),

        this
          .modelService
          .send(model)
          .pipe(

            // Success
            switchMap(summaries => [

              // Update page action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),

              // Update summaries
              new EmailingUpdateSummaries({ summaries: summaries }),
            ]),

            // Error
            catchError(apiError => [

              // Update page action
              new PageUpdateAction({
                action: PageActionEnum.none,
              }),

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '51', error: apiError }),
            ]),
          ),
      );
    }),
  ));

  /**
   * Perform API call to load email previews for each contact language
   *
   * @action EmailingEventLoadPreview
   */
  EmailingEventLoadPreview$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EmailingEventLoadPreview>(EmailingEventLoadPreview.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      return concat(

        // Update preview
        of(
          new EmailingUpdatePreview({
            preview: {
              isOpen: true,
              data: {},
            },
          }),
        ),

        this
          .emailingService
          .loadPreviews(model)
          .pipe(

            // Success
            switchMap(previews => {

              return [

                // Update preview
                new EmailingUpdatePreview({
                  preview: {
                    isOpen: true,
                    data: previews,
                  },
                }),
              ];
            }),

            // Error
            catchError(apiError => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '60', error: apiError }),
            ]),
          ),
        );
    }),
  ));
}
