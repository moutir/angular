import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { SummaryByIdResponseInterface } from './summary-by-id-response.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PromotionListResponseInterface } from './promotion-list-response.interface';
import { PromotionListRequestInterface } from './promotion-list-request.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { PromotionArchiveResponseInterface } from './promotion-archive-response.interface';
import { PromotionArchiveRequestInterface } from './promotion-archive-request.interface';
import { PromotionUnarchiveRequestInterface } from './promotion-unarchive-request.interface';
import { PromotionUnarchiveResponseInterface } from './promotion-unarchive-response.interface';
import { PromotionRemoveMlsResponseInterface } from './promotion-remove-mls-response.interface';
import { PromotionRemoveMlsRequestInterface } from './promotion-remove-mls-request.interface';
import { PromotionFiltersDecoratorInterface } from './promotion-filters-decorator.interface';
import { PromotionIdsRequestInterface } from './promotion-ids-request.interface';
import { PromotionIdsResponseInterface } from './promotion-ids-response.interface';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { PhoneTypeEnum } from '../../../shared/enum/phone-type.enum';

@Injectable()
export class PromotionApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List promotions
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PromotionSearchModel,
  ): Observable<ModelListInterface<PromotionModel>> {

    return this
      .httpService
      .post<PromotionListRequestInterface, PromotionListResponseInterface>(
        ApiEndpointEnum.promotionList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * List IDs only matching the search
   */
  ids(filters: PromotionSearchModel): Observable<string[]> {

    return this
      .httpService
      .post<PromotionIdsRequestInterface, PromotionIdsResponseInterface>(
        ApiEndpointEnum.promotionIds,
        this.idsRequest(filters),
        null,
        true,
      )
      .pipe(
        map(response => this.idsResponse(response)),
      );
  }

  /**
   * Load summary
   */
  summary(id: string): Observable<PromotionModel> {

    return this
      .httpService
      .get<null, SummaryByIdResponseInterface>(ApiEndpointEnum.promotionSummaryById, null, { id })
      .pipe(
        map(response => this.summaryResponse(response)),
      );
  }

  /**
   * Archive promotions identified by IDs
   */
  archive(promotionIds: string[]): Observable<PromotionArchiveResponseInterface> {

    const request: PromotionArchiveRequestInterface = {
      promotion_ids: promotionIds,
      archived: 1,
    };

    return this
      .httpService
      .post<PromotionArchiveRequestInterface, PromotionArchiveResponseInterface>(
        ApiEndpointEnum.promotionArchive,
        request,
        null,
        true,
      );
  }

  /**
   * Unarchive promotions identified by IDs
   */
  unarchive(promotionIds: string[]): Observable<PromotionUnarchiveResponseInterface> {

    const request: PromotionUnarchiveRequestInterface = {
      promotion_ids: promotionIds,
      archived: 0,
    };

    return this
      .httpService
      .post<PromotionUnarchiveRequestInterface, PromotionUnarchiveResponseInterface>(
        ApiEndpointEnum.promotionUnarchive,
        request,
        null,
        true,
      );
  }

  /**
   * Remove promotions from MLS
   */
  removeMls(promotionIds: string[]): Observable<PromotionRemoveMlsResponseInterface> {

    const request: PromotionRemoveMlsRequestInterface = {
      items: promotionIds.map(promotionId => 'promotion_' + promotionId),
    };

    return this
      .httpService
      .post<PromotionRemoveMlsRequestInterface, PromotionRemoveMlsResponseInterface>(
        ApiEndpointEnum.promotionRemoveMls,
        request,
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
    filters: PromotionSearchModel,
  ): PromotionListRequestInterface {

    return this.filtersDecorator<PromotionListRequestInterface>(
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
   * Handle an ids() request parameters and return a formatted request
   */
  private idsRequest(filters: PromotionSearchModel): PromotionIdsRequestInterface {

    return this.filtersDecorator<PromotionIdsRequestInterface>(
      {
        format: 'numeric',
      },
      filters,
    );
  }

  /**
   * Handle an ids() response and return a string[]
   */
  private idsResponse(response: PromotionIdsResponseInterface): string[] {

    return response.map(r => r.id.split('_')[1]);
  }

  /**
   * Return a decorated version of the request with filters
   */
  private filtersDecorator<R extends PromotionFiltersDecoratorInterface>(request: R, filters: PromotionSearchModel): R {

    request.archived = filters.isArchive01 === '1' ? '1' : '0';

    if (filters.promotionIds && filters.promotionIds.length > 0) {

      // Location and promotion filters are extracted from 'promotionIds'
      filters.promotionIds.forEach(id => {

        if (id.indexOf('_') > -1) {

          request.location = request.location || [];

          request.location.push(id);
        } else {

          request.promotion_ids = request.promotion_ids || [];

          request.promotion_ids.push(id);
        }
      });
    }

    if (filters.contactId) {

      request.contact_id = filters.contactId;
    }

    if (filters.statusIds && filters.statusIds.length > 0) {

      request.statuses = filters.statusIds;
    }

    if (filters.agencyId) {

      request.agency_id = filters.agencyId;
    }

    if (filters.customAttributeIds && filters.customAttributeIds.length > 0) {

      request.custom_attribute = filters.customAttributeIds;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of promotion models
   */
  private listResponse(response: PromotionListResponseInterface): ModelListInterface<PromotionModel> {

    return {
      models: response.data.map((data, i) => {

        const promotion = new PromotionModel();

        promotion.id = data.id;
        promotion.name = data.name;
        promotion.reference = data.reference;
        promotion.photoSmallURL = data.photo && data.photo.photo_thumb &&
          data.photo.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ? data.photo.photo_thumb : '';
        promotion.photoLargeURL = data.photo && data.photo.photo_zoom &&
          data.photo.photo_zoom.indexOf('/rf_default_property.jpg') === -1 ? data.photo.photo_zoom : '';
        promotion.location.label = data.location || '';
        promotion.isFromMyAgency = data.DT_RowClass === 'fromMyAgency';
        promotion.isBlacklisted = data.details_visible === false;
        promotion.notes = data.broker_notes;
        promotion.constructionStartDate = this.helperService.stringToDate(data.date_start_construction_work2);
        promotion.constructionEndDate = this.helperService.stringToDate(data.date_end_construction_work2);
        promotion.propertyPrice = data.price;
        promotion.propertyPriceSold = data.price_sold;
        promotion.propertyTotalCount = data.number_of_properties;
        promotion.propertySoldCount = data.number_of_properties_sold;
        promotion.propertyReservedCount = data.number_of_properties_reserved;

        if (data.project_manager) {

          promotion.broker.id = data.project_manager_id;
          promotion.broker.fullName = data.project_manager.name;
          promotion.broker.emails = [new ContactEmailModel()];
          promotion.broker.emails[0].emailId = data.project_manager.email;

          (data.project_manager.phones || []).forEach(ph => {

            const bph = new ContactPhoneModel();
            bph.number = ph;
            promotion.broker.mobiles.push(bph);
          });
        }

        return promotion;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a summary() response and return a PromotionModel
   */
  private summaryResponse(response: SummaryByIdResponseInterface): PromotionModel {

    const promotion = new PromotionModel();

    promotion.id = response.id;
    promotion.name = response.name;
    promotion.location.label = response.location;
    promotion.address1 = response.address_line1;
    promotion.address2 = response.address_line2;
    promotion.address3 = response.address_line3;

    if (response.properties) {

      promotion.propertyPrice = (response.properties.price || '').toString();
      promotion.propertyPriceFrom = response.properties.price_from;
      promotion.propertyPriceSold = (response.properties.price_sold || '').toString();
      promotion.propertyTotalCount = response.properties.num_of_properties;
      promotion.propertySoldCount = response.properties.sold;
      promotion.propertyReservedCount = response.properties.reserved;
      promotion.propertyAvailableCount = promotion.propertyTotalCount - promotion.propertySoldCount - promotion.propertyReservedCount;
    }

    if (response.broker) {

      const contactModel = new ContactModel();

      contactModel.firstName = response.broker.firstname || '';
      contactModel.lastName = response.broker.lastname || '';
      contactModel.fullName = [contactModel.firstName, contactModel.lastName].join(' ').trim();
      contactModel.agency.name = response.broker.agency_name || '';

      (response.broker.emails || []).forEach(e => {

        const email = new ContactEmailModel();
        email.emailId = e;

        contactModel.emails.push(email);
      });

      (response.broker.phones || []).forEach(p => {

        const phone = new ContactPhoneModel();
        phone.number = p.number;

        if (p.type === PhoneTypeEnum.mobile) {

          contactModel.mobiles.push(phone);
        } else if (p.type === PhoneTypeEnum.landline) {

          contactModel.landlines.push(phone);
        }
      });

      promotion.broker = contactModel;
    }

    return promotion;
  }
}
