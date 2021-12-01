/// <reference types="@types/googlemaps" />
import { Injectable } from '@angular/core';

import { AddressStrategyAbstract } from './address-strategy.abstract';

/**
 * AddressService is a decorator of AddressStrategyAbstract, used as injection token
 */
@Injectable()
export class AddressService extends AddressStrategyAbstract {

  /**
   * Constructor
   */
  constructor(
    private strategy: AddressStrategyAbstract,
  ) {

    super();

    this.addressInput$ = this.strategy.addressInput$;
  }

  /**
   * @inheritDoc
   */
  render(uid: string, el: HTMLInputElement, countryRestrictions: string[]): void {

    this.strategy.render(uid, el, countryRestrictions);
  }
}
