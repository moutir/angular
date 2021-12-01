/// <reference types="@types/googlemaps" />
import { NgZone } from '@angular/core';

import { AddressStrategyAbstract } from '../address-strategy.abstract';
import { GooglePlacesAddressInterface } from '../../../shared/interface/google-places-address.interface';
import { Dictionary } from 'app/shared/class/dictionary';

export class GooglePlacesStrategy extends AddressStrategyAbstract {

  /**
   * Places autocomplete instance by UID
   */
  private autocomplete: Dictionary<google.maps.places.Autocomplete> = {};

  /**
   * Down key pressed on the autocomplete input?
   */
  private isKeydown: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private ngZone: NgZone,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  render(uid: string, el: HTMLInputElement, countryRestrictions: string[]): void {

    // Render input
    this.autocomplete[uid] = new google.maps.places.Autocomplete(
      el,
      {
        types: ['geocode'],
        fields: ['address_component', 'geometry'],
        componentRestrictions: {
          country: countryRestrictions,
        },
      },
    );

    // Event listeners
    this.autocomplete[uid].addListener('place_changed', () => this.ngZone.run(() => this.onSelectPlace(uid, el.value || '')));
    google.maps.event.addDomListener(el, 'keydown', (event: KeyboardEvent) => this.ngZone.run(() => this.onKeydown(event)));
  }

  /**
   * Selected a place in places autocomplete
   */
  private onSelectPlace(uid: string, query: string): void {

    const location: GooglePlacesAddressInterface = <GooglePlacesAddressInterface>{};

    // Get the place details from the autocomplete object.
    const place = this.autocomplete[uid].getPlace();

    if (!place.address_components) {

      return;
    }

    place.address_components.forEach(component => {

      location[component.types[0]] = component.long_name;
    });

    this.addressInputSubject.next({
      uid: uid,
      address: {
        string: query.trim(),
        houseNumber: (location.street_number && location.route) ? location.street_number.trim() : '',
        street: (location.route || location.street_number || '').trim(),
        city: [(location.locality || ''), (location.political || ''), (location.postal_town || '')].join(' ').trim(),
        zipCode: (location.postal_code || '').trim(),
        coordinates: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      },
    });
  }

  /**
   * Keydown on autocomplete input
   */
  private onKeydown(event: KeyboardEvent): void {

    if (event.keyCode === 13 && !this.isKeydown) {

      // Trigger down arrow to select the first autocomplete suggestion
      google.maps.event.trigger(event.currentTarget, 'keydown', {
          keyCode: 40,
          stopPropagation: () => {},
          preventDefault: () => {},
        },
      );
    }

    this.isKeydown = event.keyCode === 40;
  }
}
