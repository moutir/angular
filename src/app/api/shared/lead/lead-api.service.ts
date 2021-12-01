import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/shared/helper.service';
import { LeadSearchModel } from '../../../shared/model/lead-search.model';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { LeadModel } from '../../../shared/model/lead.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { LeadListRequestInterface } from './lead-list-request.interface';
import { LeadListResponseInterface } from './lead-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { LeadSubsourcesResponseInterface } from './lead-subsources-response.interface';
import { OptionInterface } from '../../../shared/interface/option.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { LeadLoadResponseInterface } from './lead-load-response.interface';
import { LeadSaveRequestInterface } from './lead-save-request.interface';
import { PropertyModel } from '../../../shared/model/property.model';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { PhoneTypeEnum } from '../../../shared/enum/phone-type.enum';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { LeadValidationContactInterface } from './lead-validation-contact.interface';
import { LeadContactValidationInterface } from '../../../shared/interface/lead-contact-validation.interface';
import { LeadValidationLoadResponseInterface } from './lead-validation-load-response.interface';
import { LeadValidationSaveRequestInterface } from './lead-validation-save-request.interface';
import { LeadValidationSaveResponseInterface } from './lead-validation-save-response.interface';
import { LeadModifyStatusInterface } from '../../../shared/interface/lead-modify-status.interface';
import { LeadModifyStatusRequestInterface } from './lead-modify-status-request.interface';
import { LeadModifyStatusResponseInterface } from './lead-modify-status-response.interface';

