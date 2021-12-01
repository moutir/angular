import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-searchlist/effects.abstract';
import { ContactUpdateTransfer } from '../actions/contact-update-transfer';
import { SearchlistEventOperation } from '../../ui-searchlist/actions/searchlist-event-operation';
import { OperationEnum } from '../../../shared/enum/operation.enum';
import { ContactUpsert } from '../../data-contact/actions/contact-upsert';
import { ContactModel } from '../../../shared/model/contact.model';
import { ContactSearchlistService } from '../../../core/shared/contact/contact-searchlist.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContactUpdateModifyBroker } from '../actions/contact-update-modify-broker';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { ContactSearchOptionsInterface } from '../../../shared/interface/contact-search-options.interface';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { ContactUpdateTransferActivity } from '../actions/contact-update-transfer-activity';
import { PermissionEnum } from '../../../shared/enum/permission.enum';
import { SearchlistEventSubmit } from '../../ui-searchlist/actions/searchlist-event-submit';
import { NotificationTypeEnum } from '../../../shared/enum/notification-type.enum';
import { CircleEnum } from '../../../shared/enum/circle.enum';

@Injectable()
export class SearchlistEffects extends EffectsAbstract<
  ContactModel,
  ContactSearchModel,
  ContactSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected modelService: ContactService,
    protected searchlistService: ContactSearchlistService,
  ) {

    super(actions$, runtimeService, modelService, searchlistService);
  }

  /**
   * Update transfer when starting "contact transfer broker" operation
   *
   * @action SearchlistEventOperation (action.payload.operation === OperationEnum.contactTransferBroker)
   */
  SearchlistEventOperationTransfer$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.operation && action.payload.operation === OperationEnum.contactTransferBroker),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
    )),
    map(([action, selection]) => new ContactUpdateTransfer({
      transfer: {
        agencyId: '',
        brokerId: '',
        contactIds: action.payload.ids ? action.payload.ids : selection.ids, // Selected contacts
      },
    })),
  ));

  /**
   * Update modify broker when starting "contact modify broker" operation
   *
   * @action SearchlistEventOperation (action.payload.operation === OperationEnum.contactModifyBroker)
   */
  SearchlistEventOperationModifyBroker$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.operation && action.payload.operation === OperationEnum.contactModifyBroker),
    switchMap(action => zip(
      of(action),
      this.searchlistService.selectSelection(action.payload.uid),
    )),
    map(([action, selection]) => new ContactUpdateModifyBroker({
      modifyBroker: {
        brokerId: '',
        rentalBrokerId: '',
        saleBrokerId: '',
        searchManagerId: '',
        specificContactId: '',
        contactIds: action.payload.ids ? action.payload.ids : selection.ids, // Selected contacts
      },
    })),
  ));

  /**
   * Update transfer activity when starting "contact transfer activity" operation
   *
   * @action SearchlistEventOperation (action.payload.operation === OperationEnum.contactTransferActivity)
   */
  SearchlistEventOperationActivity$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventOperation>(SearchlistEventOperation.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    filter(action => action.payload.operation && action.payload.operation === OperationEnum.contactTransferActivity),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectPermissions(),
      this.searchlistService.selectFilters(action.payload.uid),
      this.searchlistService.selectSelection(action.payload.uid),
    )),
    map(([action, permissions, filters, selection]) => new ContactUpdateTransferActivity({
      transferActivity: {
        brokerId: '',
        isAllowedArchive: permissions.indexOf(PermissionEnum.contactDelete) > -1 && filters.isArchive01 === '0',
        isAgreed: false,
        isActiveArchive: false,
        contactId: action.payload.ids ? action.payload.ids[0] : selection.ids[0], // Selected contact
      },
    })),
  ));

  /**
   * Updated form
   *
   * @action SearchlistUpdateForm
   */
  SearchlistUpdateForm$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<SearchlistEventSubmit>(SearchlistEventSubmit.TYPE),
    filter(action => this.filterEntity(action.payload.uid)),
    switchMap(action => {

      const circle = (<ContactSearchModel>action.payload.filters).circle || '';
      const keyword = (<ContactSearchModel>action.payload.filters).contactTextSearch || '';

      // MLS circle search by keyword (not a reference)
      if (circle === CircleEnum.mlsAgency && keyword.indexOf('#') !== 0) {

        // Notification
        this.runtimeService.notification(NotificationTypeEnum.info, 'mls_no_keyword_search');
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(models: ContactModel[]): ContactUpsert {

    return new ContactUpsert({
      models: models,
    });
  }
}
