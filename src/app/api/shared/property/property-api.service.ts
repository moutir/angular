import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PropertyModel } from '../../../shared/model/property.model';
import { PropertyListRequestInterface } from './property-list-request.interface';
import { PropertyListResponseInterface } from './property-list-response.interface';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PropertyFiltersDecoratorInterface } from './property-filters-decorator.interface';
import { PropertyIdsRequestInterface } from './property-ids-request.interface';
import { PropertyIdsResponseInterface } from './property-ids-response.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PropertyRankingRequestInterface } from './property-update-ranking-request.interface';
import { PropertyRankingResponseInterface } from './property-update-ranking-response.interface';
import { PropertyAddBasketRequestInterface } from './property-add-basket-request.interface';
import { PropertyAddBasketResponseInterface } from './property-add-basket-response.interface';
import { PropertyDuplicateRequestInterface } from './property-duplicate-request.interface';
import { PropertyDuplicateResponseInterface } from './property-duplicate-response.interface';
import { PropertyArchiveRequestInterface } from './property-archive-request.interface';
import { PropertyArchiveResponseInterface } from './property-archive-response.interface';
import { TypeEnum } from '../../../shared/enum/type.enum';
import { PropertyUpdateTypeRequestInterface } from './property-update-type-request.interface';
import { PropertyUpdateTypeResponseInterface } from './property-update-type-response.interface';
import { PropertyUnarchiveRequestInterface } from './property-unarchive-request.interface';
import { PropertyUnarchiveResponseInterface } from './property-unarchive-response.interface';
import { HelperService } from '../../../core/shared/helper.service';
import { ContactModel } from '../../../shared/model/contact.model';
import { PropertyRemoveMlsRequestInterface } from './property-remove-mls-request.interface';
import { PropertyRemoveMlsResponseInterface } from './property-remove-mls-response.interface';
import { PropertyTransferRequestInterface } from './property-transfer-request.interface';
import { PropertyTransferResponseInterface } from './property-transfer-response.interface';
import { PropertyPublicationRequestInterface } from './property-publication-request.interface';
import { PropertyPublicationResponseInterface } from './property-publication-response.interface';
import { PropertyPublicationInterface } from '../../../shared/interface/property-publication.interface';
import { PropertyTransferInterface } from '../../../shared/interface/property-transfer.interface';
import { MortgageCalculationInterface } from '../../../shared/interface/mortgage-calculation.interface';
import { MortgageApprovalRequestInterface } from './mortgage-approval-request.interface';
import { MortgageCalculationResponseInterface } from './mortgage-calculation-response.interface';
import { MortgageApprovalResponseInterface } from './mortgage-approval-response.interface';
import { SummaryByIdResponseInterface } from './summary-by-id-response.interface';
import { PropertyValuationResultInterface } from '../../../shared/interface/property-valuation-result.interface';
import { ValuationResponseInterface } from './valuation-response.interface';
import { ValuationRequestInterface } from './valuation-request.interface';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { PhoneTypeEnum } from '../../../shared/enum/phone-type.enum';