@Injectable()
export class LeadApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List leads
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: LeadSearchModel,
  ): Observable<ModelListInterface<LeadModel>> {

    return this
      .httpService
      .post<LeadListRequestInterface, LeadListResponseInterface>(
        ApiEndpointEnum.leadList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Load
   */
  load(id: string): Observable<LeadModel> {

    return this
      .httpService
      .get<{ id: string }, LeadLoadResponseInterface>(
        ApiEndpointEnum.leadLoad,
        null,
        { id: id },
      ).pipe(
        map(response => this.loadResponse(response)),
      );
  }

  /**
   * Save lead
   */
  save(model: LeadModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<LeadSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.leadSave,
        this.saveRequest(model),
        { id: model.id },
        true,
      );
  }

  /**
   * Load lead subsources
   */
  subSources(sourceId: string): Observable<OptionInterface[]> {

    return this
      .httpService
      .get<null, LeadSubsourcesResponseInterface>(
        ApiEndpointEnum.leadSubSourceById,
        null,
        { id: sourceId },
      ).pipe(
        map(response => this.subSourcesResponse(response)),
      );
  }

  /**
   * Load configuration for contact validation
   */
  loadValidation(id: string): Observable<LeadContactValidationInterface> {

    return this
      .httpService
      .get<null, LeadValidationLoadResponseInterface>(
        ApiEndpointEnum.leadValidation,
        null,
        { id: id },
      ).pipe(
        map(response => this.loadValidationResponse(response)),
      );
  }

  /**
   * Save contact validation
   */
  saveValidation(model: LeadModel): Observable<ContactModel> {

    const request: LeadValidationSaveRequestInterface = {
      option: model.validationOptionId,
    };

    if (model.validationOptionId === 1 || model.validationOptionId === 3) {

      request.searchedContact = model.validationContact.id;
    }

    if (model.validationOptionId === 2) {

      request.selectedFoundContact = model.validationContact.id;
    }

    return this
      .httpService
      .post<LeadValidationSaveRequestInterface, LeadValidationSaveResponseInterface>(
        ApiEndpointEnum.leadSaveValidation,
        request,
        { id: model.id },
        true,
      ).pipe(
        map(response => this.saveValidationResponse(response)),
      );
  }

  /**
   * Modify leads' status
   */
  modifyStatus(modifyStatus: LeadModifyStatusInterface): Observable<LeadModifyStatusResponseInterface> {

    return this
      .httpService
      .post<LeadModifyStatusRequestInterface, LeadModifyStatusResponseInterface>(
        ApiEndpointEnum.leadModifyStatus,
        {
          leadIds: modifyStatus.leadIds,
          statusId: modifyStatus.statusId,
        },
        null,
        true,
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: LeadSearchModel,
  ): LeadListRequestInterface {

    const request = <LeadListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.type) {

      request.lead_type = filters.type;
    }

    if (filters.dateFrom) {

      request.lead_from = this.helperService.dateToString(new Date(filters.dateFrom));
    }

    if (filters.dateTo) {

      request.lead_to = this.helperService.dateToString(new Date(filters.dateTo));
    }

    if (filters.statusIds && filters.statusIds.length > 0) {

      request.lead_status = filters.statusIds;
    }

    if (filters.clientId) {

      request.contact = filters.clientId;
    }

    if (filters.propertyId) {

      request.property = filters.propertyId;
    }

    if (filters.brokerId) {

      request.managed_by = filters.brokerId;
    }

    if (filters.mainSourceId) {

      request.main_lead_source = filters.mainSourceId;
    }

    if (filters.subSourceId) {

      request.sub_lead_source = filters.subSourceId;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of lead models
   */
  private listResponse(response: LeadListResponseInterface): ModelListInterface<LeadModel> {

    return {
      models: response.data.map((data, i) => {

        const lead = new LeadModel();

        // Lead
        lead.id = data.id;
        lead.typeLabel = data.lead_type_label;
        lead.agencyGatewayId = data.agency_gateway_id;
        lead.agencyWebsiteId = data.agency_website_id;
        lead.assignedById = data.assigned_by_id;
        lead.brokerNotes = data.comment;
        lead.labelDuration = data.duration;
        lead.labelDurationLevel = (data.durationCssClass || '').slice(-1);
        lead.sourceLabel = data.source_label;
        lead.mediaLabel = data.original_communication_label;
        lead.statusId = data.status_id;
        lead.statusLabel = data.status_label;
        lead.leadParserErrorCode = data.lead_parser_error_code;
        lead.assignDate = this.helperService.stringToDate(data.assign_date2);
        lead.contactDate = this.helperService.stringToDate(data.contact_date2);
        lead.createDate = this.helperService.stringToDate(data.creation_date2);
        lead.updateDate = this.helperService.stringToDate(data.update_date2);
        lead.hasEmail = data.has_email === true;
        lead.hasEmailStatus = data.has_email_status === true;
        lead.hasEmailPrivilege = data.has_email_privilege === true;
        lead.isNeedValidation = data.contact_need_validation === '1';
        lead.isAllowedEmail = lead.isNeedValidation === false
          && data.has_email === true
          && data.has_email_status === true
          && data.has_email_privilege === true;

        // Client
        lead.contact.id = data.contact_id;
        lead.contact.firstName = data.contact_firstname;
        lead.contact.lastName = data.contact_lastname;
        lead.contact.fullName = (data.client || '').trim();

        // Agency
        lead.agency.id = data.agency_id;

        if (data.client_contact_id && data.client_contact_initials) {

          lead.contact.mainContact = new ContactModel();
          lead.contact.mainContact.id = data.client_contact_id;
          lead.contact.mainContact.initials = data.client_contact_initials;
        }

        // Broker
        lead.broker.id = data.managed_by_id;
        lead.broker.firstName = data.manager_firstname;
        lead.broker.lastName = data.manager_lastname;
        lead.broker.fullName = (data.manager || '').trim();
        lead.broker.initials = (data.manager_initials || '').trim();

        // Property
        const property = new PropertyModel();
        property.id = data.property_id || '';
        property.reference = data.reference || '';
        property.ranking = parseInt(data.property_ranking, 10);
        property.photoSmallURL = data.property_photo_thumb && data.property_photo_thumb.indexOf('/rf_default_property.jpg') === -1 ?
          data.property_photo_thumb : '';
        property.photoLargeURL = data.property_photo_zoom && data.property_photo_zoom.indexOf('/rf_default_property.jpg') === -1 ?
          data.property_photo_zoom : '';
        property.isAllowedPreview = data.property_has_summary === true;
        lead.properties.push(property);

        // Promotion
        const promotion = new PromotionModel();
        promotion.id = data.promotion_id || '';
        lead.promotions.push(promotion);

        // Created contact
        lead.createContact.id = data.created_by_id || '';

        // Updated contact
        lead.updateContact.id = data.updated_by_id || '';

        return lead;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a load() response and return a lead model
   */
  private loadResponse(response: LeadLoadResponseInterface): LeadModel {

    const model = new LeadModel();

    model.id = response.id;
    model.typeId = response.lead_type_id;
    model.agencyGatewayId = response.agency_gateway_id;
    model.agencyWebsiteId = response.agency_website_id;
    model.assignedById = response.assigned_by_id;
    model.mediaId = response.original_communication_id;
    model.managementMediaId = response.management_communication_id;
    model.contactMessage = response.contact_message;
    model.originalMessage = response.original_message;
    model.brokerNotes = response.comment;
    model.statusId = response.status_id;
    model.sourceId = response.main_source_id;
    model.subSourceId = response.sub_source_id || '';
    model.isReadonly = !!response.readonly;
    model.leadParserErrorCode = response.lead_parser_error_code;
    model.leadParserErrorData = response.lead_parser_error_data;
    model.assignDate = this.helperService.stringToDate(response.assign_date);
    model.createDate = this.helperService.stringToDate(response.creation_date);
    model.contactDate = this.helperService.stringToDate(response.contact_datetime, false);
    model.manageDate = this.helperService.stringToDate(response.management_datetime, false);
    model.contactTime = this.helperService.getTimeString(model.contactDate, true);
    model.manageTime = this.helperService.getTimeString(model.manageDate);
    model.autoAssignCaseNumber = response.auto_assign_case_number;
    model.hasEmail = response.has_email === true;
    model.hasEmailStatus = response.has_email_status === true;
    model.hasEmailPrivilege = response.has_email_privilege === true;
    model.isReadonly = !!response.readonly;
    model.isNeedValidation = response.contact_need_validation === '1';
    model.isAllowedEmail = model.isNeedValidation === false
      && response.has_email === true
      && response.has_email_status === true
      && response.has_email_privilege === true;

    // Client
    const segments = (response.contact_string || '').split(' - ');
    model.contact.id = response.contact_id || '';
    model.contact.fullName = segments[0].trim();

    if (segments[1]) {

      const email = new ContactEmailModel();
      email.emailId = segments[1];
      model.contact.emails.push(email);
    }

    // Broker
    model.broker.id = response.managed_by_id || '';

    // Property
    if (response.property_id) {

      const property = new PropertyModel();
      property.id = response.property_id || '';
      property.reference = response.property_string || '';

      model.properties.push(property);
    }

    // Promotion
    if (response.promotion_id) {

      const promotion = new PromotionModel();
      promotion.id = response.promotion_id || '';
      promotion.reference = response.promotion_string || '';

      model.promotions.push(promotion);
    }

    // Agency
    model.agency.id = response.agency_id || '';

    // Created contact
    model.createContact.id = response.created_by_id || '';

    // Updated contact
    model.updateContact.id = response.updated_by_id || '';

    return model;
  }

  /**
   * Handle a save() request parameters and return a formatted request
   */
  private saveRequest(model: LeadModel): LeadSaveRequestInterface {

    const request: LeadSaveRequestInterface = {
      lead_id: model.id,
      lead_contact_need_validation: model.isNeedValidation === true ? '1' : '0',
      lead_date: [this.helperService.dateToString(model.contactDate), model.contactTime].join(' '),
      contact: [model.contact.fullName, model.contact.emails[0] && model.contact.emails[0].emailId].join(' - '),
      lead_contact_value: model.isNeedValidation ? '' : model.contact.id,
      property: model.properties.map(property => property.reference),
      lead_property_value: model.properties.map(property => property.id),
      lead_promotion_value: model.promotions.map(promotion => promotion.id),
      lead_managed_by: model.broker.id,
      main_lead_source: model.sourceId,
      sub_lead_source: model.subSourceId,
      lead_type: model.typeId,
      lead_original_communication_mean: model.mediaId,
      lead_status: model.statusId,
      message: model.contactMessage || '',
      lead_management_date: model.manageDate ? [this.helperService.dateToString(model.manageDate), model.manageTime].join(' ') : '',
      lead_management_communication_mean: model.managementMediaId || '',
      notes: model.brokerNotes || '',
    };

    // Key is required in all requests
    request.lead_property_value = request.lead_property_value.length === 0 ? [''] : request.lead_property_value;
    request.lead_promotion_value = request.lead_promotion_value.length === 0 ? [''] : request.lead_promotion_value;

    return request;
  }

  /**
   * Returns generated contact model
   */
  private validationContactFactory(contact: LeadValidationContactInterface): ContactModel {

    const contactModel = new ContactModel();

    contactModel.id = contact.id;
    contactModel.fullName = (contact.name || '').trim();
    contactModel.isArchived = contact.is_archived;
    contactModel.matchBy = contact.match_by;

    // Email
    (contact.emails || []).forEach(email => {

      const emailModel = new ContactEmailModel();
      emailModel.emailId = email;
      contactModel.emails.push(emailModel);
    });

    // Phones
    (contact.phones || []).forEach(phone => {

      const phoneModel = new ContactPhoneModel();
      phoneModel.number = phone.value;

      if (phone.type_id === PhoneTypeEnum.mobile) {

        contactModel.mobiles.push(phoneModel);
      } else if (phone.type_id === PhoneTypeEnum.landline) {

        contactModel.landlines.push(phoneModel);
      } else if (phone.type_id === PhoneTypeEnum.fax) {

        contactModel.faxes.push(phoneModel);
      }
    });

    // Address
    const addressModel = new ContactAddressModel();
    addressModel.line1 = contact.address.line1 || '';
    addressModel.line2 = contact.address.line2 || '';
    addressModel.line3 = contact.address.line3 || '';
    addressModel.city = contact.address.city || '';
    addressModel.zipCode = contact.address.zipcode || '';
    addressModel.countryLabel = contact.address.country || '';
    contactModel.addresses.push(addressModel);

    return contactModel;
  }

  /**
   * Handle a loadValidation() response and return LeadContactValidationInterface
   */
  private loadValidationResponse(response: LeadValidationLoadResponseInterface): LeadContactValidationInterface {

    const contactValidation: LeadContactValidationInterface = {
      contact: null,
      matchingContacts: [],
    };

    if (!response || !response.success) {

      return contactValidation;
    }

    // Lead contact
    contactValidation.contact = this.validationContactFactory(response.contact);

    // Matching contacts
    (response.found_contacts || []).forEach(contact => {

      const contactModel = this.validationContactFactory(contact);

      contactValidation.matchingContacts.push(contactModel);
    });

    return contactValidation;
  }

  /**
   * Handle a saveValidation() response and return a contact model
   */
  private saveValidationResponse(response: LeadValidationSaveResponseInterface): ContactModel {

    const contact = new ContactModel();

    if (!response.success) {

      return contact;
    }

    const segments = (response.selectedContactLabel || '').split(' - ');
    contact.id = response.selectedContactId;
    contact.fullName = segments[0];

    // Email
    if (segments[0]) {

      const email = new ContactEmailModel();
      email.emailId = segments[1];
      contact.emails.push(email);
    }

    return contact;
  }

  /**
   * Handle a subSources() response and return a list of lead subsources
   */
  private subSourcesResponse(response: LeadSubsourcesResponseInterface): OptionInterface[] {

    return (response.sources || []).map(s => ({ text: s.label, value: String(s.value) }));
  }
}
