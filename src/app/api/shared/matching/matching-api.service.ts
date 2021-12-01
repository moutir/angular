import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { PropertyModel } from '../../../shared/model/property.model';
import { TypeEnum } from '../../../shared/enum/type.enum';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { MatchingModel } from '../../../shared/model/matching.model';
import { MatchingRefuseRequestInterface } from './matching-refuse-request.interface';
import { MatchingRefuseResponseInterface } from './matching-refuse-response.interface';
import { MatchingProcessResponseInterface } from './matching-process-response.interface';
import { MatchingProcessRequestInterface } from './matching-process-request.interface';
import { MatchingTransferRequestInterface } from './matching-transfer-request.interface';
import { MatchingTransferResponseInterface } from './matching-transfer-response.interface';
import { MatchingGroupProposalInterface } from '../../../shared/interface/matching-group-proposal.interface';
import { EmailContentModel } from '../../../shared/model/email-content.model';
import { MatchingSendRequestInterface } from './matching-send-request.interface';
import { MatchingSendResponseInterface } from './matching-send-response.interface';
import { MatchingSearchModel } from '../../../shared/model/matching-search.model';
import { MatchingListRequestInterface } from './matching-list-request.interface';
import { MatchingListResponseInterface } from './matching-list-response.interface';
import { MatchingIdsRequestInterface } from './matching-ids-request.interface';
import { MatchingIdsResponseInterface } from './matching-ids-response.interface';
import { MatchingFiltersDecoratorInterface } from './matching-filters-decorator.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { MatchingWaitingResponseInterface } from './matching-waiting-response.interface';
import { MatchingWaitingRequestInterface } from './matching-waiting-request.interface';

