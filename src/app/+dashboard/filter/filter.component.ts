import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { PropertySearchResponseInterface } from '../../api/shared/mailbox/property-search-response.interface';
import { TokenInputSuggestionInterface } from '../../shared/interface/token-input-suggestion.interface';
import { HelperService } from '../../core/shared/helper.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {

  @Input() loadingText: any;
  @Input() noMatchFoundText: any;
  @Input() placeHolderToDate: any;
  @Input() placeHolderFromDate: any;
  @Input() searchContactText: any;
  @Input() searchPropetyText: any;
  @Input() isLoading: boolean = false;
  @Output() filterData: EventEmitter<any> = new EventEmitter();

  contact: any;
  contactsSource: any;
  propertiesSource: any;
  selectedContacts: any[] = [];
  selectedProperties: any[] = [];
  selectedToDate: any;
  selectedFromDate: Date;
  contactFormCtrl: FormControl = new FormControl();
  propertyFormCtrl: FormControl = new FormControl();
  contactOptions: TokenInputSuggestionInterface[] = [];
  propertyOptions: PropertySearchResponseInterface = [];

  /**
   * Constructor
   */
  constructor(
    private dashboardApiService: DashboardApiService,
    private helperService: HelperService,
  ) {

    this.selectedFromDate = new Date('01/01/' + (new Date()).getFullYear());

    this.contactFormCtrl
      .valueChanges
      .pipe(
        filter(value => typeof value === 'string' && value.trim().length >= 2),
        switchMap(value => this.dashboardApiService.loadAutocompleteSuggestions(value)),
      ).subscribe(value => this.onNextContacts(value))
    ;

    this.propertyFormCtrl
      .valueChanges
      .pipe(
        filter(value => typeof value === 'string' && value.trim().length >= 2),
        switchMap(value => this.dashboardApiService.loadEmailProperties(value)),
      ).subscribe(value => this.onNextProperties(value))
    ;
  }

  /**
   * Remove property from the filter
   */
  removeProperty(prop): void {

    this.selectedProperties = this.selectedProperties.filter(o => o.ref !== prop.ref);
  }

  /**
   * Remove contact from the filter
   */
  removeContact(contact: TokenInputSuggestionInterface): void {

    this.selectedContacts = this.selectedContacts.filter(o => o.data !== contact.data);
  }

  /**
   * Submit filter
   */
  submitFilter(isReset: boolean): void {

    const filter = {
      contacts: this.selectedContacts,
      properties: this.selectedProperties,
      date_to: this.selectedToDate ? this.helperService.dateToString(this.selectedToDate) : '',
      date_from: this.selectedFromDate ? this.helperService.dateToString(this.selectedFromDate) : '',
    };

    if (isReset) {

      filter['page'] = 1;
    }

    this.filterData.emit(filter);
  }

  /**
   * Reset filter
   */
  resetFilter(): void {

    this.selectedContacts = [];
    this.selectedProperties = [];
    this.selectedToDate = '';
    this.selectedFromDate = new Date('01/01/' + (new Date()).getFullYear());
    this.submitFilter(true);
  }

  /**
   * Next contacts
   */
  onNextContacts(contactOptions: TokenInputSuggestionInterface[]): void {

    this.contactOptions = contactOptions;
  }

  /**
   * Next properties
   */
  onNextProperties(propertyOptions: PropertySearchResponseInterface): void {

    this.propertyOptions = propertyOptions;
  }

  /**
   * Contact selected
   */
  onContactSelected(event: MatAutocompleteSelectedEvent): void {

    const option  = this.contactOptions.filter(opt => opt.data === event.option.value)[0];

    this.selectedContacts.push(option);
    this.contactFormCtrl.setValue('');
  }

  /**
   * Property selected
   */
  onPropertySelected(event: MatAutocompleteSelectedEvent): void {

    const option  = this.propertyOptions.filter(opt => opt.ref === event.option.value)[0];

    this.selectedProperties.push(option);
    this.propertyFormCtrl.setValue('');
  }
}
