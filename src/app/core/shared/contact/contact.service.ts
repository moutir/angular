import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import {
  selectUiBasketContactIds,
  selectUiBrokerOptions,
  selectUiModifyBroker,
  selectUiModifyBrokerOptions,
  selectUiPreviewContact,
  selectUiTransfer,
  selectUiTransferActivity,
  selectUiTransferActivityOptions,
  selectUiTransferOptions,
} from '../../../core-store/ui-contact/selectors';
import { StateInterface } from '../../../core-store/state.interface';
import { ContactEventPreview } from '../../../core-store/ui-contact/actions/contact-event-preview';
import { ContactModel } from '../../../shared/model/contact.model';
import { PositionInterface } from '../../../shared/interface/position.interface';
import { BrowserService } from '../browser/browser.service';
import { TrackerService } from '../tracker/tracker.service';
import { TrackingActionEnum } from '../../../shared/enum/tracking-action.enum';
import { ContactEventChangeRanking } from '../../../core-store/ui-contact/actions/contact-event-change-ranking';
import { HistoryService } from '../history/history.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { UserModel } from '../../../shared/model/user.model';
import { ContactIoBasketContactIds } from '../../../core-store/ui-contact/actions/contact-io-basket-contact-ids';
import { ContactEventAddBasket } from '../../../core-store/ui-contact/actions/contact-event-add-basket';
import { ContactEventRemoveBasket } from '../../../core-store/ui-contact/actions/contact-event-remove-basket';
import { InputFormInterface } from '../../../shared/interface/input-form.interface';
import { ContactTransferInterface } from '../../../shared/interface/contact-transfer.interface';
import { ContactEventSendEmail } from '../../../core-store/ui-contact/actions/contact-event-send-email';
import { ContactEventArchive } from '../../../core-store/ui-contact/actions/contact-event-archive';
import { ContactEventUnarchive } from '../../../core-store/ui-contact/actions/contact-event-unarchive';
import { ContactEventChangeInputTransfer } from '../../../core-store/ui-contact/actions/contact-event-change-input-transfer';
import { ContactEventTransfer } from '../../../core-store/ui-contact/actions/contact-event-transfer';
import { ContactTransferOptionsInterface } from '../../../shared/interface/contact-transfer-options.interface';
import { ContactModifyBrokerOptionsInterface } from '../../../shared/interface/contact-modify-broker-options.interface';
import { ContactModifyBrokerInterface } from '../../../shared/interface/contact-modify-broker.interface';
import { ContactEventModifyBroker } from '../../../core-store/ui-contact/actions/contact-event-modify-broker';
import { ContactEventExport } from '../../../core-store/ui-contact/actions/contact-event-export';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { selectDataContact, selectDataContacts } from '../../../core-store/data-contact/selectors';
import { ContactTransferActivityInterface } from '../../../shared/interface/contact-transfer-activity.interface';
import { ContactTransferActivityOptionsInterface } from '../../../shared/interface/contact-transfer-activity-options.interface';
import { ContactEventTransferActivity } from '../../../core-store/ui-contact/actions/contact-event-transfer-activity';
import { ContactApiPhalconService } from '../../../api/shared/contact/contact-api-phalcon.service';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { ContactEventSetAvatar } from '../../../core-store/ui-contact/actions/contact-event-set-avatar';
import { ContactEventRemoveAvatar } from '../../../core-store/ui-contact/actions/contact-event-remove-avatar';
import { UploadModel } from '../../../shared/model/upload.model';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { Dictionary } from '../../../shared/class/dictionary';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { BetaEnum } from '../../../shared/enum/beta.enum';
import { OrderEnum } from '../../../shared/enum/order.enum';

