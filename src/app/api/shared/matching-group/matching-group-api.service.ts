import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { MatchingGroupSearchModel } from '../../../shared/model/matching-group-search.model';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { MatchingGroupModel } from '../../../shared/model/matching-group.model';
import { MatchingListGroupsRequestInterface } from '../matching/matching-list-groups-request.interface';
import { MatchingListGroupsResponseInterface } from '../matching/matching-list-groups-response.interface';
import { MatchingListGroupsContactResponseInterface } from '../matching/matching-list-groups-contact-response.interface';
import { MatchingListGroupsPropertyResponseInterface } from '../matching/matching-list-groups-property-response.interface';
import { MatchingListGroupsPromotionResponseInterface } from '../matching/matching-list-groups-promotion-response.interface';
import { ContactModel } from '../../../shared/model/contact.model';
import { PropertyModel } from '../../../shared/model/property.model';
import { TypeEnum } from '../../../shared/enum/type.enum';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { MatchingModel } from '../../../shared/model/matching.model';
import { SearchModel } from '../../../shared/model/search.model';
import { ContactTypeEnum } from '../../../shared/enum/contact-type.enum';

@Injectable()
export class MatchingGroupApiService {

  /**
   * Constructor
   */
  constructor(
    protected httpService: PhalconHttpService,
  ) {

  }

