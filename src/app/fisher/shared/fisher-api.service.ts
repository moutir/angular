import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../api/http/phalcon-http.service';
import { FisherInterface } from './interface/fisher.interface';
import { FisherModel } from './model/fisher.model';
import { FisherValuationRequestInterface } from './interface/fisher-valuation-request.interface';
import { FisherValuationResponseInterface } from './interface/fisher-valuation-response.interface';
import { FisherConfig } from '../fisher.config';

@Injectable()
export class FisherApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private fisherConfig: FisherConfig,
  ) {

  }

  /**
   * Submit for the valuation
   */
  valuation(form: FisherInterface): Observable<FisherModel> {

    const request = this.valuationRequest(form);

    return this
      .httpService
      .post<FisherValuationRequestInterface, FisherValuationResponseInterface>(
        this.fisherConfig.apiEndpoint,
        request,
        null,
        false,
        {
          'X-Api-Key': this.fisherConfig.apiKey,
        },
      ).pipe(
        map(response => this.valuationResponse(response)),
      );
  }

  /**
   * Handle a valuation() form parameter and return a formatted request
   */
  private valuationRequest(form: FisherInterface): FisherValuationRequestInterface {

    return {
      recaptcha_token: form.contactInfo.recaptcha,
      deal_type: 'sale',
      property: {
        type: form.propertyInfo.category,
        subtype: form.propertyInfo.subCategory,
        building_year: form.propertyInfo.year,
        living_area: form.propertyInfo.livingArea,
        land_area: form.propertyInfo.landArea,
        condition: form.propertyInfo.state,
        floor: form.propertyInfo.floor,
        rooms: form.propertyInfo.rooms,
        bathrooms: form.propertyInfo.bathrooms,
        location: {
          address: {
            street: form.locationInfo.street,
            house_number: form.locationInfo.houseNumber,
            post_code: form.locationInfo.zipCode,
            city: form.locationInfo.city,
          },
          coordinates: {
            latitude: form.locationInfo.coordinates.lat,
            longitude: form.locationInfo.coordinates.lng,
          },
        },
      },
      contact: {
        first_name: form.contactInfo.firstName,
        last_name: form.contactInfo.lastName,
        email: form.contactInfo.email,
        mobile: form.contactInfo.mobile,
        motivation: form.contactInfo.motivation,
        country_code: form.contactInfo.country,
        city: form.contactInfo.city,
        address1: form.contactInfo.address1,
        address2: form.contactInfo.address2,
        post_code: form.contactInfo.zip,
        language: form.contactInfo.language,
      },
    };
  }

  /**
   * Handle a valuation() response and return FisherModel
   */
  private valuationResponse(response: FisherValuationResponseInterface): FisherModel {

    if (!response) {

      return null;
    }

    const model = new FisherModel();

    model.contactId = response.contact_id;
    model.leadId = response.lead_id;

    if (response.valuation) {

      model.confidence = response.valuation.confidence;
      model.currency = response.valuation.currency;
      model.valueRangeLower = response.valuation.valueRangeLower;
      model.valueRangeUpper = response.valuation.valueRangeUpper;
    }

    return model;
  }
}