@Injectable()
export class MatchingApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List matchings
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MatchingSearchModel,
  ): Observable<ModelListInterface<MatchingModel>> {

    return this
      .httpService
      .get<MatchingListRequestInterface, MatchingListResponseInterface>(
        ApiEndpointEnum.matchingList,
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
  ids(filters: MatchingSearchModel): Observable<string[]> {

    return this
      .httpService
      .get<MatchingIdsRequestInterface, MatchingIdsResponseInterface>(
        ApiEndpointEnum.matchingIds,
        this.idsRequest(filters),
        null,
        true,
      )
      .pipe(
        map(response => this.idsResponse(response)),
      );
  }

  /**
   * Refuse list of matchings
   */
  refuse(matchings: MatchingModel[], isPermanent: boolean, comment: string): Observable<boolean> {

    return this
      .httpService
      .post<MatchingRefuseRequestInterface, MatchingRefuseResponseInterface>(
        ApiEndpointEnum.matchingRefuse,
        {
          match_id: this.extractMatchingIds(matchings),
          is_definite: isPermanent === true ? 1 : 0,
          comment: comment,
        },
        null,
        true,
      )
      .pipe(
        map(response => response.success),
      );
  }

  /**
   * Set matchings as waiting
   */
  wait(matchingIds: string[], comment: string): Observable<boolean> {

    const request: MatchingWaitingRequestInterface = {
      match_id: matchingIds,
      comment: comment,
    };

    return this
      .httpService
      .post<MatchingWaitingRequestInterface, MatchingWaitingResponseInterface>(
        ApiEndpointEnum.matchingWait,
        request,
        null,
        true,
      )
      .pipe(
        map(response => response.success),
      );
  }

  /**
   * Process list of matchings
   */
  process(matchings: MatchingModel[], methodId: string, date: string, comment: string): Observable<boolean> {

    const request: MatchingProcessRequestInterface = [{
      match_ids: this.extractMatchingIds(matchings),
      date: date,
      method_id: parseInt(methodId, 10),
      comment: comment,
    }];

    return this
      .httpService
      .post<string, MatchingProcessResponseInterface>(
        ApiEndpointEnum.matchingProcess,
        JSON.stringify(request),
        null,
        true,
      )
      .pipe(
        map(response => response.success),
      );
  }

  /**
   * Transfer list of matchings
   */
  transfer(matchings: MatchingModel[], brokerId: string, comment?: string): Observable<boolean> {

    const request: MatchingTransferRequestInterface = [{
      match_ids: this.extractMatchingIds(matchings),
      broker_id: parseInt(brokerId, 10),
    }];

    if (comment) {

      request[0].comment = comment;
    }

    return this
      .httpService
      .post<string, MatchingTransferResponseInterface>(
        ApiEndpointEnum.matchingTransfer,
        JSON.stringify(request),
        null,
        true,
      )
      .pipe(
        map(response => response.success),
      );
  }

  /**
   * Send proposal to list of matchings
   */
  send(
    matchings: MatchingModel[],
    proposal: MatchingGroupProposalInterface,
    emailContent: EmailContentModel,
    isPromotionOnly: boolean,
  ): Observable<boolean> {

    return this
      .httpService
      .post<MatchingSendRequestInterface, MatchingSendResponseInterface>(
        ApiEndpointEnum.matchingSend,
        this.sendRequest(matchings, proposal, emailContent, isPromotionOnly),
        null,
        false,
      )
      .pipe(
        map(response => response.success),
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MatchingSearchModel,
  ): MatchingListRequestInterface {

    return this.filtersDecorator<MatchingListRequestInterface>(
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
   * Return a decorated version of the request with filters
   */
  private filtersDecorator<R extends MatchingFiltersDecoratorInterface>(request: R, filters: MatchingSearchModel): R {

    if (filters.contactId) {

      request.contact_id = filters.contactId;
    }

    if (filters.propertyId) {

      request.property_id = filters.propertyId;
    }

    if (filters.propertyBrokerId) {

      request.property_broker_id = filters.propertyBrokerId;
    }

    if (filters.contactBrokerId) {

      request.contact_broker_id = filters.contactBrokerId;
    }

    if (filters.searchManagerIds && filters.searchManagerIds.length > 0) {

      request.search_manager_id = filters.searchManagerIds;
    }

    if (filters.dateFrom) {

      request.date_from = this.helperService.dateToString(new Date(filters.dateFrom));
    }

    if (filters.dateTo) {

      request.date_to = this.helperService.dateToString(new Date(filters.dateTo));
    }

    if (filters.statusId) {

      request.status_id = filters.statusId;
    }

    return request;
  }

  /**
   * Handle a list() response and return a list of matching models
   */
  private listResponse(response: MatchingListResponseInterface): ModelListInterface<MatchingModel> {

    return {
      models: response.data.map((data, i) => {

        const matching = new MatchingModel();

        matching.id = data.id;
        matching.matchDate = this.helperService.stringToDate(data.match_datetime);
        matching.processDate = this.helperService.stringToDate(data.process_datetime);
        matching.statusId = data.status_id;
        matching.labelStatus = data.status;
        matching.comment = data.comment;
        matching.labelDuration = data.duration;

        // Contact
        if (data.contact) {

          const contact = new ContactModel();

          contact.id = data.contact.id;
          contact.fullName = data.contact_name || '';

          matching.contact = contact;
        }

        // Property
        if (data.property) {

          const photoUrl = data.property.photoUrl;

          const property = new PropertyModel();

          property.id = data.property.id;
          property.reference = data.property_reference || '';
          property.photoSmallURL = photoUrl && photoUrl.indexOf('rf_default_property.jpg') === -1 ? photoUrl : '';
          property.photoLargeURL = property.photoSmallURL;
          property.type = data.property.transaction === '2' ? TypeEnum.sell : TypeEnum.rent;
          property.ranking = data.property.ranking;

          matching.property = property;
        }

        // Promotion
        if (data.promotion_id) {

          const promotion = new PromotionModel();

          promotion.id = data.promotion_id;

          matching.promotion = promotion;
        }

        return matching;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle an ids() request parameters and return a formatted request
   */
  private idsRequest(filters: MatchingSearchModel): MatchingIdsRequestInterface {

    return this.filtersDecorator<MatchingIdsRequestInterface>(
      {
        format: 'numeric',
      },
      filters,
    );
  }

  /**
   * Handle an ids() response and return a string[]
   */
  private idsResponse(response: MatchingIdsResponseInterface): string[] {

    return response;
  }

  /**
   * Handle a send() request parameters and return a MatchingSendRequestInterface
   */
  private sendRequest(
    matchings: MatchingModel[],
    proposal: MatchingGroupProposalInterface,
    emailContent: EmailContentModel,
    isPromotionOnly: boolean,
  ): MatchingSendRequestInterface {

    const requestByContact: {
      [contactId: string]: {
        sender_id: string;
        match_ids: string[];
        brochure_template: string;
        brochure_type: string;
        contact_id: string;
        lang: string;
        message: string;
        subject: string;
        template_id: string;
        only_promotion: string;
      };
    } = {};

    // For each matching
    matchings.forEach(matching => {

      // Contact language
      const language = proposal.emailContentLanguageId[matching.contact.id] || matching.contact.languageId;

      // Contact not added to request yet
      if (!requestByContact[matching.contact.id]) {

        requestByContact[matching.contact.id] = {
          sender_id: proposal.senderId,
          match_ids: [],
          brochure_template: proposal.emailBrochurePrivacyId,
          brochure_type: proposal.emailBrochureTypeId,
          contact_id: matching.contact.id,
          lang: language,
          message: proposal.emailContentLanguageHtml[language] || '<p></p>',
          subject: emailContent.subject[language] || '',
          template_id: proposal.emailTemplateId,
          only_promotion: isPromotionOnly === true ? '1' : '0',
        };
      }

      // Adding matching(s) to request by contact
      if (matching.duplicateMatchingIds.length > 0) {

        requestByContact[matching.contact.id].match_ids = requestByContact[matching.contact.id].match_ids
          .concat(matching.duplicateMatchingIds);

      } else {

        requestByContact[matching.contact.id].match_ids.push(matching.id);
      }
    });

    return Object.keys(requestByContact).map(contactId => requestByContact[contactId]);
  }

  /**
   * Extract the matching IDs from a list of matching models
   */
  private extractMatchingIds(matchings: MatchingModel[]): number[] {

    const matchingIds: number[] = [];

    matchings.forEach(matching => {

      if (matching.duplicateMatchingIds.length > 0) {

        matching
          .duplicateMatchingIds
          .forEach(duplicateMatchingId => matchingIds.push(parseInt(duplicateMatchingId, 10)));

      } else {

        matchingIds.push(
          parseInt(matching.id, 10),
        );
      }
    });

    return matchingIds;
  }
}