  /**
   * List groups of matchings
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MatchingGroupSearchModel,
  ): Observable<ModelListInterface<MatchingGroupModel>> {

    return this
      .httpService
      .get<MatchingListGroupsRequestInterface, MatchingListGroupsResponseInterface>(
        ApiEndpointEnum.matchingListGroups,
        this.listRequest(pagination, sort, filters),
        {
          matchingGroupEntity: filters.matchingGroupEntity,
        },
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Handle a list() request parameters and return a MatchingListGroupsRequestInterface
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MatchingGroupSearchModel,
  ): MatchingListGroupsRequestInterface {

    return {
      start: (pagination.page - 1) * pagination.perPage,
      length: pagination.perPage,
      sort_id: sort.id,
      sort_order: sort.order,
      property_id: filters.propertyId || '',
      property_broker_id: filters.propertyBrokerId || '',
      contact_id: filters.contactId || '',
      contact_broker_id: filters.contactBrokerId || '',
      contact_search_broker_id: filters.contactSearchBrokerId || '',
      promotion_id: filters.promotionId || '',
      named_filter: filters.matchingGroupType || '',
    };
  }

  /**
   * Handle a list() response and return a list of matching group models
   */
  private listResponse(response: MatchingListGroupsResponseInterface): ModelListInterface<MatchingGroupModel> {

    return {
      models: response.data
        .map(data => {

          // No matchings
          if (data.matches.length === 0) {

            return null;
          }

          const matchingGroup = new MatchingGroupModel();

          // By contact
          if ((<MatchingListGroupsContactResponseInterface>data).contact_id) {

            const row = <MatchingListGroupsContactResponseInterface>data;

            matchingGroup.id = 'group-contact-' + row.contact_id;

            matchingGroup.contact = new ContactModel();
            matchingGroup.contact.id = row.contact_id;
            matchingGroup.contact.firstName = row.contact_firstname || '';
            matchingGroup.contact.lastName = row.contact_lastname || '';
            matchingGroup.contact.initials = matchingGroup.contact.firstName.substr(0, 1) + matchingGroup.contact.lastName.substr(0, 1);
            matchingGroup.contact.fullName = row.contact_name;
            matchingGroup.contact.isValidEmail = String(row.email_exists) === '1';
            matchingGroup.contact.isVip = String(row.contact_vip) === '1';
            matchingGroup.contact.ranking = parseInt(row.contact_ranking, 10);
            matchingGroup.contact.languageId = row.language_id;

            if (row.contact_search) {

              const search = new SearchModel();

              search.id = row.contact_search.id;
              search.title = row.contact_search.title;
              search.statusId = row.contact_search.status_id;
              search.notes = row.contact_search.note || '';

              if (row.contact_search.manager_id) {

                search.brokerContact = new ContactModel();
                search.brokerContact.id = row.contact_search.manager_id;
                search.brokerContact.firstName = row.contact_search.manager_firstname;
                search.brokerContact.lastName = row.contact_search.manager_lastname;
              }

              matchingGroup.contact.searches.push(search);
            }

            if (row.broker_id) {

              matchingGroup.contact.mainContact = new ContactModel();
              matchingGroup.contact.mainContact.id = row.broker_id;
              matchingGroup.contact.mainContact.firstName = row.broker_firstname;
              matchingGroup.contact.mainContact.lastName = row.broker_lastname;
              matchingGroup.contact.mainContact.fullName = matchingGroup.contact.mainContact.getFullName();
              matchingGroup.contact.mainContact.type = ContactTypeEnum.colleague;
            }

            // Matchings
            matchingGroup.matchings = row.matches.map(match => {

              const matching = new MatchingModel();
              matching.id = match.id;

              matching.contact = new ContactModel();
              matching.contact.id = row.contact_id;
              matching.contact.fullName = row.contact_name;
              matching.contact.isValidEmail = String(row.email_exists) === '1';
              matching.contact.languageId = row.language_id;

              matching.property = new PropertyModel();
              matching.property.id = match.property.id;
              matching.property.photoSmallURL = match.property.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ?
                match.property.photo_thumb : '';
              matching.property.promotionId = match.property.promotion_id;
              matching.property.reference = match.property.reference;
              matching.property.type = String(match.property.transaction_type_id) === '2' ? TypeEnum.sell : TypeEnum.rent;
              matching.property.bathrooms = match.property.bathrooms || '';
              matching.property.bedrooms = match.property.bedrooms || '';
              matching.property.rooms = match.property.rooms || '';
              matching.property.areaLiving = match.property.habitable || '';
              matching.property.location = {
                levels: match.property.location.city,
                label: match.property.location.label,
                street: match.property.location.street || '',
                zipcode: match.property.location.zipcode || '',
              };
              matching.property.labelPrice = match.property.price;
              matching.property.ranking = parseInt(match.property.ranking, 10);
              matching.property.areaWeighted = match.property.weighted;
              matching.property.labelSubcategory = match.property.subcategory;

              if (match.matching_score) {

                matching.score = {
                  area: (match.matching_score.area || 0) * 100,
                  bedroom: (match.matching_score.bedroom || 0) * 100,
                  land: (match.matching_score.land || 0) * 100,
                  price: (match.matching_score.price || 0) * 100,
                  room: (match.matching_score.room || 0) * 100,
                  total: Math.round((match.matching_score.total || 0) * 100),
                };
              }

              if (match.property.broker_id) {

                const broker = new ContactModel();
                broker.id = match.property.broker_id;
                broker.firstName = match.property.broker_firstname;
                broker.lastName = match.property.broker_lastname;
                broker.fullName = [broker.firstName, broker.lastName].join(' ');
                matching.property.broker = broker;
              }

              return matching;
            });

          // By property
          } else if ((<MatchingListGroupsPropertyResponseInterface>data).property_id) {

            const row = <MatchingListGroupsPropertyResponseInterface>data;

            matchingGroup.id = 'group-property-' + row.property_id;

            matchingGroup.property = new PropertyModel();
            matchingGroup.property.id = row.property_id;
            matchingGroup.property.photoSmallURL = row.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ? row.photo_thumb : '';
            matchingGroup.property.promotionId = row.promotion_id;
            matchingGroup.property.reference = row.reference;
            matchingGroup.property.type = String(row.transaction_type_id) === '2' ? TypeEnum.sell : TypeEnum.rent;
            matchingGroup.property.bathrooms = row.bathrooms || '';
            matchingGroup.property.bedrooms = row.bedrooms || '';
            matchingGroup.property.rooms = row.rooms || '';
            matchingGroup.property.areaLiving = row.habitable || '';
            matchingGroup.property.location = {
              levels: row.location.city,
              label: row.location.label,
              street: row.location.street || '',
              zipcode: row.location.zipcode || '',
            };
            matchingGroup.property.labelPrice = row.price;
            matchingGroup.property.ranking = parseInt(row.ranking, 10);
            matchingGroup.property.areaWeighted = row.weighted;
            matchingGroup.property.labelSubcategory = row.subcategory;

            if (row.broker_id) {

              const broker = new ContactModel();
              broker.id = row.broker_id;
              broker.firstName = row.broker_firstname;
              broker.lastName = row.broker_lastname;
              broker.fullName = [broker.firstName, broker.lastName].join(' ');
              matchingGroup.property.broker = broker;
            }

            // Matchings
            matchingGroup.matchings = row.matches.map(match => {

              const matching = new MatchingModel();
              matching.id = match.id;

              matching.contact = new ContactModel();
              matching.contact.id = match.contact_id;
              matching.contact.firstName = match.contact_firstname || '';
              matching.contact.lastName = match.contact_lastname || '';
              matching.contact.initials = matching.contact.firstName.substr(0, 1) + matching.contact.lastName.substr(0, 1);
              matching.contact.fullName = match.contact_name;
              matching.contact.isValidEmail = String(match.email_exists) === '1';
              matching.contact.isVip = String(match.contact_vip) === '1';
              matching.contact.ranking = parseInt(match.contact_ranking, 10);
              matching.contact.languageId = match.language_id;

              if (match.matching_score) {

                matching.score = {
                  area: (match.matching_score.area || 0) * 100,
                  bedroom: (match.matching_score.bedroom || 0) * 100,
                  land: (match.matching_score.land || 0) * 100,
                  price: (match.matching_score.price || 0) * 100,
                  room: (match.matching_score.room || 0) * 100,
                  total: Math.round((match.matching_score.total || 0) * 100),
                };
              }

              if (match.broker_id) {

                matching.contact.mainContact = new ContactModel();
                matching.contact.mainContact.id = match.broker_id;
                matching.contact.mainContact.firstName = match.broker_firstname || '';
                matching.contact.mainContact.lastName = match.broker_lastname || '';
                matching.contact.mainContact.fullName = matching.contact.mainContact.getFullName();
                matching.contact.mainContact.type = ContactTypeEnum.colleague;
              }

              if (match.contact_search) {

                const search = new SearchModel();

                search.id = match.contact_search.id;
                search.title = match.contact_search.title;
                search.statusId = match.contact_search.status_id;
                search.notes = match.contact_search.note || '';

                if (match.contact_search.manager_id) {

                  search.brokerContact = new ContactModel();
                  search.brokerContact.id = match.contact_search.manager_id;
                  search.brokerContact.firstName = match.contact_search.manager_firstname;
                  search.brokerContact.lastName = match.contact_search.manager_lastname;
                }

                matching.contact.searches.push(search);
              }

              matching.property = new PropertyModel();
              matching.property.id = row.property_id;
              matching.property.reference = row.reference;
              matching.property.promotionId = row.promotion_id;

              if (match.broker_id) {

                const broker = new ContactModel();
                broker.id = row.broker_id;
                broker.firstName = row.broker_firstname;
                broker.lastName = row.broker_lastname;
                broker.fullName = [broker.firstName, broker.lastName].join(' ');
                matchingGroup.property.broker = broker;
              }

              return matching;
            });

          // By promotion
          } else if ((<MatchingListGroupsPromotionResponseInterface>data).promotion_id) {

            const row = <MatchingListGroupsPromotionResponseInterface>data;

            matchingGroup.id = 'group-promotion-' + row.promotion_id;

            matchingGroup.promotion = new PromotionModel();
            matchingGroup.promotion.id = row.promotion_id;
            matchingGroup.promotion.photoSmallURL = row.photo_thumb.indexOf('/rf_default_property.jpg') === -1 ? row.photo_thumb : '';
            matchingGroup.promotion.reference = row.reference;
            matchingGroup.promotion.location = {
              levels: row.location.city,
              label: row.location.label || '',
              street: row.location.street || '',
              zipcode: row.location.zipcode || '',
            };

            if (row.broker_id) {

              const broker = new ContactModel();
              broker.id = row.broker_id;
              broker.firstName = row.broker_firstname;
              broker.lastName = row.broker_lastname;
              broker.fullName = [broker.firstName, broker.lastName].join(' ');
              matchingGroup.promotion.broker = broker;
            }

            matchingGroup.promotion.propertyBedroomsFrom = parseInt(row.summary.bedrooms_from, 10) || 0;
            matchingGroup.promotion.propertyBedroomsTo = parseInt(row.summary.bedrooms_to, 10) || 0;
            matchingGroup.promotion.propertyAreaLivingFrom = parseInt(row.summary.habitable_from, 10) || 0;
            matchingGroup.promotion.propertyAreaLivingTo = parseInt(row.summary.habitable_to, 10) || 0;
            matchingGroup.promotion.propertyAreaWeightedFrom = parseInt(row.summary.weighted_from, 10) || 0;
            matchingGroup.promotion.propertyAreaWeightedTo = parseInt(row.summary.weighted_to, 10) || 0;
            matchingGroup.promotion.propertyPrice = (row.summary.price || 0).toString();
            matchingGroup.promotion.propertyPriceFrom = row.summary.price_from || '';
            matchingGroup.promotion.propertyPriceSold = (row.summary.price_sold || 0).toString();
            matchingGroup.promotion.propertyTotalCount = row.summary.num_of_properties || 0;
            matchingGroup.promotion.propertySoldCount = row.summary.sold || 0;
            matchingGroup.promotion.propertyReservedCount = row.summary.reserved || 0;
            matchingGroup.promotion.propertyAvailableCount = matchingGroup.promotion.propertyTotalCount -
              matchingGroup.promotion.propertySoldCount -
              matchingGroup.promotion.propertyReservedCount;

            // Matchings
            matchingGroup.matchings = row.matches.map(match => {

              const matching = new MatchingModel();
              matching.id = match.id;

              matching.contact = new ContactModel();
              matching.contact.id = match.contact_id;
              matching.contact.firstName = match.contact_firstname || '';
              matching.contact.lastName = match.contact_lastname || '';
              matching.contact.initials = matching.contact.firstName.substr(0, 1) + matching.contact.lastName.substr(0, 1);
              matching.contact.fullName = match.contact_name;
              matching.contact.isValidEmail = String(match.email_exists) === '1';
              matching.contact.isVip = String(match.contact_vip) === '1';
              matching.contact.ranking = parseInt(match.contact_ranking, 10);
              matching.contact.languageId = match.language_id;

              if (match.matching_score) {

                matching.score = {
                  area: (match.matching_score.area || 0) * 100,
                  bedroom: (match.matching_score.bedroom || 0) * 100,
                  land: (match.matching_score.land || 0) * 100,
                  price: (match.matching_score.price || 0) * 100,
                  room: (match.matching_score.room || 0) * 100,
                  total: Math.round((match.matching_score.total || 0) * 100),
                };
              }

              if (match.broker_id) {

                matching.contact.mainContact = new ContactModel();
                matching.contact.mainContact.id = match.broker_id;
                matching.contact.mainContact.firstName = match.broker_firstname || '';
                matching.contact.mainContact.lastName = match.broker_lastname || '';
                matching.contact.mainContact.fullName = matching.contact.mainContact.getFullName();
                matching.contact.mainContact.type = ContactTypeEnum.colleague;
              }

              if (match.contact_search) {

                const search = new SearchModel();

                search.id = match.contact_search.id;
                search.title = match.contact_search.title;
                search.statusId = match.contact_search.status_id;
                search.notes = match.contact_search.note || '';

                if (match.contact_search.manager_id) {

                  search.brokerContact = new ContactModel();
                  search.brokerContact.id = match.contact_search.manager_id;
                  search.brokerContact.firstName = match.contact_search.manager_firstname;
                  search.brokerContact.lastName = match.contact_search.manager_lastname;
                }

                matching.contact.searches.push(search);
              }

              matching.property = null;

              // List of duplicate matches
              if (match.duplicate_match_id.length > 0) {

                matching.duplicateMatchingIds = match.duplicate_match_id.slice(0);
              }

              return matching;
            });

          // Unknown matching group
          } else {

            return null;
          }

          return matchingGroup;
        })
        .filter(matchingGroup => matchingGroup !== null),
      total: parseInt(response.recordsTotal, 10),
    };
  }
}
