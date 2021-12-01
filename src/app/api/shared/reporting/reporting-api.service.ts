import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/shared/helper.service';
import { ReportingSearchModel } from '../../../shared/model/reporting-search.model';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { ReportingModel } from '../../../shared/model/reporting.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PropertyModel } from '../../../shared/model/property.model';
import { ContactModel } from '../../../shared/model/contact.model';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { ReportingListRequestInterface } from './reporting-list-request.interface';
import { ReportingListResponseInterface } from './reporting-list-response.interface';
import { ReportingStatusRequestInterface } from './reporting-status-request.interface';
import { ReportingStatusResponseInterface } from './reporting-status-response.interface';
import { ReportingStatusEnum } from '../../../shared/enum/reporting-status.enum';

@Injectable()
export class ReportingApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List reportings
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ReportingSearchModel,
  ): Observable<ModelListInterface<ReportingModel>> {

    return this
      .httpService
      .post<ReportingListRequestInterface, ReportingListResponseInterface>(
        ApiEndpointEnum.reportingList,
        this.listRequest(pagination, sort, filters),
        {
          type: filters.reportType,
        },
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Update status to accepted
   */
  accept(reportIds: string[]): Observable<ReportingModel[]> {

    const request: ReportingStatusRequestInterface = {
      action: 'accept',
      reportIds,
    };

    return this
      .httpService
      .post<ReportingStatusRequestInterface, ReportingStatusResponseInterface>(
        ApiEndpointEnum.reportingStatus,
        request,
        null,
      ).pipe(
        map(response => this.statusResponse(ReportingStatusEnum.accept, response)),
      );
  }

  /**
   * Update status to rejected
   */
  reject(reportIds: string[]): Observable<ReportingModel[]> {

    const request: ReportingStatusRequestInterface = {
      action: 'reject',
      reportIds,
    };

    return this
      .httpService
      .post<ReportingStatusRequestInterface, ReportingStatusResponseInterface>(
        ApiEndpointEnum.reportingStatus,
        request,
        null,
      ).pipe(
        map(response => this.statusResponse(ReportingStatusEnum.reject, response)),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: ReportingSearchModel,
  ): ReportingListRequestInterface {

    const request = <ReportingListRequestInterface>{
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
    };

    if (filters.propertyIds && filters.propertyIds.length > 0) {

      // Weird logic yes, but location and property filters are managed by this attribute...
      request.property = filters.propertyIds.map(id => id.indexOf('_') > -1 ? id : 'property_' + id);
    }

    if (filters.contactId) {

      request.contact = filters.contactId;
    }

    if (filters.isDirectTransaction01 || filters.isDirectTransaction01 === '0') {

      request.direct_transaction = filters.isDirectTransaction01;
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {

      request.main_category = filters.categoryIds;
    }

    if (filters.prices && filters.prices.length > 0) {

      request.price = filters.prices;
    }

    if (filters.bedrooms && filters.bedrooms.length > 0) {

      request.bedrooms = filters.bedrooms;
    }

    if (filters.rooms && filters.rooms.length > 0) {

      request.rooms = filters.rooms;
    }

    if (filters.livingArea && filters.livingArea.length > 0) {

      request.living_area = filters.livingArea;
    }

    if (filters.landArea && filters.landArea.length > 0) {

      request.land_area = filters.landArea;
    }

    if (filters.positionIds && filters.positionIds.length > 0) {

      request.position = filters.positionIds;
    }

    if (filters.viewIds && filters.viewIds.length > 0) {

      request.view = filters.viewIds;
    }

    if (filters.publicationStatusId) {

      request.publication_status = filters.publicationStatusId;
    }

    if (filters.publicationIds && filters.publicationIds.length > 0) {

      request.publication = filters.publicationIds;
    }

    if (filters.visibilityId) {

      request.visibility = filters.visibilityId;
    }

    if (filters.brokerIds && filters.brokerIds.length > 0) {

      request.broker = filters.brokerIds;
    }

    if (filters.propertyStatusIds && filters.propertyStatusIds.length > 0) {

      request.status = filters.propertyStatusIds;
    }

    if (filters.isPromotion01) {

      request.is_promotion = filters.isPromotion01;
    }

    if (filters.isSellToForeigner01) {

      request.sell_foreigner = filters.isSellToForeigner01;
    }

    if (filters.promotionIds && filters.promotionIds.length > 0) {

      request.promotion = filters.promotionIds;
    }

    if (filters.rankingIds && filters.rankingIds.length > 0) {

      request.ranking = filters.rankingIds;
    }

    if (filters.processStatusIds && filters.processStatusIds.length > 0) {

      request.report_status = filters.processStatusIds;
    }

    if (filters.processDateFrom) {

      request.report_data_from = this.helperService.dateToString(new Date(filters.processDateFrom));
    }

    if (filters.processDateTo) {

      request.report_data_to = this.helperService.dateToString(new Date(filters.processDateTo));
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of reporting process models
   */
  private listResponse(response: ReportingListResponseInterface): ModelListInterface<ReportingModel> {

    return {
      models: response.data.map((data, i) => {

        const reporting = new ReportingModel();

        reporting.id = data.id;
        reporting.createDate = this.helperService.stringToDate(data.report_created_at);
        reporting.fromDate = this.helperService.dateStringToDate(data.from_date);
        reporting.toDate = this.helperService.dateStringToDate(data.to_date);
        reporting.frequency = data.frequency;
        reporting.previewUrl = data.preview_url;
        reporting.processStatus = data.process_status;
        reporting.processDate = this.helperService.stringToDate(data.process_datetime);
        reporting.senderContactId = data.sender_contact_id;
        reporting.ownerBrokerId = data.owner_broker_id;

        if (data.property) {

          const property = new PropertyModel();

          property.id = data.property.id;
          property.reference = data.property.reference;
          property.labelStatus = data.property.status_label;
          property.labelCategory = data.property.category;
          property.labelSubcategory = data.property.subcategory;
          property.labelPrice = data.property.price;
          property.rooms = data.property.rooms;
          property.bedrooms = data.property.bedrooms;
          property.bathrooms = data.property.bathrooms;
          property.areaLiving = data.property.habitable;
          property.areaLand = data.property.land;
          property.ranking = parseInt(data.property.ranking, 10);
          property.agency.name = data.property.agency_name;
          property.areaUnit = data.property.area_unit;
          property.statusId = data.property.status_id;
          property.photoSmallURL = data.property.photo_thumb &&
            data.property.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ? data.property.photo_thumb : '';
          property.photoLargeURL = data.property.photo_zoom &&
            data.property.photo_zoom.indexOf('/rf_default_property.jpg') === -1 ? data.property.photo_zoom : '';
          property.location = {
            levels: [],
            label: data.property.location[0] || '',
            street: data.property.address || '',
            zipcode: '',
          };

          if (data.property.broker) {

            // Broker
            const broker = new ContactModel();
            broker.id = data.property.broker && data.property.broker.id;
            broker.initials = data.property.broker && data.property.broker.initials;
            property.broker = broker;
          }

          reporting.property = property;
        }

        // Recipients
        if (Array.isArray(data.recipients)) {

          reporting.recipients = data.recipients.map(recipient => {

            const contact = new ContactModel();
            contact.id = recipient.id;
            contact.initials = recipient.initials;

            return contact;
          });
        }

        // Process user
        if (data.process_user) {

          const user = new ContactModel();
          user.id = data.process_user && data.process_user.id;
          user.fullName = data.process_user && (data.process_user.fullname || '').trim();

          reporting.processUser = user;
        }

        return reporting;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle accept() OR reject() response and return a list of reporting process models
   */
  private statusResponse(
    action: ReportingStatusEnum,
    response: ReportingStatusResponseInterface,
  ): ReportingModel[] {

    const reportinges = [];

    if (response.data) {

      response.data.forEach(obj => {

        if (obj.success === true) {

          const reporting = new ReportingModel();

          reporting.id = obj.id;
          reporting.processStatus = action;
          reporting.processDate = new Date();

          reportinges.push(reporting);
        }
      });
    }

    return reportinges;
  }
}
