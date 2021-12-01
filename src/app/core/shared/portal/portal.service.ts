import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BrowserService } from '../browser/browser.service';
import { TrackerService } from '../tracker/tracker.service';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PortalModel } from '../../../shared/model/portal.model';
import { StateInterface } from '../../../core-store/state.interface';
import { PortalApiService } from '../../../api/shared/portal/portal-api.service';
import { selectDataPortal } from '../../../core-store/data-portal/selectors';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PortalSearchModel } from '../../../shared/model/portal-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { PortalConfig } from './portal.config';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { AgencyModel } from '../../../shared/model/agency.model';
import { PortalEnum } from '../../../shared/enum/portal.enum';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';

@Injectable()
export class PortalService extends ModelServiceAbstract<PortalModel> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected portalApiService: PortalApiService,
    protected browserService: BrowserService,
    protected trackerService: TrackerService,
    protected moduleConfig: PortalConfig,
    private runtimeService: RuntimeService,
    private legacyParserService: LegacyParserService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): PortalModel {

    return new PortalModel();
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<PortalModel|null> {

    return this.store$.select(selectDataPortal(id));
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PortalSearchModel,
  ): Observable<ModelListInterface<PortalModel>> {

    return this.portalApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  load(id: string): Observable<PortalModel> {

    return zip(
      this.portalApiService.loadDetails(id),
      this.portalApiService.loadFeed(id),
    ).pipe(
      map(([detailsResponse, feed]) => {

        const details  = detailsResponse.agency_gateway.values;

        const model = new PortalModel();

        // ID
        model.id = id;

        // General
        model.feedPreview = feed;
        model.portalId = <PortalEnum>details.gateway;
        model.agencyWebsiteId = details.agency_website_id || '';
        model.type = details.gateway_type;
        model.isWithCredentials = details.gateway_with_credentials;
        model.maxPictures = parseInt(details.max_pictures, 10);
        model.publicationSites = details.publication;
        model.defaultMaxPictures = parseInt(details.gateway_default_max_pictures, 10);
        model.agencyPortalId = details.agency_gateway_id;
        model.languageCode = details.language;
        model.label = details.label;
        model.imageToBeTransfered = details.image_to_be_transferred;
        model.isActivePortal = details.is_active_gateway === 1 ? true : false;
        model.lastStatus = details.last_status ? parseInt(details.last_status, 10) : 0;

        // FTP settings
        model.ftpHost = details.ftp_host;
        model.ftpPort = details.ftp_port;
        model.ftpDataFolder = details.ftp_data_folder;
        model.ftpDocsFolder = details.ftp_docs_folder;
        model.ftpImagesFolder = details.ftp_images_folder;
        model.ftpMoviesFolder = details.ftp_movies_folder;
        model.ftpAttempts = details.ftp_attempts;
        model.ftpTimeout = details.ftp_timeout;
        model.ftpLogin = details.ftp_login;
        model.ftpPassword = details.ftp_password;
        model.ftpIsActive = details.is_active_ftp === 0 ? false : true;
        model.ftpPasv = details.ftp_pasv;

        // Agency settings
        model.agency.id = details.gateway_agency_id;
        model.agency.name = details.gateway_agency_reference || details.gateway_agency_name;
        model.agency.city = details.gateway_agency_city;
        model.agency.countryId = details.gateway_agency_country;
        model.agency.phoneRentals = details.gateway_agency_phone_rentals;
        model.agency.phoneSales = details.gateway_agency_phone_sales;
        model.agency.fax = details.gateway_agency_fax;
        model.agency.emailRentals = details.gateway_agency_email_rentals || '';
        model.agency.emailSales = details.gateway_agency_email_sales || '';
        model.agency.mainAddress = details.gateway_agency_street;
        model.agency.zipCode = details.gateway_agency_zip;

        // Marketing
        model.isActiveMarketingExpense = details.is_marketing_gateway === 0 ? false : true;
        model.marketingMonthly = parseFloat(details.marketing_monthly || '0');
        model.marketingPrice = parseFloat(details.marketing_price || '0');

        // Sender
        model.sender = details.sender;
        model.sendBrokerPhone = details.send_broker_phone === 0 ? false : true;
        model.sendLeadCopy = (details.send_lead_copy) ?  `${details.send_lead_copy}` : '1';
        model.sendLeadCopySales = details.send_lead_copy_sales === 0 ? false : true;
        model.sendLeadCopyRentals = details.send_lead_copy_rentals === 0 ? false : true;
        model.sendEmptyFile = details.send_empty_file === 0 ? false : true;
        model.topListing = details.top_listing === 0 ? false : true;

        return model;
      }),
    );
  }

  /**
   * Load agency details
   */
  loadAgencyDetails(): Observable<AgencyModel> {

    return this
      .portalApiService
      .loadAgencyDetails()
      .pipe(
        map(response => {

          const model = new AgencyModel();

          if (!response || !response.gateway) {

            return model;
          }

          model.name = response.gateway.gateway_agency_name;
          model.phoneSales = response.gateway.gateway_agency_phone_sales;
          model.phoneRentals = response.gateway.gateway_agency_phone_rentals;
          model.emailSales = response.gateway.gateway_agency_email_sales || '';
          model.emailRentals = response.gateway.gateway_agency_email_rentals || '';
          model.mainAddress = response.gateway.gateway_agency_street;
          model.zipCode = response.gateway.gateway_agency_zip;
          model.city = response.gateway.gateway_agency_city;
          model.countryId = response.gateway.gateway_agency_country;

          return model;
        }),
      );
  }

  /**
   * Load default configuration for portal ID
   */
  loadDefaults(portal: PortalModel, portalId: PortalEnum): Observable<PortalModel> {

    return zip(
      this.portalApiService.loadDefaults(portalId),
      this.runtimeService.selectOptions(),
    ).pipe(
      map(([response, options]) => {

        const model = portal.clone<PortalModel>();

        model.portalId = portalId;
        model.agency.id = '';

        if (!response || !response.gateway) {

          return model;
        }

        const option = options.portalList.find(opt => opt.value === portalId);

        model.label = option ? option.text : '';
        model.type = response.gateway.gateway_type;
        model.sender = response.gateway.sender;
        model.defaultMaxPictures = parseInt(response.gateway.gateway_max_pictures, 10);
        model.maxPictures = model.defaultMaxPictures;
        model.imageToBeTransfered = parseInt(response.gateway.image_to_be_transferred, 10);
        model.ftpHost = response.gateway.gateway_ftp_host;
        model.ftpPort = response.gateway.gateway_ftp_port;
        model.ftpTimeout = response.gateway.gateway_ftp_timeout;
        model.ftpAttempts = response.gateway.gateway_ftp_attempts;
        model.ftpLogin = response.gateway.gateway_ftp_login;
        model.ftpPassword = response.gateway.gateway_ftp_passw;
        model.ftpPasv = response.gateway.gateway_ftp_pasv;
        model.ftpDataFolder = response.gateway.gateway_ftp_data_folder;
        model.ftpImagesFolder = response.gateway.gateway_ftp_images_folder;
        model.ftpMoviesFolder = response.gateway.gateway_ftp_movies_folder;
        model.ftpDocsFolder = response.gateway.gateway_ftp_docs_folder;
        model.isWithCredentials = !model.ftpLogin;

        return model;
      }),
    );
  }

  /**
   * @inheritDoc
   */
  save(model: PortalModel): Observable<ModelSaveInterface> {

    return this
      .portalApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }
}