@Injectable()
export class ContactService extends ModelServiceAbstract<ContactModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private browserService: BrowserService,
    private trackerService: TrackerService,
    private historyService: HistoryService,
    private contactApiService: ContactApiPhalconService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): ContactModel {

    return new ContactModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): Observable<ModelListInterface<ContactModel>> {

    return this
      .runtimeService
      .selectUserPreference()
      .pipe(
        take(1),
        switchMap(userPreference => {

          if (!!userPreference.beta[BetaEnum.performance] === true) {

            return this.contactApiService.listBetaPerformance(pagination, { id: 'id', order: OrderEnum.desc }, filters);
          }

          return this.contactApiService.list(pagination, sort, filters);
        }),
      );
  }

  /**
   * Search for contacts using the legacy endpoints, regardless of beta user
   */
  listLegacy(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): Observable<ModelListInterface<ContactModel>> {

    return this.contactApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  count(filters: ContactSearchModel): Observable<number> {

    return this.contactApiService.count(filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: ContactSearchModel): Observable<string[]> {

    return this.contactApiService.ids(filters);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<ContactModel> {

    console.error('ContactService.load() not implemented yet.');

    return of(new ContactModel());
  }

  /**
   * Return an observable of contact model's summary
   */
  summary(id: string, hash: string): Observable<ContactModel> {

    return this
      .runtimeService
      .selectUserPreference()
      .pipe(
        take(1),
        switchMap(userPreference => {

          if (!!userPreference.beta[BetaEnum.performance] === true) {

            return this.contactApiService.loadBetaPerformance(id, hash);
          }

          return this.contactApiService.summary(id);
        }),
      );
  }

  /**
   * @inheritDoc
   */
  save(model: ContactModel): Observable<ModelSaveInterface> {

    console.error('ContactService.save() not implemented yet.');

    return of({
      modelError: {},
      generalError: [],
    });
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<ContactModel|null> {

    return this.store$.select(selectDataContact(id));
  }

  /**
   * Select contact models
   */
  selectContacts(): Observable<Dictionary<ContactModel>> {

    return this.store$.select(selectDataContacts);
  }

  /**
   * Load contact page
   */
  page(id: string, name: string): void {

    // TODO[later] Remove tracking from here and move it to contact page component on init

    // Stats
    this.trackerService.trackString(TrackingActionEnum.contactView, name);

    // Is in contact legacy URL and has legacy function to show contact details
    if (
      this.browserService.getWindow().location.pathname.indexOf('/contact/') === 0 &&
      this.browserService.getWindow().showContactDetails
    ) {

      // Call legacy function to show contact details
      this.browserService.getWindow().showContactDetails('contact_' + id, name);

    } else {

      // Good old redirect
      this.browserService.redirect('/contact/active/contact?contact_id=' + id);
    }
  }

  /**
   * Load contact page searches tab
   */
  pageSearches(contactId: string, searchId: string): void {

    // Stats
    this.trackerService.trackString(TrackingActionEnum.contactViewSearches, searchId || 'null');

    if (this.browserService.getWindow().showContactDetails) {

      this.browserService.getWindow().showContactDetails('contact_' + contactId, '', true, searchId);
      return;
    }

    if (searchId === null) {

      this.browserService.redirect('/contact/active/contact?contact_id=' + contactId + '&contact_search_id=null');
    }

    this.browserService.redirect('/contact/active/contact?contact_id=' + contactId + '&contact_search_id=' + searchId);
  }

  /**
   * Select contact to preview
   */
  selectPreviewContact(): Observable<ContactModel|null> {

    return this.store$.select(selectUiPreviewContact);
  }

  /**
   * Select contact transfer
   */
  selectTransfer(): Observable<ContactTransferInterface> {

    return this.store$.select(selectUiTransfer);
  }

  /**
   * Select contact transfer options
   */
  selectTransferOptions(): Observable<ContactTransferOptionsInterface> {

    return this.store$.select(selectUiTransferOptions);
  }

  /**
   * Select broker options
   */
  selectBrokerOptions(): Observable<OptionInterface[]> {

    return this.store$.select(selectUiBrokerOptions);
  }

  /**
   * Select contact modify broker
   */
  selectModifyBroker(): Observable<ContactModifyBrokerInterface> {

    return this.store$.select(selectUiModifyBroker);
  }

  /**
   * Select contact modify broker options
   */
  selectModifyBrokerOptions(): Observable<ContactModifyBrokerOptionsInterface> {

    return this.store$.select(selectUiModifyBrokerOptions);
  }

  /**
   * Select contact transfer activity
   */
  selectTransferActivity(): Observable<ContactTransferActivityInterface> {

    return this.store$.select(selectUiTransferActivity);
  }

  /**
   * Select contact transfer activity options
   */
  selectTransferActivityOptions(): Observable<ContactTransferActivityOptionsInterface> {

    return this.store$.select(selectUiTransferActivityOptions);
  }

  /**
   * Select basket contact ids
   */
  selectBasketContactIds(): Observable<string[]> {

    return this.store$.select(selectUiBasketContactIds);
  }

  /**
   * Change contact ranking
   */
  changeRanking(contact: ContactModel, ranking: number): void {

    // Stats
    this.trackerService.trackString(TrackingActionEnum.contactRowStar, ranking.toString());

    this.store$.dispatch(
      new ContactEventChangeRanking({
        contact,
        ranking,
      }),
    );
  }

  /**
   * Preview a contact at the given position
   */
  preview(id: string, position: PositionInterface, hash: string): void {

    this.store$.dispatch(
      new ContactEventPreview({
        contactId: id,
        position: position,
        hash: hash,
      }),
    );
  }

  /**
   * Open matching by property
   */
  matchingProperty(contact: ContactModel): void {

    const userModel = new UserModel();
    userModel.account.contact.firstName = contact.fullName;

    // Stats
    this.trackerService.trackUser(TrackingActionEnum.contactRowMatching, userModel);

    // Open legacy functionality // TODO[later] Refactor once fully on Angular
    this.browserService.getWindow().openContactMatchTable(contact.id, [1, 0]);
  }

  /**
   * Set contacts to basket
   *
   * @deprecated TODO[later] Remove once fully on Angular
   */
  setBasket(contactIds: string[]): void {

    this.store$.dispatch(
      new ContactIoBasketContactIds({
        in: contactIds,
      }),
    );
  }

  /**
   * Add contacts to basket
   */
  addBasket(contactIds: string[]): void {
    
    this.store$.dispatch(
      
      new ContactEventAddBasket({contactIds}),
    );
    console.log(contactIds)
  }

  /**
   * Remove contacts from basket
   */
  removeBasket(contactIds: string[]): void {

    this.store$.dispatch(
      new ContactEventRemoveBasket({ contactIds }),
    );
  }

  /**
   * Send contacts by email
   */
  sendEmail(contactIds: string[]): void {

    this.store$.dispatch(
      new ContactEventSendEmail({ contactIds }),
    );
  }

  /**
   * Archive contacts
   */
  archive(contactIds: string[]): void {

    this.store$.dispatch(
      new ContactEventArchive({ contactIds }),
    );
  }

  /**
   * Unarchive contacts
   */
  unarchive(contactIds: string[]): void {

    this.store$.dispatch(
      new ContactEventUnarchive({ contactIds }),
    );
  }

  /**
   * Export
   */
  export(contactIds: string[], mode: string): void {

    this.store$.dispatch(
      new ContactEventExport({ contactIds, mode }),
    );
  }

  /**
   * Update transfer input
   */
  updateTransferInput(input: InputFormInterface): void {

    this.store$.dispatch(
      new ContactEventChangeInputTransfer({ input }),
    );
  }

  /**
   * Transfer contacts
   */
  transfer(transfer: ContactTransferInterface): void {

    this.store$.dispatch(
      new ContactEventTransfer({ transfer }),
    );
  }

  /**
   * Modify broker for contacts
   */
  modifyBroker(modifyBroker: ContactModifyBrokerInterface): void {

    this.store$.dispatch(
      new ContactEventModifyBroker({ modifyBroker }),
    );
  }

  /**
   * Transfer activity for contact
   */
  transferActivity(transferActivity: ContactTransferActivityInterface): void {

    this.store$.dispatch(
      new ContactEventTransferActivity({ transferActivity }),
    );
  }

  /**
   * Open history (Support for form legacy code)
   */
  openHistoryModal(id: string, name: string, isOwner: boolean): void {

    const userModel = new UserModel();
    userModel.account.contact.firstName = name;

    // Stats
    this.trackerService.trackUser(TrackingActionEnum.contactRowHistory, userModel);

    // Open modal
    this.historyService.openModal(EntityEnum.contact, id, name);
  }

  /**
   * Set photo as avatar
   */
  setAvatar(contact: ContactModel, upload: UploadModel): void {

    this.store$.dispatch(
      new ContactEventSetAvatar({ contact, upload }),
    );
  }

  /**
   * Remove avatar
   */
  removeAvatar(contact: ContactModel): void {

    this.store$.dispatch(
      new ContactEventRemoveAvatar({ contact }),
    );
  }
}
