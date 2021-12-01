import { AfterViewInit, Directive, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AbstractControl } from '@angular/forms';

import { AddressInterface } from '../../shared/interface/address.interface';
import { AddressService } from './address.service';

@Directive({
  selector: '[appAddress]',
})
export class AddressDirective implements AfterViewInit, OnChanges, OnDestroy {

  /**
   * Contextual element settings
   */
  @Input() appAddress: {
    uid: string;
    countryRestrictions: string[];
    control: AbstractControl;
  };

  /**
   * Address value
   */
  @Input() appAddressValue: AddressInterface|string|null;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private el: ElementRef,
    private addressService: AddressService,
  ) {

  }

  /**
   * After initialized view
   */
  ngAfterViewInit(): void {

    // Set input attributes
    this.el.nativeElement.setAttribute('autocomplete', 'off');
    this.el.nativeElement.setAttribute('autocorrect', 'off');
    this.el.nativeElement.setAttribute('spellcheck', 'false');

    // DOM event listener
    this.el.nativeElement.addEventListener('keydown', (e: KeyboardEvent) => e.key === 'Enter' ? e.preventDefault() : null);

    // Render input
    this.addressService.render(this.appAddress.uid, this.el.nativeElement, this.appAddress.countryRestrictions);

    // Subscribe to address updates for this address UID
    this.subscriptions.push(
      this
        .addressService
        .addressInput$
        .pipe(filter(addressInput => addressInput.uid === this.appAddress.uid))
        .subscribe(addressInput => this.onNextAddress(addressInput.address)),
    );
  }

  /**
   * Changed input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Address value changed for an AddressInterface
    if (
      changes.appAddressValue &&
      this.appAddressValue &&
      typeof this.appAddressValue === 'object' &&
      this.appAddressValue.hasOwnProperty('string')
    ) {

      // Override displayed value
      this.el.nativeElement.value = (<AddressInterface>this.appAddressValue).string;
    }
  }

  /**
   * Destroyed directive
   */
  ngOnDestroy(): void {

    // Unsubscribe observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Next address
   */
  onNextAddress(address: AddressInterface): void {

    // Set control value
    this.appAddress.control.setValue(address);
  }
}
