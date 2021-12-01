import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { SummaryByIdResponseInterface } from './summary-by-id-response.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { AgencyBrokersResponseInterface } from './agency-brokers-response.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { ContactFiltersDecoratorInterface } from './contact-filters-decorator.interface';
import { ContactIdsResponseInterface } from './contact-ids-response.interface';
import { ContactListResponseInterface } from './contact-list-response.interface';
import { ContactListRequestInterface } from './contact-list-request.interface';
import { ContactIdsRequestInterface } from './contact-ids-request.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { ContactRankingResponseInterface } from './contact-update-ranking-response.interface';
import { ContactRankingRequestInterface } from './contact-update-ranking-request.interface';
import { ContactTypeEnum } from '../../../shared/enum/contact-type.enum';
import { ContactAddBasketRequestInterface } from './contact-add-basket-request.interface';
import { ContactAddBasketResponseInterface } from './contact-add-basket-response.interface';
import { ContactArchiveResponseInterface } from './contact-archive-response.interface';
import { ContactArchiveRequestInterface } from './contact-archive-request.interface';
import { ContactUnarchiveResponseInterface } from './contact-unarchive-response.interface';
import { ContactUnarchiveRequestInterface } from './contact-unarchive-request.interface';
import { ContactTransferInterface } from '../../../shared/interface/contact-transfer.interface';
import { ContactTransferRequestInterface } from './contact-transfer-request.interface';
import { ContactTransferResponseInterface } from './contact-transfer-response.interface';
import { ContactModifyBrokerInterface } from '../../../shared/interface/contact-modify-broker.interface';
import { ContactModifyBrokerRequestInterface } from './contact-modify-broker-request.interface';
import { ContactModifyBrokerResponseInterface } from './contact-modify-broker-response.interface';
import { ContactTransferActivityInterface } from '../../../shared/interface/contact-transfer-activity.interface';
import { ContactTransferActivityResponseInterface } from './contact-transfer-activity-response.interface';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { PhoneTypeEnum } from '../../../shared/enum/phone-type.enum';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactSetAvatarResponseInterface } from './contact-set-avatar-response.interface';
import { ContactRemoveAvatarResponseInterface } from './contact-remove-avatar-response.interface';
import { DocumentTypeEnum } from '../../../shared/enum/document-type.enum';
import { UploadModel } from '../../../shared/model/upload.model';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { ContactArchiveWarningRequestInterface } from './contact-archive-warning-request.interface';
import { ContactArchiveWarningResponseInterface } from './contact-archive-warning-response.interface';
import { ContactLoadResponseInterface } from './contact-load-response.interface';
import { ContactSaveRequestInterface } from './contact-save-request.interface';
import { ContactSocialModel } from '../../../shared/model/contact-social.model';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { LegacyApiServiceAbstract } from '../../format/legacy/legacy-api-service.abstract';
import { LegacyListResponseInterface } from '../../format/legacy/response/legacy-list-response.interface';
import { ContactListBetaPerformanceRequestInterface } from './contact-list-beta-performance-request.interface';
import { LegacyContactDataInterface } from '../../format/legacy/data/legacy-contact-data.interface';
import { LegacyAgencyHydrator } from '../../format/legacy/data/legacy-agency.hydrator';
import { LegacyContactHydrator } from '../../format/legacy/data/legacy-contact.hydrator';
import { SearchModel } from '../../../shared/model/search.model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { ListTypeEnum } from '../../../shared/enum/list-type.enum';

