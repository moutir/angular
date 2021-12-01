import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AddressInputInterface } from '../../shared/interface/address-input.interface';

@Injectable()
export abstract class AddressStrategyAbstract {

  /**
   * Address input observable
   */
  addressInput$: Observable<AddressInputInterface>;

  /**
   * Address input subject
   */
  protected addressInputSubject: Subject<AddressInputInterface> = new Subject<AddressInputInterface>();

  /**
   * Constructor
   */
  constructor() {

    this.addressInput$ = this.addressInputSubject.asObservable();
  }

  /**
   * Render address input
   */
  abstract render(uid: string, el: HTMLInputElement, countryRestrictions: string[]): void;
}
