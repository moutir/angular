import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { MlsSearchModel } from '../../../shared/model/mls-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { MlsModel } from '../../../shared/model/mls.model';
import { LegacyListResponseInterface } from '../../format/legacy/response/legacy-list-response.interface';
import { LegacyApiServiceAbstract } from '../../format/legacy/legacy-api-service.abstract';
import { MlsListRequestInterface } from './mls-list-request.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { AgencyModel } from '../../../shared/model/agency.model';
import { MlsAgencyProfileResponseInterface } from './mls-agency-profile-response.interface';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { ContactSocialModel } from '../../../shared/model/contact-social.model';
import { DocumentModel } from '../../../shared/model/document.model';
import { ContactModel } from '../../../shared/model/contact.model';
import { MlsOperationResponseInterface } from './mls-operation-response.interface';
import { LegacyAgencyDataInterface } from '../../format/legacy/data/legacy-agency-data.interface';
import { LegacyMlsHydrator } from '../../format/legacy/data/legacy-mls.hydrator';
import { LegacyAgencyHydrator } from '../../format/legacy/data/legacy-agency.hydrator';
import { LegacyMlsDataInterface } from '../../format/legacy/data/legacy-mls-data.interface';

@Injectable()
export class MlsApiService extends LegacyApiServiceAbstract {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private legacyMlsHydrator: LegacyMlsHydrator,
    private legacyAgencyHydrator: LegacyAgencyHydrator,
  ) {

    super();
  }

  /**
   * List mls
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MlsSearchModel,
  ): Observable<ModelListInterface<MlsModel>> {

    const request = <MlsListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.partnerAgencyId) {

      request.partner_agency_id = filters.partnerAgencyId;
    }

    return this
      .httpService
      .get<MlsListRequestInterface, LegacyListResponseInterface<LegacyMlsDataInterface>>(
        ApiEndpointEnum.mlsList,
        request,
        null,
        true,
      )
      .pipe(
        map(response => {

          return {
            models: response.data.map(data => this.legacyMlsHydrator.hydrateModel(data)),
            total: response.total,
          };
        }),
      );
  }

  /**
   * Load mls
   */
  load(id: string): Observable<MlsModel> {

    return this
      .httpService
      .get<null, LegacyMlsDataInterface>(
        ApiEndpointEnum.mlsLoad,
        null,
        { id: id },
        true,
      ).pipe(
        map(response => this.legacyMlsHydrator.hydrateModel(response)),
      );
  }

  /**
   * Load agency profile
   *
   * @deprecated TODO[later] Remove this horrible duplicated function and implement+consume instead AgencyService.load()
   */
  loadAgencyProfile(id: string): Observable<AgencyModel> {

    return this
      .httpService
      .post<null, MlsAgencyProfileResponseInterface>(
        ApiEndpointEnum.mlsLoadAgencyProfile,
        null,
        { id: id },
      ).pipe(
        map(response => this.loadAgencyProfileResponse(response)),
      );
  }

  /**
   * List agencies
   *
   * @deprecated TODO[later] Remove this horrible duplicated function and implement+consume instead AgencyService.list()
   */
  listAgencies(): Observable<AgencyModel[]> {

    return this
      .httpService
      .get<null, LegacyListResponseInterface<LegacyAgencyDataInterface>>(
        ApiEndpointEnum.mlsListAgencies,
        null,
        null,
      ).pipe(
        map(response => {

          const agencies = [];

          if (!response || !response.data) {

            return agencies;
          }

          return response.data.map(agencyData => this.legacyAgencyHydrator.hydrateModel(agencyData));
        }),
      );
  }

  /**
   * Accept partnership invitation
   */
  acceptInvitation(model: MlsModel): Observable<boolean> {

    return this
      .httpService
      .post<null, MlsOperationResponseInterface>(
        ApiEndpointEnum.mlsAcceptInvitation,
        null,
        { id: model.id },
      ).pipe(
        map(response => !!response.success),
      );
  }

  /**
   * Reject partnership invitation
   */
  rejectInvitation(model: MlsModel): Observable<boolean> {

    return this
      .httpService
      .post<null, MlsOperationResponseInterface>(
        ApiEndpointEnum.mlsRejectInvitation,
        null,
        { id: model.id },
      ).pipe(
        map(response => !!response.success),
      );
  }

  /**
   * Send a partnership invite
   */
  sendInvite(model: MlsModel): Observable<boolean> {

    return this
      .httpService
      .post<null, MlsOperationResponseInterface>(
        ApiEndpointEnum.mlsSendInvite,
        null,
        { agencyId: model.partnerAgency.id },
      ).pipe(
        map(response => !!response.success),
      );
  }

  /**
   * Uninvite
   */
  uninvite(model: MlsModel): Observable<boolean> {

    return this
      .httpService
      .post<null, MlsOperationResponseInterface>(
        ApiEndpointEnum.mlsUninvite,
        null,
        { id: model.id },
      ).pipe(
        map(response => !!response.success),
      );
  }

  /**
   * Terminate partnership
   */
  terminate(model: MlsModel): Observable<boolean> {

    return this
      .httpService
      .post<null, MlsOperationResponseInterface>(
        ApiEndpointEnum.mlsTerminate,
        null,
        { partnershipId: model.id, agencyId: model.partnerAgency.id },
      ).pipe(
        map(response => !!response.success),
      );
  }

  /**
   * Handle a loadAgencyProfile() response and return an Agency model
   */
   private loadAgencyProfileResponse(response: MlsAgencyProfileResponseInterface): AgencyModel {

    const agency = new AgencyModel();

    agency.id = response.agency_id;
    agency.isActive = response.agency_is_active === '1';
    agency.name = response.agency_name;
    agency.administrator = response.agency_administrator;
    agency.founder = response.agency_founder;
    agency.foundingYear = response.agency_foundation_year;
    agency.description = (response.agency_profile || '').trim();
    agency.branches = response.agency_branches;
    agency.president = response.agency_ceo;
    agency.saleListingCount = Number(response.sales_listings);
    agency.rentalListingCount = Number(response.rental_listings);
    agency.saleSearchCount = Number(response.sales_searches);
    agency.rentalSearchCount = Number(response.rental_searches);
    agency.director = response.agency_director;
    agency.employeeCount = response.agency_employee;
    agency.headQuarters = response.agency_headquarter;
    agency.logo = new DocumentModel();
    agency.logo.photoSmallURL = response.agency_logo;
    agency.isShownStatisticsOnMls = response.show_statistics;
    agency.isAllowedSendMLSInvite = response.show_invitation_button === true;
    agency.isLoading = false;

    // Landline
    if (response.agency_phone) {

      const phoneModel = new ContactPhoneModel();
      phoneModel.number = response.agency_phone;
      agency.landlines.push(phoneModel);
    }

    // Email
    if (response.agency_email) {

      const emailModel = new ContactEmailModel();
      emailModel.emailId = response.agency_email;
      agency.emails.push(emailModel);
    }

    // Address
    const addressModel = new ContactAddressModel();
    addressModel.line1 = response.agency_line1 || '';
    addressModel.line2 = response.agency_line2 || '';
    addressModel.line3 = response.agency_line3 || '';
    addressModel.zipCode = response.agency_zip;
    addressModel.city = response.agency_city;
    agency.addresses.push(addressModel);

    // Social media
    Object.keys(response.social_media_links).forEach(media => {

      if (response.social_media_links[media] === 'null') {

        return;
      }

      const social = new ContactSocialModel();
      social.network = media;
      social.url = response.social_media_links[media];

      agency.socials.push(social);
    });

    // Team
    [...response.agency_contacts1, ...response.agency_contacts2].forEach(contact => {

      const contactModel = new ContactModel();
      const emailModel = new ContactEmailModel();
      const phoneModel = new ContactPhoneModel();

      contactModel.firstName = contact.firstname;
      contactModel.lastName = contact.lastname;
      contactModel.fullName = contactModel.getFullName();
      contactModel.profession = contact.position;
      contactModel.photoURL = contact.avatar || '';
      emailModel.emailId = contact.email;
      phoneModel.number = contact.phone;

      contactModel.landlines.push(phoneModel);
      contactModel.emails.push(emailModel);

      agency.contacts.push(contactModel);
    });

    return agency;
  }
}