@Injectable()
export class PropertyApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List properties
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PropertySearchModel,
  ): Observable<ModelListInterface<PropertyModel>> {

    return this
      .httpService
      .post<PropertyListRequestInterface, PropertyListResponseInterface>(
        ApiEndpointEnum.propertyList,
        this.listRequest(pagination, sort, filters),
        {
          state: filters.isArchive01 === '1' ? 'archive' : 'active',
        },
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
    filters: PropertySearchModel,
  ): PropertyListRequestInterface {

    return this.filtersDecorator<PropertyListRequestInterface>(
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
   * Handle a list() response and return a list of property models
   */
  private listResponse(response: PropertyListResponseInterface): ModelListInterface<PropertyModel> {

    return {
      models: response.data.map((data, i) => {

        const property = new PropertyModel();

        property.id = data.id;
        property.reference = data.reference;
        property.createDate = this.helperService.stringToDate(data.create_datetime);
        property.createContactId = data.create_contact_id;
        property.updateDate = data.update_datetime !== data.create_datetime ?
          this.helperService.stringToDate(data.update_datetime) : null;
        property.updateContactId = data.update_datetime !== data.create_datetime ? data.update_contact_id : null;
        property.isSharedRestricted = data.details_visible === false;
        property.labelStatus = data.status_label;
        property.priceFrequencyId = data.price_frequency_id;
        property.labelPriceCharges = data.price_charges || '';
        property.isPriceChargesIncluded = data.price_charges_included;
        property.labelCategory = data.category;
        property.labelSubcategory = data.subcategory;
        property.labelPrice = data.price_label;
        property.price = data.price ? Number(data.price) : null;
        property.labelMortgage = data.mortgage;
        property.rooms = data.rooms;
        property.bedrooms = data.bedrooms;
        property.areaLiving = data.habitable; // TODO[BE] should provide areaUnit
        property.areaLand = data.land; // TODO[BE] should provide areaUnit
        property.photoSmallURL = data.photo_thumb && data.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ? data.photo_thumb : '';
        property.photoLargeURL = data.photo_zoom && data.photo_zoom.indexOf('/rf_default_property.jpg') === -1 ? data.photo_zoom : '';
        property.ranking = parseInt(data.ranking, 10);
        property.notes = [data.important_notes, data.broker_notes]
          .filter(notes => (notes || '').trim() !== '')
          .join('\n\n--------------------\n\n');
        property.isMls = data.DT_RowClass === 'fromMyPartner';
        property.promotionId = data.promotion_id;
        property.agency.name = data.agency_name;
        property.areaUnit = data.area_unit;
        property.statusId = data.status_id;
        property.type = data.type;
        property.currencyId = data.currency_id;
        property.currencyLabel = data.currency_label;
        property.type = data.type;
        property.location = {
          levels: [],
          label: data.location[0] || '',
          street: data.address || '',
          zipcode: '',
        };

        // Broker
        const broker = new ContactModel();
        broker.id = data.broker2 && data.broker2.id;
        broker.initials = data.broker2 && data.broker2.initials;
        property.broker = broker;

        // Owners
        if (Array.isArray(data.owner2)) {

          property.owners = data.owner2.map(owner => {

            const contact = new ContactModel();
            contact.id = owner.id;
            contact.initials = owner.initials;

            return contact;
          });
        }

        // Intermediates
        if (Array.isArray(data.intermediate2)) {

          property.intermediates = data.intermediate2.map(intermediate => {

            const contact = new ContactModel();
            contact.id = intermediate.id;
            contact.initials = intermediate.initials;

            return contact;
          });
        }

        return property;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * List IDs only matching the search
   */
  ids(filters: PropertySearchModel): Observable<string[]> {

    return this
      .httpService
      .post<PropertyIdsRequestInterface, PropertyIdsResponseInterface>(
        ApiEndpointEnum.propertyIds,
        this.idsRequest(filters),
        {
          state: filters.isArchive01 === '1' ? 'archive' : 'active',
        },
        true,
      )
      .pipe(
        map(response => this.idsResponse(response)),
      );
  }

  /**
   * Handle an ids() request parameters and return a formatted request
   */
  private idsRequest(filters: PropertySearchModel): PropertyIdsRequestInterface {

    return this.filtersDecorator<PropertyIdsRequestInterface>(
      {
        format: 'numeric',
      },
      filters,
    );
  }

  /**
   * Handle an ids() response and return a string[]
   */
  private idsResponse(response: PropertyIdsResponseInterface): string[] {

    return response; // already an array of string
  }

  /**
   * Return a decorated version of the request with filters
   */
  private filtersDecorator<R extends PropertyFiltersDecoratorInterface>(request: R, filters: PropertySearchModel): R {

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

    if (filters.spaces && filters.spaces.length > 0) {

      request.spaces = filters.spaces;
    }

    if (filters.sectors && filters.sectors.length > 0) {

      request.sectors = filters.sectors;
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

    if (filters.statusIds && filters.statusIds.length > 0) {

      request.status = filters.statusIds;
    }

    if (filters.isPromotion01) {

      request.is_promotion = filters.isPromotion01;
    }

    if (filters.agencyId) {

      request.agency_id = filters.agencyId;
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

    if (filters.customAttributeIds && filters.customAttributeIds.length > 0) {

      request.custom_attribute = filters.customAttributeIds;
    }

    if (filters.ids && filters.ids.length > 0) {

      request.ids = filters.ids;
    }

    if (filters.type) {

      request.type = filters.type;
    }

    if (filters.polygons && filters.polygons.length > 0) {

      request.polygons = JSON.stringify(filters.polygons.filter(polygon => !!polygon).map(polygon => {

        const vertices = polygon.vertices.map(vertex => {

          return [
            vertex.lng,
            vertex.lat,
          ];
        });

        // Add first vertex as last (BE requirement)
        vertices.push(vertices[0]);

        return vertices;
      }));
    }

    return request;
  }

  /**
   * Update property ranking
   */
  updateRanking(
    propertyId: string,
    ranking: number,
  ): Observable<PropertyRankingResponseInterface> {

    const request: PropertyRankingRequestInterface = {
      property_id: propertyId,
      ranking: ranking,
    };

    return this
      .httpService
      .post<PropertyRankingRequestInterface, PropertyRankingResponseInterface>(
        ApiEndpointEnum.propertyUpdateRanking,
        request,
        null,
        true,
      );
  }

  /**
   * Update properties type
   */
  updateType(
    propertyIds: string[],
    type: TypeEnum,
  ): Observable<PropertyUpdateTypeResponseInterface> {

    const request: PropertyUpdateTypeRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
      type: type,
    };

    return this
      .httpService
      .post<PropertyUpdateTypeRequestInterface, PropertyUpdateTypeResponseInterface>(
        ApiEndpointEnum.propertyUpdateType,
        request,
        null,
        true,
      );
  }

  /**
   * Add property IDs to basket
   */
  addBasket(propertyIds: string[]): Observable<PropertyAddBasketResponseInterface> {

    const request: PropertyAddBasketRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
    };

    return this
      .httpService
      .post<PropertyAddBasketRequestInterface, PropertyAddBasketResponseInterface>(
        ApiEndpointEnum.propertyBasketAdd,
        request,
        null,
        true,
      );
  }

  /**
   * Remove property IDs from basket
   */
  removeBasket(propertyIds: string[]): Observable<PropertyAddBasketResponseInterface> {

    const request: PropertyAddBasketRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
    };

    return this
      .httpService
      .post<PropertyAddBasketRequestInterface, PropertyAddBasketResponseInterface>(
        ApiEndpointEnum.propertyBasketRemove,
        request,
        null,
        true,
      );
  }

  /**
   * Duplicate properties identified by IDs
   */
  duplicate(propertyIds: string[]): Observable<PropertyDuplicateResponseInterface> {

    const request: PropertyDuplicateRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
    };

    return this
      .httpService
      .post<PropertyDuplicateRequestInterface, PropertyDuplicateResponseInterface>(
        ApiEndpointEnum.propertyDuplicate,
        request,
        null,
        true,
      );
  }

  /**
   * Archive properties identified by IDs
   */
  archive(propertyIds: string[]): Observable<PropertyArchiveResponseInterface> {

    const request: PropertyArchiveRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
    };

    return this
      .httpService
      .post<PropertyArchiveRequestInterface, PropertyArchiveResponseInterface>(
        ApiEndpointEnum.propertyArchive,
        request,
        null,
        true,
      );
  }

  /**
   * Unarchive properties identified by IDs
   */
  unarchive(propertyIds: string[]): Observable<PropertyUnarchiveResponseInterface> {

    const request: PropertyUnarchiveRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
    };

    return this
      .httpService
      .post<PropertyUnarchiveRequestInterface, PropertyUnarchiveResponseInterface>(
        ApiEndpointEnum.propertyUnarchive,
        request,
        null,
        true,
      );
  }

  /**
   * Update properties broker
   */
  transfer(transfer: PropertyTransferInterface): Observable<object> {

    const request: PropertyTransferRequestInterface = [
      {
        agency_id: transfer.agencyId,
        broker_id: transfer.brokerId,
        property_ids: transfer.propertyIds,
      },
    ];

    return this
      .httpService
      .post<string, PropertyTransferResponseInterface>(
        ApiEndpointEnum.propertyTransfer,
        JSON.stringify(request),
        null,
        true,
      );
  }

  /**
   * Update properties publication
   */
  publication(publication: PropertyPublicationInterface): Observable<PropertyPublicationResponseInterface> {

    const request: PropertyPublicationRequestInterface = this.publicationRequest(publication);

    return this
      .httpService
      .post<string, PropertyPublicationResponseInterface>(
        ApiEndpointEnum.propertyPublication,
        JSON.stringify(request),
        null,
        true,
      );
  }

  /**
   * Remove properties from MLS
   */
  removeMls(propertyIds: string[]): Observable<PropertyRemoveMlsResponseInterface> {

    const request: PropertyRemoveMlsRequestInterface = {
      items: propertyIds.map(propertyId => 'property_' + propertyId),
    };

    return this
      .httpService
      .post<PropertyRemoveMlsRequestInterface, PropertyRemoveMlsResponseInterface>(
        ApiEndpointEnum.propertyRemoveMls,
        request,
        null,
        true,
      );
  }

  /**
   * Mortgage calculation
   */
  mortgageCalculate(propertyId: string): Observable<MortgageCalculationInterface> {

    return this
      .httpService
      .get<null, MortgageCalculationResponseInterface>(
        ApiEndpointEnum.propertyMortgageCalculation,
        null,
        { id: propertyId },
      )
      .pipe(
        map(response => this.mortgageCalculationResponse(response)),
      )
    ;
  }

  /**
   * Property valuation
   */
  valuation(propertyId: string): Observable<PropertyValuationResultInterface> {

    const request: ValuationRequestInterface = {
      property_id: propertyId,
    };

    return this
      .httpService
      .post<ValuationRequestInterface, ValuationResponseInterface>(
        ApiEndpointEnum.propertyValuation,
        request,
        null,
        true,
      )
      .pipe(
        map(response => this.valuationResponse(response)),
      )
    ;
  }

  /**
   * Submit mortgage
   */
  mortgageSubmit(propertyId: string, contactId: string): Observable<boolean> {

    const request: MortgageApprovalRequestInterface = {
      property_id: propertyId,
      contact_id: contactId,
    };

    return this
      .httpService
      .post<MortgageApprovalRequestInterface, MortgageApprovalResponseInterface>(
        ApiEndpointEnum.propertyMortgageApproval,
        request,
        null,
        true,
      )
      .pipe(
        map(response => true),
      )
    ;
  }

  /**
   * Load summary
   */
  summary(id: string): Observable<PropertyModel> {

    return this
      .httpService
      .get<null, SummaryByIdResponseInterface>(ApiEndpointEnum.propertySummaryById, null, { id })
      .pipe(
        map(response => this.summaryResponse(response, id)),
      );
  }

  /**
   * Handle an publication() request parameters and return a formatted request
   */
  private publicationRequest(publication: PropertyPublicationInterface): PropertyPublicationRequestInterface {

    const request: PropertyPublicationRequestInterface = {
      properties: publication.propertyIds,
    };

    // Websites
    request.websites = Object
      .keys(publication.websites.changes)
      .map(id => {

        return {
          id: id,
          publish: parseInt(publication.websites.changes[id], 10),
        };
      });

    if (publication.websites.dates.from) {

      request.publication_website_publish_up = this.helperService.dateToString(new Date(publication.websites.dates.from));
    }

    if (publication.websites.dates.to) {

      request.publication_website_publish_down = this.helperService.dateToString(new Date(publication.websites.dates.to));
    }

    // Portals
    request.gateways = Object
      .keys(publication.portals.changes)
      .map(id => {

        return {
          id: id,
          publish: parseInt(publication.portals.changes[id], 10),
        };
      });

    if (publication.portals.dates.from) {

      request.publication_gateway_publish_up = this.helperService.dateToString(new Date(publication.portals.dates.from));
    }

    if (publication.portals.dates.to) {

      request.publication_gateway_publish_down = this.helperService.dateToString(new Date(publication.portals.dates.to));
    }

    return request;
  }

  /**
   * Handle an calculateMortgage() response and return MortgageCalculationInterface
   */
  private mortgageCalculationResponse(
    response: MortgageCalculationResponseInterface,
  ): MortgageCalculationInterface {

    return {
      loanPercentage: (response.data.borrow_ratio || 0) * 100,
      loanValue: response.data.loan_value,
      personalContribution: response.data.own_founds,
      amortization: response.data.monthly_amortization,
      amortizationPeriod: 'label_monthly',
      yearInterest5: response.data.monthly_total_interest_5,
      yearInterest10: response.data.monthly_total_interest_10,
      yearInterest15: response.data.monthly_total_interest_15,
      yearInterestPeriod: 'label_monthly',
      currency: response.data.currency,
      yearInterestPercentage5: response.data.interest_rate.min_interest_5 ?
        Number((response.data.interest_rate.min_interest_5 * 100).toFixed(2)) : 0,
      yearInterestPercentage10: response.data.interest_rate.min_interest_10 ?
        Number((response.data.interest_rate.min_interest_10 * 100).toFixed(2)) : 0,
      yearInterestPercentage15: response.data.interest_rate.min_interest_15 ?
        Number((response.data.interest_rate.min_interest_15 * 100).toFixed(2)) : 0,
    };
  }

  /**
   * Handle an valuation() response and return PropertyValuationResultInterface
   */
  private valuationResponse(
    response: ValuationResponseInterface,
  ): PropertyValuationResultInterface {

    if (!response.data) {

      return null;
    }

    return {
      link: response.data.url,
      confidence: response.data.confidence,
      priceLower: response.data.priceLower,
      priceUpper: response.data.priceUpper,
      currency: response.data.currency,
    };
  }

  /**
   * Handle a summary() response and return a PropertyModel
   */
  private summaryResponse(response: SummaryByIdResponseInterface, id: string): PropertyModel {

    const property = new PropertyModel();

    property.id = id;
    property.reference = response.reference;
    property.labelPrice = response.price;
    property.rooms = response.rooms;
    property.bedrooms = response.bedrooms;
    property.labelCategory = response.main_category;
    property.areaLiving = (response.habitable || '').split(' ')[0];
    property.areaLand = (response.land || '').split(' ')[0];
    property.location = {
      levels: [],
      label: response.location,
      street: '',
      zipcode: response.zip,
    };

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

      property.broker = contactModel;
    }

    return property;
  }
}