@Injectable()
export class ContactApiPhalconService extends LegacyApiServiceAbstract {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
    private legacyAgencyHydrator: LegacyAgencyHydrator,
    private legacyContactHydrator: LegacyContactHydrator,
  ) {

    super();
  }

  /**
   * List contacts
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): Observable<ModelListInterface<ContactModel>> {

    return this
      .httpService
      .post<ContactListRequestInterface, ContactListResponseInterface>(
        ApiEndpointEnum.contactList,
        this.listRequest(pagination, sort, filters),
        {
          type: filters.mode || ListTypeEnum.contact,
          state: filters.isArchive01 === '1' ? 'archive' : 'active',
        },
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * List contacts (beta performance)
   */
  listBetaPerformance(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): Observable<ModelListInterface<ContactModel>> {

    return this
      .httpService
      .get<ContactListBetaPerformanceRequestInterface, LegacyListResponseInterface<LegacyContactDataInterface>>(
        ApiEndpointEnum.contactListBetaPerformance,
        this.listBetaPerformanceRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => {

          return {
            models: response.data.map(data => this.legacyContactHydrator.hydrateModel(data)),
            total: response.total,
          };
        }),
      );
  }

  /**
   * Return an observable of results count matching the filters
   */
  count(filters: ContactSearchModel): Observable<number> {

    // TODO[later] Refactor for something cleaner
    const request = this.listBetaPerformanceRequest({ page: 0, perPage: 0 }, { id: '', order: OrderEnum.asc }, filters);
    delete request.start;
    delete request.length;
    delete request.sort_id;
    delete request.sort_order;

    return this
      .httpService
      .get<ContactListBetaPerformanceRequestInterface, { count: number; }>(
        ApiEndpointEnum.contactCount,
        request,
        null,
        true,
      )
      .pipe(
        map(response => response.count),
      );
  }

  /**
   * List IDs only matching the search
   */
  ids(filters: ContactSearchModel): Observable<string[]> {

    return this
      .httpService
      .post<ContactIdsRequestInterface, ContactIdsResponseInterface>(
        ApiEndpointEnum.contactIds,
        this.idsRequest(filters),
        {
          type: filters.mode,
          state: filters.isArchive01 === '1' ? 'archive' : 'active',
        },
        true,
      )
      .pipe(
        map(response => this.idsResponse(response)),
      );
  }

  /**
   * Load contact (entity = 'contact' or 'account')
   */
  load(id: string, entity: string): Observable<ContactModel> {

    return this
      .httpService
      .get<{}, ContactLoadResponseInterface>(
        ApiEndpointEnum.contactLoad,
        null,
        {
          entity: entity,
          id: id,
        },
        false,
      )
      .pipe(
        map(response => this.loadResponse(response)),
      );
  }

  /**
   * Save contact
   */
  save(model: ContactModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<ContactSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.contactSave,
        this.saveRequest(model),
        null,
        true,
      );
  }

  /**
   * Load summary
   */
  summary(id: string): Observable<ContactModel> {

    return this
      .httpService
      .get<null, SummaryByIdResponseInterface>(ApiEndpointEnum.contactSummaryById, null, { id })
      .pipe(
        map(response => this.summaryResponse(response)),
      );
  }

  /**
   * Load (beta performance)
   */
  loadBetaPerformance(id: string, hash: string): Observable<ContactModel> {

    const request: { hash?: string } = {};

    if (hash) {

      request.hash = hash;
    }

    return this
      .httpService
      .get<{ hash?: string }, LegacyContactDataInterface>(ApiEndpointEnum.contactLoadBetaPerformance, request, { id })
      .pipe(
        map(response => this.legacyContactHydrator.hydrateModel(response)),
      );
  }

  /**
   * Update contact ranking
   */
  updateRanking(
    contactId: string,
    ranking: number,
  ): Observable<ContactRankingResponseInterface> {

    const request: ContactRankingRequestInterface = {
      contact_id: contactId,
      ranking: ranking,
    };

    return this
      .httpService
      .post<ContactRankingRequestInterface, ContactRankingResponseInterface>(
        ApiEndpointEnum.contactUpdateRanking,
        request,
        null,
        true,
      );
  }

  /**
   * Load agency brokers
   */
  agencyBrokers(agencyId: string): Observable<ContactModel[]> {

    return this
      .httpService
      .get<null, AgencyBrokersResponseInterface>(
        ApiEndpointEnum.agencyBrokers,
        null,
        {id: agencyId},
      ).pipe(
        map(response => this.agencyBrokersResponse(response)),
      );
  }

  /**
   * Add contact IDs to basket
   */
  
  addBasket(contactIds: string[]): Observable<ContactAddBasketResponseInterface> {
    //var contactME = JSON.parse(localStorage.getItem("contactIds"));
    //console.log("localstorage",contactME);
    //var test=20
    const request: ContactAddBasketRequestInterface = {
      items: contactIds.map(contactIds => 'contact_' + contactIds),
    };

    return this
      .httpService
      .post<ContactAddBasketRequestInterface, ContactAddBasketResponseInterface>(
        ApiEndpointEnum.contactBasketAdd,
        request,
        null,
        true,
      );
  }

  /**
   * Remove contact IDs from basket
   */
  removeBasket(contactIds: string[]): Observable<ContactAddBasketResponseInterface> {

    const request: ContactAddBasketRequestInterface = {
      items: contactIds.map(contactId => 'contact_' + contactId),
    };

    return this
      .httpService
      .post<ContactAddBasketRequestInterface, ContactAddBasketResponseInterface>(
        ApiEndpointEnum.contactBasketRemove,
        request,
        null,
        true,
      );
  }

  /**
   * Archive contacts identified by IDs
   */
  archive(contactIds: string[]): Observable<ContactArchiveResponseInterface> {

    const request: ContactArchiveRequestInterface = {
      items: contactIds.map(contactId => 'contact_' + contactId),
    };

    return this
      .httpService
      .post<ContactArchiveRequestInterface, ContactArchiveResponseInterface>(
        ApiEndpointEnum.contactArchive,
        request,
        null,
        true,
      );
  }

  /**
   * Unarchive contacts identified by IDs
   */
  unarchive(contactIds: string[]): Observable<ContactUnarchiveResponseInterface> {

    const request: ContactUnarchiveRequestInterface = {
      items: contactIds.map(contactId => 'contact_' + contactId),
    };

    return this
      .httpService
      .post<ContactUnarchiveRequestInterface, ContactUnarchiveResponseInterface>(
        ApiEndpointEnum.contactUnarchive,
        request,
        null,
        true,
      );
  }

  /**
   * Transfer contacts broker
   */
  transfer(transfer: ContactTransferInterface): Observable<object> {

    const request: ContactTransferRequestInterface = [
      {
        agency_id: transfer.agencyId,
        broker_id: transfer.brokerId,
        contact_ids: transfer.contactIds,
      },
    ];

    return this
      .httpService
      .post<string, ContactTransferResponseInterface>(
        ApiEndpointEnum.contactTransfer,
        JSON.stringify(request),
        null,
        true,
      );
  }

  /**
   * Modify contacts broker
   */
  modifyBroker(modifyBroker: ContactModifyBrokerInterface): Observable<ContactModifyBrokerResponseInterface> {

    const request: ContactModifyBrokerRequestInterface = {
      items: modifyBroker.contactIds.map(contactId => 'contact_' + contactId),
      mainContact: modifyBroker.brokerId,
      saleBroker: modifyBroker.saleBrokerId,
      rentalBroker: modifyBroker.rentalBrokerId,
      searchManager: modifyBroker.searchManagerId,
    };

    if (modifyBroker.specificContactId) {

      request.originalBroker = modifyBroker.specificContactId;
    }

    return this
      .httpService
      .post<ContactModifyBrokerRequestInterface, ContactModifyBrokerResponseInterface>(
        ApiEndpointEnum.contactModifyBroker,
        request,
        null,
        true,
      );
  }

  /**
   * Transfer contact activity
   */
  transferActivity(transferActivity: ContactTransferActivityInterface): Observable<ContactTransferActivityResponseInterface> {

    const params = {
      from: transferActivity.contactId,
      to: transferActivity.brokerId,
      archive: transferActivity.isAllowedArchive && transferActivity.isActiveArchive ? 'archive' : 'no-archive',
    };

    return this
      .httpService
      .post<string, null>(
        ApiEndpointEnum.contactTransferActivity,
        null,
        params,
      );
  }

  /**
   * Set photo as avatar
   */
  setAvatar(contact: ContactModel, upload: UploadModel): Observable<ContactSetAvatarResponseInterface> {

    return this
      .httpService
      .post<null, ContactSetAvatarResponseInterface>(
        ApiEndpointEnum.documentSetAvatar,
        null,
        {
          entity: contact.entity,
          photoId: upload.fileId,
          isSet: null,
        },
        true,
      );
  }

  /**
   * Remove avatar
   */
  removeAvatar(contact: ContactModel): Observable<ContactRemoveAvatarResponseInterface> {

    return this
      .httpService
      .post<null, ContactRemoveAvatarResponseInterface>(
        ApiEndpointEnum.documentDelete,
        null,
        {
          entity: contact.entity,
          entityId: contact.id,
          documentType: DocumentTypeEnum.contactImage,
          documentId: contact.photoId,
        },
        true,
      );
  }

  /**
   * Has archive warning for any of the contact IDs ?
   */
  archiveWarning(contactIds: string[]): Observable<ContactArchiveWarningResponseInterface> {

    return this
      .httpService
      .get<ContactArchiveWarningRequestInterface, ContactArchiveWarningResponseInterface>(
        ApiEndpointEnum.contactArchiveWarning,
        {
          contact_ids: contactIds,
        },
        null,
        true,
      )
      .pipe(
        catchError(error => of({ warning: true })),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): ContactListRequestInterface {

    return this.filtersDecorator<ContactListRequestInterface>(
      {
        start: (pagination.page - 1) * pagination.perPage,
        length: pagination.perPage,
        sort_id: sort.id,
        sort_order: sort.order,
      },
      filters,
    );
  }

  /**
   * Handle a listBetaPerformance() request parameters and return a formatted request
   */
  private listBetaPerformanceRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ContactSearchModel,
  ): ContactListBetaPerformanceRequestInterface {

    const request = <ContactListBetaPerformanceRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.circle) {

      request.circle = filters.circle;
    }

    if (filters.isArchive01 !== null) {

      request.is_archive = filters.isArchive01;
    }

    if (filters.contactTextSearch) {

      request.keyword = filters.contactTextSearch;
    }

    if (filters.typeIds.length > 0) {

      request.contact_type_ids = filters.typeIds;
    }

    if (filters.brokerIds.length > 0) {

      request.manager_contact_ids = filters.brokerIds;
    }

    if (filters.propertyIds.length > 0) {

      request.property_ids = filters.propertyIds;
    }

    if (filters.languageId) {

      request.language_id = filters.languageId;
    }

    if (filters.isDirectClient01 !== null) {

      request.is_direct_client = filters.isDirectClient01;
    }

    if (filters.visibilityId) {

      request.visibility_id = filters.visibilityId;
    }

    if (filters.originIds.length > 0) {

      request.origin_ids = filters.originIds;
    }

    if (filters.isVip01 !== null) {

      request.is_vip = filters.isVip01;
    }

    if (filters.lastContactId) {

      request.last_contact_id = filters.lastContactId;
    }

    if (filters.rankingIds.length > 0) {

      request.rankings = filters.rankingIds;
    }

    if (filters.customAttributeIds.length > 0) {

      request.custom_attribute_value_ids = filters.customAttributeIds;
    }

    if (filters.contactConditionIds.length > 0) {

      request.contact_state_ids = filters.contactConditionIds;
    }

    if (filters.searchConditionId) {

      request.search_state_id = filters.searchConditionId;
    }

    if (filters.contactId) {

      request.contact_id = filters.contactId;
    }

    if (filters.searchManagerIds.length > 0) {

      request.search_manager_contact_ids = filters.searchManagerIds;
    }

    if (filters.locationPath) {

      request.location_path = filters.locationPath;
    }

    if (filters.transactionId) {

      request.transaction_type_id = filters.transactionId;
    }

    if (filters.categoryIds.length > 0) {

      request.main_category_ids = filters.categoryIds;
    }

    if (filters.bedroomMin) {

      request.bedroom_min = filters.bedroomMin;
    }

    if (filters.bedroomMax) {

      request.bedroom_max = filters.bedroomMax;
    }

    if (filters.roomMin) {

      request.room_min = filters.roomMin;
    }

    if (filters.roomMax) {

      request.room_max = filters.roomMax;
    }

    if (filters.priceMin) {

      request.price_min = filters.priceMin;
    }

    if (filters.priceMax) {

      request.price_max = filters.priceMax;
    }

    if (filters.areaMin) {

      request.area_min = filters.areaMin;
    }

    if (filters.areaMax) {

      request.area_max = filters.areaMax;
    }

    if (filters.positionIds.length > 0) {

      request.position_ids = filters.positionIds;
    }

    if (filters.viewIds.length > 0) {

      request.view_ids = filters.viewIds;
    }

    if (filters.searchTypeId !== null) {

      request.is_new_property = filters.searchTypeId;
    }

    return request;
  }

  /**
   * Handle an ids() request parameters and return a formatted request
   */
  private idsRequest(filters: ContactSearchModel): ContactIdsRequestInterface {

    return this.filtersDecorator<ContactIdsRequestInterface>(
      {
        format: 'numeric',
      },
      filters,
    );
  }

  /**
   * Handle an ids() response and return a string[]
   */
  private idsResponse(response: ContactIdsResponseInterface): string[] {

    return response.map(r => r.id.split('_')[1]);
  }

  /**
   * Handle an save() request parameters and return a formatted request
   */
  private saveRequest(contact: ContactModel): ContactSaveRequestInterface {

    const request: ContactSaveRequestInterface = {

      // Contact
      contact_id: contact.id,
      ranking: String(contact.ranking),
      contact_title: contact.titleId, // 127
      contact_greeting: contact.greetingId, // 323
      contact_language: contact.languageId, // en
      contact_visibility: contact.visibilityId, // 132
      contact_pipeline_stage: contact.pipelineStageId, // 2
      contact_lastName: contact.lastName, // Favaron
      contact_firstName: contact.firstName, // Nicolas
      contact_vip: contact.isVip ? '1' : '0', // 1
      contact_lastName2: contact.lastName2, // 2nom
      contact_firstName2: contact.firstName2, // 2prenom
      contact_type: contact.contactTypeIds, // 12,13,15
      contact_main_contact: contact.mainContactId, // 59948
      contact_sale_contact: contact.saleContactId, // 1590999
      contact_rental_contact: contact.rentalContactId, // 1015218
      mobile: contact.mobiles.map(mobile => [
        mobile.number || '', mobile.isMainNumber ? '1' : '', mobile.notes || '', mobile.isMainNumber ? '1' : '',
      ].join('|^|')), // 123456|^|1|^|note|^|1
      landLine: contact.landlines.map(landline => [
        landline.number || '', landline.isMainNumber ? '1' : '', landline.notes || '', landline.isMainNumber ? '1' : '',
      ].join('|^|')), // +41 79 504 1786|^|1|^|note4|^|1
      email: contact.emails.map(email => [
        email.emailId || '', email.isMainEmail ? '1' : '', email.notes || '', email.isUsedMailing ? '1' : '',
      ].join('|^|')), // nicolas@realforce.ch|^|1|^||^|1|^|
      address: contact.addresses.map(address => [
        address.line1 || '',
        address.zipCode || '',
        address.city || '',
        address.countryId || '',
        address.isMainAddress ? '1' : '',
        address.notes || '',
        address.line2 || '',
        address.line3 || '',
      ].join('|^|')), // line1|^|1206|^|geneva|^|186|^|1|^|note6|^|line2|^|line3

      contact_custom_attribute: contact.customAttributeIds, // 6
      contact_linkedin: '', // linked
      contact_instagram: '', // insta
      contact_facebook: '', // face
      contact_twitter: '', // twit
      contact_birthday: this.helperService.dateToString(contact.birthDate), // 15/03/1986
      contact_nationality: contact.nationalityId, // 75
      contact_family_status: contact.maritalStatusId, // 100
      contact_children: contact.childrenId, // 1
      contact_company: contact.companyName, // rfs
      contact_job: contact.jobDescription, // super
      contact_banking_reference: contact.bankReference, // aucunelol
      contact_direct_client: contact.isDirectClient ? '1' : '0', // 1
      contact_intermediate: contact.intermediateContact ? contact.intermediateContact.id : '', // 23
      contact_origin: contact.originId, // 275
      contact_notes: contact.notes, // contactnotes
      account_type_hidden: contact.isHiddenOnMls ? '1' : '0', // 1

      // Account
      account_id: contact.accountId, // 4610
      account_agency_id: contact.agency.id,
      account_login: contact.accountLogin, // nicolas@realforce.ch
      password: contact.accountPassword, //
      account_pwd: contact.accountPasswordConfirm, //
      account_pwd_confirm: contact.accountPasswordConfirm, //
      account_type: contact.accountTypeId, // 1
      is_active_account: contact.accountIsActive ? '1' : '0', // 1
      account_expiry_date: this.helperService.dateToString(contact.accountExpiryDate), // 20/10/2010
      account_user_profile: contact.accountNotes, //  comment
      account_privilege: contact.accountPrivileges, // ["1", "2", "3"]
      account_language: contact.accountLanguageId,
      account_switch_accounts: contact.accountSwitchAccounts
        .filter(accountSwitchAccount => accountSwitchAccount.id || accountSwitchAccount.isRemoved === false)
        .map(accountSwitchAccount => JSON.stringify(accountSwitchAccount)),

      // Contact search, for now useless
      current_contact_search_id: '',
      contact_search_manager: '',
      contact_search_title: '',
      contact_search_notes: '',
      contact_transaction_type: '',
      contact_search_type: '',
      contact_main_category: '',
      contact_sub_category: '',
      contact_zip_code_search: '',
      contact_bedroom_min: '',
      contact_bedroom_max: '',
      contact_room_min: '',
      contact_room_max: '',
      contact_habitable_min: '',
      contact_habitable_max: '',
      contact_price_min: '',
      contact_price_max: '',
      contact_furnishing: '',
      contact_position: '',
      contact_style: '',
      contact_view: '',
      contact_sonority: '',
      contact_land_min: '',
      contact_land_max: '',
      contact_margin_price: '',
      contact_margin_room: '',
      contact_margin_area: '',
      contact_margin_bedroom: '',
      contact_margin_land: '',
      contact_search_spaces: '',
      search_sector: '',
    };

    contact.socials.forEach(social => {

      request['contact_' + social.network] = social.url;
    });

    return request;
  }

  /**
   * Handle a load() response and return a ContactModel
   */
  private loadResponse(response: ContactLoadResponseInterface): ContactModel {

    const values = response.contact.values;
    const contact = new ContactModel();

    // Contact
    contact.id = values.contact_id;
    contact.reference = '#' + values.reference;
    contact.firstName = values.firstName;
    contact.lastName = values.lastName;
    contact.initials = values.initials;
    contact.firstName2 = values.firstName2;
    contact.lastName2 = values.lastName2;
    contact.bankReference = values.banking_reference;
    contact.birthDate = this.helperService.stringToDate(values.birthday_mysql);
    contact.childrenId = values.children || '';
    contact.companyName = values.company;
    contact.customAttributeIds = values.contact_custom_attribute;
    contact.contactTypeIds = <ContactTypeEnum[]>values.contact_types;
    contact.createDate = this.helperService.stringToDate(values.create_date);
    contact.updateDate = values.update ? this.helperService.stringToDate(values.update_date) : null;
    contact.isDirectClient = values.direct_client === 1;
    contact.isVip = values.vip === 1;
    contact.visibilityId = values.visibility || '';
    contact.titleId = values.title || '';
    contact.maritalStatusId = values.family_status || '';
    contact.pipelineStageId = values.stage || '';
    contact.ranking = values.ranking;
    contact.notes = values.notes;
    contact.nationalityId = values.nationality || '';
    contact.originId = values.origin ? String(values.origin) : '';
    contact.greetingId = values.greeting || '';
    contact.isHiddenOnMls = values.hidden_on_mls_agency_profile === 1;
    contact.jobDescription = values.job;

    if (values.create_contact) {

      contact.createContact = this.legacyContactHydrator.hydrateModel(values.create_contact);
    }

    if (values.update_contact) {

      contact.updateContact = this.legacyContactHydrator.hydrateModel(values.update_contact);
    }

    // Agency
    if (values.contact_agency) {

      contact.agency = this.legacyAgencyHydrator.hydrateModel(values.contact_agency);
    }

    // Person in charge
    if (values.main_contact) {

      contact.mainContact = new ContactModel();
      contact.mainContact.id = values.main_contact;
      contact.mainContact.initials = values.main_contact_initials;
      contact.mainContact.type = ContactTypeEnum.colleague;

      contact.mainContactId = values.main_contact;
    }

    // Broker sale
    if (values.sale_contact) {

      contact.saleContact = new ContactModel();
      contact.saleContact.id = values.sale_contact;
      contact.saleContact.initials = '';
      contact.saleContact.type = ContactTypeEnum.colleagueSalesBroker;

      contact.saleContactId = values.sale_contact;
    }

    // Broker rental
    if (values.rental_contact) {

      contact.rentalContact = new ContactModel();
      contact.rentalContact.id = values.rental_contact;
      contact.rentalContact.initials = '';
      contact.rentalContact.type = ContactTypeEnum.colleagueRentalBroker;

      contact.rentalContactId = values.rental_contact;
    }

    // Intermediary
    if (values.intermediate) {

      contact.intermediateContact = new ContactModel();
      contact.intermediateContact.id = values.intermediate;
      contact.intermediateContact.initials = '';
    }

    // Socials
    contact.socials = ['facebook', 'instagram', 'linkedin', 'twitter'].map(network => {

      const social = new ContactSocialModel();
      social.network = network;
      social.url = values[network] || '';

      return social;
    });

    // Mobiles
    (values.mobiles || []).forEach(mobileStr => {

      const s = mobileStr.split('|^|');

      const phone = new ContactPhoneModel();
      phone.number = s[0];
      phone.isMainNumber = String(s[1]) === '1';
      phone.notes = s[2];

      contact.mobiles.push(phone);
    });

    // Landlines
    (values.landLines || []).forEach(landlineStr => {

      const s = landlineStr.split('|^|');

      const phone = new ContactPhoneModel();
      phone.number = s[0];
      phone.isMainNumber = String(s[1]) === '1';
      phone.notes = s[2];

      contact.landlines.push(phone);
    });

    // Emails
    (values.emails || []).forEach(emailStr => {

      const s = emailStr.split('|^|');

      const email = new ContactEmailModel();
      email.emailId = s[0];
      email.isMainEmail = String(s[1]) === '1';
      email.notes = s[2];
      email.isUsedMailing = String(s[3]) === '1';

      contact.emails.push(email);
    });

    // Addresses
    (values.addresses || []).forEach(addressStr => {

      const s = addressStr.split('|^|');

      const address = new ContactAddressModel();
      address.line1 = s[0];
      address.line2 = s[6];
      address.line3 = s[7];
      address.zipCode = s[1];
      address.city = s[2];
      address.countryId = s[3];
      address.notes = s[5];
      address.isMainAddress = String(s[4]) === '1';

      contact.addresses.push(address);
    });

    // Account (flatified)
    contact.accountId = values.account_id;
    contact.accountLogin = values.login;
    contact.accountTypeId = values.account_type;
    contact.accountTypeLabel = values.account_type_label;
    contact.accountExpiryDate = this.helperService.stringToDate(values.expiry_date_mysql);
    contact.accountNotes = values.user_profile;
    contact.accountLanguageId = values.account_language;
    contact.accountPrivileges = values.account_privilege;
    contact.accountIsActive = values.is_active === 1;
    contact.accountIsEnabledGoogleAgenda = values.account_enable_google_agenda === '1';
    contact.accountIsAllowedSwitching = values.account_allow_switching_to_this_account === '1';
    contact.accountIsEnabledSendEmailOnBehalf = values.account_allow_send_on_behalf === '1';
    contact.accountLastLoginDate = this.helperService.stringToDate(values.account_last_login_date);
    contact.accountLastSeenDate = this.helperService.stringToDate(values.account_last_seen_date);
    contact.accountLastSeenIp = values.account_last_seen_ip;
    contact.accountLastSeenUserAgent = values.account_last_seen_user_agent;
    contact.accountSwitchAccounts = (values.account_switch_accounts || []).map(accountSwitch => {

      return {
        id: accountSwitch.id,
        accountId: accountSwitch.accountId,
        accountLogin: accountSwitch.accountLogin,
        isRemoved: false,
      };
    });

    return contact;
  }

  /**
   * Handle a list() response and return a list of contact models
   */
  private listResponse(response: ContactListResponseInterface): ModelListInterface<ContactModel> {

    return {
      models: response.data.map((data, i) => {

        const contact = new ContactModel();

        contact.id = data.id;
        contact.firstName = data.firstname;
        contact.lastName = data.lastname || '';
        contact.fullName = contact.getFullName();
        contact.languageId = <LanguageEnum>data.language_id;
        contact.lastContactDate = this.helperService.stringToDate(data.last_contact_datetime);
        contact.createDate = this.helperService.stringToDate(data.create_datetime);
        contact.ranking = parseInt(data.ranking, 10);
        contact.isBlacklisted = data.DT_RowClass === 'fromMyPartner';
        contact.isEditable = !!data.editable;

        if (data.search_count > 0) {

          for (let j = 0; j < data.search_count; j++) {

            contact.searches.push(new SearchModel());
          }
        }

        // Agency
        contact.agency.id = data.agency_id;

        // Emails
        if (data.emails) {

          data.emails.forEach(emailId => {

            const email = new ContactEmailModel();
            email.emailId = emailId;

            contact.emails.push(email);
          });
        }

        // Person in charge
        if (data.contact_in_charge_broker) {

          contact.mainContact = new ContactModel();
          contact.mainContact.id = Object.keys(data.contact_in_charge_phones_broker)[0];
          contact.mainContact.initials = data.contact_in_charge_broker;
          contact.mainContact.type = ContactTypeEnum.colleague;
        }

        // Broker sale
        if (data.contact_in_charge_sale) {

          contact.saleContact = new ContactModel();
          contact.saleContact.id = Object.keys(data.contact_in_charge_phones_sale)[0];
          contact.saleContact.initials = data.contact_in_charge_sale;
          contact.saleContact.type = ContactTypeEnum.colleagueSalesBroker;
        }

        // Broker rental
        if (data.contact_in_charge_rental) {

          contact.rentalContact = new ContactModel();
          contact.rentalContact.id = Object.keys(data.contact_in_charge_phones_rental)[0];
          contact.rentalContact.initials = data.contact_in_charge_rental;
          contact.rentalContact.type = ContactTypeEnum.colleagueRentalBroker;
        }

        // Intermediary
        if (data.contact_in_charge_intermediate) {

          contact.intermediateContact = new ContactModel();
          contact.intermediateContact.id = Object.keys(data.contact_in_charge_phones_intermediate)[0];
          contact.intermediateContact.initials = data.contact_in_charge_intermediate;
        }

        return contact;
      }),
      total: response.recordsTotal === null ? null : parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Return a decorated version of the request with filters
   */
  private filtersDecorator<R extends ContactFiltersDecoratorInterface>(request: R, filters: ContactSearchModel): R {

    if (filters.contactId) {

      request.contact = filters.contactId;
    }

    if (filters.propertyIds && filters.propertyIds.length > 0) {

      request.property = filters.propertyIds;
    }

    if (filters.locationIds && filters.locationIds.length > 0) {

      request.location = filters.locationIds;
    }

    if (filters.isDirectClient01) {

      request.direct_client = filters.isDirectClient01;
    }

    if (filters.typeIds && filters.typeIds.length > 0) {

      request.contact_type = filters.typeIds;
    }

    if (filters.brokerIds && filters.brokerIds.length > 0) {

      request.contact_in_charge = filters.brokerIds;
    }

    if (filters.searchManagerIds && filters.searchManagerIds.length > 0) {

      request.search_manager_id = filters.searchManagerIds;
    }

    if (filters.languageId) {

      request.language = filters.languageId;
    }

    if (filters.rankingIds && filters.rankingIds.length > 0) {

      request.ranking = filters.rankingIds;
    }

    if (filters.visibilityId) {

      request.visibility = filters.visibilityId;
    }

    if (filters.originIds && filters.originIds.length > 0) {

      request.contact_origin = filters.originIds;
    }

    if (filters.transactionId) {

      request.transaction_type = filters.transactionId;
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {

      request.main_category = filters.categoryIds;
    }

    if (filters.prices && filters.prices.length > 0) {

      request.price = filters.prices;
    }

    if (filters.bedrooms) {

      request.bedroom = filters.bedrooms;
    }

    if (filters.rooms) {

      request.room = filters.rooms;
    }

    if (filters.area && filters.area.length > 0) {

      request.area = filters.area;
    }

    if (filters.positionIds && filters.positionIds.length > 0) {

      request.position = filters.positionIds;
    }

    if (filters.viewIds && filters.viewIds.length > 0) {

      request.view = filters.viewIds;
    }

    if (filters.searchConditionId) {

      request.contact_search_count = [filters.searchConditionId];
    }

    if (filters.contactConditionIds && filters.contactConditionIds.length > 0) {

      request.special_filters = filters.contactConditionIds;
    }

    if (filters.searchTypeId) {

      request.contact_search_type = filters.searchTypeId;
    }

    if (filters.lastContactId) {

      request.last_contact = filters.lastContactId;
    }

    if (filters.isVip01) {

      request.vip = filters.isVip01;
    }

    if (filters.contactTextSearch) {

      request.contact_free_search = filters.contactTextSearch;
    }

    if (filters.propertyTextSearch) {

      request.property_free_search = filters.propertyTextSearch;
    }

    if (filters.customAttributeIds && filters.customAttributeIds.length > 0) {

      request.custom_attribute = filters.customAttributeIds;
    }

    if (filters.contactIds.length > 0) {

      request.ids = filters.contactIds;
    }

    return request;
  }

  /**
   * Handle a summary() response and return a ContactModel
   */
  private summaryResponse(response: SummaryByIdResponseInterface): ContactModel {

    const contact = new ContactModel();

    contact.id = response.id;
    contact.firstName = response.firstname || '';
    contact.lastName = response.lastname || '';
    contact.fullName = contact.getFullName();
    contact.searches = [];
    contact.notes = (response.notes || '').trim() || '';
    contact.companyName = response.company;
    contact.contactTypeIds = <ContactTypeEnum[]>response.types || [];
    contact.agency.name = response.agency;
    contact.createDate = this.helperService.stringToDate(response.creation);
    contact.ranking = response.ranking || 0;

    if (response.email) {

      const email = new ContactEmailModel();

      email.emailId = response.email;

      contact.emails.push(email);
    }

    (response.phones || []).forEach(p => {

      const phone = new ContactPhoneModel();
      phone.number = p.number;
      phone.type = <PhoneTypeEnum>p.type;

      if (p.type === PhoneTypeEnum.mobile) {

        contact.mobiles.push(phone);
      } else if (p.type === PhoneTypeEnum.landline) {

        contact.landlines.push(phone);
      }
    });

    if (response.searches) {

      response.searches.forEach(searchSummary => {

        if (searchSummary.id) {

          const search = new SearchModel();

          search.id = searchSummary.id;
          search.title = searchSummary.title;
          search.statusId = searchSummary.status_id;
          search.notes = searchSummary.note;

          if (searchSummary.manager_id) {

            search.brokerContact = new ContactModel();
            search.brokerContact.id = searchSummary.manager_id;
            search.brokerContact.firstName = searchSummary.manager_firstname;
            search.brokerContact.lastName = searchSummary.manager_lastname;
            search.brokerContact.initials = (search.brokerContact.firstName[0] || '') + (search.brokerContact.lastName[0] || '');
          }

          contact.searches.push(search);
        }
      });
    }

    if (response.brokers) {

      Object.keys(response.brokers).forEach((type) => {

        const broker = response.brokers[type];
        const contactModel = new ContactModel();

        contactModel.id = broker.contact.id || '';
        contactModel.firstName = broker.contact.firstname || '';
        contactModel.lastName = broker.contact.lastname || '';
        contactModel.fullName = contactModel.getFullName();
        contactModel.agency.name = broker.contact.agency || '';

        (broker.phones || []).forEach(p => {

          const phone = new ContactPhoneModel();
          phone.number = p.number;

          if (p.type === PhoneTypeEnum.mobile) {

            contactModel.mobiles.push(phone);
          } else if (p.type === PhoneTypeEnum.landline) {

            contactModel.landlines.push(phone);
          }
        });

        // Person in charge
        if (type === 'main') {

          contactModel.type = ContactTypeEnum.colleague;
          contact.mainContact = contactModel;
        }

        // Broker sale
        if (type === 'sales') {

          contactModel.type = ContactTypeEnum.colleagueSalesBroker;
          contact.saleContact = contactModel;
        }

        // Broker rental
        if (type === 'rental') {

          contactModel.type = ContactTypeEnum.colleagueRentalBroker;
          contact.rentalContact = contactModel;
        }

        // Intermediary
        if (type === 'intermediate') {

          contactModel.type = ContactTypeEnum.intermediary;
          contact.intermediateContact = contactModel;
        }
      });
    }

    return contact;
  }

  /**
   * Return list of contact models
   */
  private agencyBrokersResponse(response: AgencyBrokersResponseInterface): ContactModel[] {

    const contacts = [];

    Object.keys(response).forEach(key => {

      const contact = new ContactModel();

      contact.id = key;
      contact.fullName = response[key];

      contacts.push(contact);
    });

    return contacts;
  }
}
