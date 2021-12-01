import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/shared/helper.service';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { PortalModel } from '../../../shared/model/portal.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { PortalListRequestInterface } from './portal-list-request.interface';
import { PortalListResponseInterface } from './portal-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PortalSearchModel } from '../../../shared/model/portal-search.model';
import { PortalDetailsResponseInterface } from './portal-details-response.interface';
import { PortalSaveRequestInterface } from './portal-save-request.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { PortalAgencyDetailsResponseInterface } from './portal-agency-details-response.interface';
import { PortalDefaultsResponseInterface } from './portal-defaults-response.interface';

@Injectable()
export class PortalApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List portals
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PortalSearchModel,
  ): Observable<ModelListInterface<PortalModel>> {

    return this
      .httpService
      .post<PortalListRequestInterface, PortalListResponseInterface>(
        ApiEndpointEnum.portalList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PortalSearchModel,
  ): PortalListRequestInterface {

    const request = <PortalListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    return request;
  }

  /**
   * Handle a list() response and return a list of portal models
   */
  private listResponse(response: PortalListResponseInterface): ModelListInterface<PortalModel> {

    return {
      models: response.data.map((data, i) => {

        const item = new PortalModel();

        item.id = (data.DT_RowId || '').replace('gateway_', '');
        item.name = data.gateway;
        item.index = data.index;
        item.isActivePortal = data.is_active_gateway_flag;
        item.label = data.label;
        item.language = data.language;
        item.languageCode = data.language_code;
        item.lastExecutionEndDate = this.helperService.stringToDate(data.last_execution_end_datetime);
        item.lastExecutionStartDate = this.helperService.stringToDate(data.last_execution_start_datetime);
        item.lastMessage = data.last_message || '';
        item.lastStatus = data.last_status ? parseInt(data.last_status, 10) : 0;
        item.maxPictures = parseInt(data.max_pictures, 10);
        item.isActiveTransfer = !data.transfer_inactive;

        return item;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Load portal details
   */
  loadDetails(id: string): Observable<PortalDetailsResponseInterface> {

    return this.httpService.get<{}, PortalDetailsResponseInterface>(
      ApiEndpointEnum.portalDetails,
      null,
      { id: ['gateway', id].join('_') },
      true,
    );
  }

  /**
   * Load portal feed
   */
  loadFeed(id: string): Observable<string> {

    return this.httpService.get<{}, {success: boolean, feed: string}>(
      ApiEndpointEnum.portalFeed,
      null,
      { id: ['gateway', id].join('_') },
      true,
    ).pipe(
      map(response => response.feed),
    );
  }

  /**
   * Load agency details
   */
  loadAgencyDetails(): Observable<PortalAgencyDetailsResponseInterface> {

    return this.httpService.get<null, PortalAgencyDetailsResponseInterface>(
      ApiEndpointEnum.portalAgencyDetails,
    );
  }

  /**
   * Load default configuration for ID
   */
  loadDefaults(id: string): Observable<PortalDefaultsResponseInterface> {

    return this.httpService.get<null, PortalDefaultsResponseInterface>(
      ApiEndpointEnum.portalDefaults,
      null,
      { id: id },
      true,
    );
  }

  /**
   * Save portal
   */
  save(model: PortalModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<PortalSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.portalSave,
        this.saveRequest(model),
        null,
        true,
      );
  }

  /**
   * Handle a save() request parameters and return a formatted request
   */
  private saveRequest(model: PortalModel): PortalSaveRequestInterface {

    const request: PortalSaveRequestInterface = {

      // General
      agency_gateway_id: model.agencyPortalId,
      agency_website_id: model.agencyWebsiteId || '',
      gateway: model.portalId,
      gateway_type: model.type,
      gateway_with_credentials: model.isWithCredentials,
      gateway_default_max_pictures: String(model.defaultMaxPictures),
      gateway_label: model.label,
      language: model.languageCode,
      max_pictures: String(model.maxPictures),
      sender: model.sender,
      publication: model.publicationSites,
      image_to_be_transferred: model.imageToBeTransfered,
      send_lead_copy: model.sendLeadCopy,

      // Marketing
      marketing_monthly: String(model.marketingMonthly),
      marketing_price: String(model.marketingPrice),

      // Agency
      gateway_agency_id: model.agency.id,
      gateway_agency_name: model.agency.name,
      gateway_agency_email_rentals: model.agency.emailRentals,
      gateway_agency_email_sales: model.agency.emailSales,
      gateway_agency_phone_rentals: model.agency.phoneRentals,
      gateway_agency_phone_sales: model.agency.phoneSales,
      gateway_agency_city: model.agency.city,
      gateway_agency_country: model.agency.countryId,
      gateway_agency_street: model.agency.mainAddress,
      gateway_agency_zip: model.agency.zipCode,
      gateway_agency_fax: model.agency.fax,
      gateway_agency_reference: model.agency.name,

      // FTP
      ftp_attempts: model.ftpAttempts,
      ftp_data_folder_hidden: model.ftpDataFolder || '',
      ftp_docs_folder_hidden: model.ftpDocsFolder || '',
      ftp_images_folder_hidden: model.ftpImagesFolder || '',
      ftp_movies_folder_hidden: model.ftpMoviesFolder || '',
      ftp_host: model.ftpHost || '',
      ftp_port: model.ftpPort,
      ftp_login: model.ftpLogin || '',
      ftp_password: model.ftpPassword || '',
      ftp_pasv: parseInt(model.ftpPasv, 10),
      ftp_timeout: model.ftpTimeout,
    };

    /**
     * Optional boolean-like. 1 => true, 0 => false
     * but since backend checks for param existence, not for it's value
     * false-like parameters must be not set
     */

    if (model.ftpIsActive) {

      request.is_active_ftp = 1;
    }

    if (model.isActivePortal) {

      request.is_active_gateway = 1;
    }

    if (model.isActiveMarketingExpense) {

      request.is_marketing_gateway = 1;
    }

    if (model.topListing) {

      request.top_listing = 1;
    }

    if (model.sendLeadCopySales) {

      request.send_lead_copy_sales = 1;
    }

    if (model.sendLeadCopyRentals) {

      request.send_lead_copy_rentals = 1;
    }

    if (model.sendBrokerPhone) {

      request.send_broker_phone = 1;
    }

    if (model.sendEmptyFile) {

      request.send_empty_file = 1;
    }

    return request;
  }

}
