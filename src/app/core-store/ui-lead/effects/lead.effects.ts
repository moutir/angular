import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { BrowserService } from '../../../core/shared/browser/browser.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { RuntimeEventError } from '../../ui-runtime/actions/runtime-event-error';
import { LeadEventLoadSubsource } from '../actions/lead-event-load-subsource';
import { LeadEventSendEmail } from '../actions/lead-event-send-email';
import { LeadApiService } from '../../../api/shared/lead/lead-api.service';
import { LeadUpdateSubsourceBySourceId } from '../../data-lead/actions/lead-update-subsource-by-source-id';
import { EntityEventOperation } from '../../ui-entity/actions/entity-event-operation';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { LeadEventModifyStatus } from '../actions/lead-event-modify-status';

@Injectable()
export class LeadEffects {

  /**
   * Constructor
   */
  constructor(
    private actions$: Actions,
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
    private leadApiService: LeadApiService,
  ) {

  }

  /**
   * Redirect to email creation URL
   *
   * @action LeadEventSendEmail
   */
  LeadEventSendEmail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LeadEventSendEmail>(LeadEventSendEmail.TYPE),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectFeature(),
    )),
    switchMap(([action, feature]) => {

      const leadId: string[] = [];
      const recipientId: string[] = [];
      const propertyId: string[] = [];

      action.payload.leads
        .forEach(lead => {

          if (leadId.indexOf(lead.id) === -1) {

            leadId.push(lead.id);
          }

          if (recipientId.indexOf(lead.contact.id) === -1) {

            recipientId.push(lead.contact.id);
          }

          if (propertyId.indexOf(lead.getProperty().id) === -1) {

            propertyId.push(lead.getProperty().id);
          }
        });

      const baseUrl = feature.emailing === true ? '/emailing' : '/emailing/emailCreation';
      const params = []
        .concat(
          leadId.map(id => 'lead_id[]=' + id),
          recipientId.map(id => 'recipient_id[]=' + id),
          propertyId.map(id => 'property_id[]=' + id),
        )
        .join('&');

      this.browserService.blank(baseUrl + '?' + params);

      return [];
    }),
  ));

  /**
   * Perform API call to load lead sub source
   *
   * @action LeadEventLoadSubsource
   */
  LeadEventLoadSubsource$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LeadEventLoadSubsource>(LeadEventLoadSubsource.TYPE),
    switchMap(action => {

      // Lead source not set
      if (!action.payload.sourceId) {

        return [];
      }

      // API call
      return this
        .leadApiService
        .subSources(<string>action.payload.sourceId)
        .pipe(

          // Success
          switchMap(subsources => [

            // Update leads by source ID
            new LeadUpdateSubsourceBySourceId({
              sourceId: action.payload.sourceId,
              subSources: subsources,
            }),
          ]),

          // Error
          catchError(error => [

            // Broadcast error
            new RuntimeEventError({ id: '18', error: error }),
          ]),
        );
    }),
  ));

  /**
   * Perform API call to modify status of leads
   *
   * @action LeadEventModifyStatus
   */
  LeadEventModifyStatus$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<LeadEventModifyStatus>(LeadEventModifyStatus.TYPE),
    map(action => new EntityEventOperation({
      entity: EntityEnum.lead,
      ids: action.payload.modifyStatus.leadIds,
      message: 'notification_lead_modify_status',
      operation: 'modify-status',
      apiCall: () => this.leadApiService.modifyStatus(action.payload.modifyStatus),
    })),
  ));
}
