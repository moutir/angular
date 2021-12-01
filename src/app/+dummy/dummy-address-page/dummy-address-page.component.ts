import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { addressValidator } from '../../shared/validator/address.validator';

@Component({
  selector: 'app-dummy-address-page',
  templateUrl: './dummy-address-page.component.html',
  styleUrls: ['./dummy-address-page.component.scss'],
})
export class DummyAddressPageComponent implements OnInit, OnDestroy {

  /**
   * Form group
   */
  formGroup: FormGroup;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Form definition
    this.formGroup = this.formBuilder.group({
      reference: ['', [Validators.required]],
      address: [{
        string: 'Avenue de Champel 31, 1206 Genève',
        street: 'Avenue de Champel',
        houseNumber: '31',
        zipCode: '1206',
        city: 'Genève',
        coordinates: {
          lat: 0,
          lng: 0,
        },
      }, [Validators.required, addressValidator()]],
    });

    // Subscribe to form controls changes
    Object
      .keys(this.formGroup.controls)
      .forEach((key: string) => {

        this.subscriptions.push(
          this.formGroup.get(key).valueChanges.subscribe(value => this.onNextFieldValue(key, value)),
        );
      });
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Clicked button
   */
  onClickButton(): void {

    console.log('onClickButton', this.formGroup.getRawValue());
  }

  /**
   * Next field value
   */
  protected onNextFieldValue(key: string, value: string|string[]): void {

    console.log('onNextFieldValue', key, value);
  }
}
