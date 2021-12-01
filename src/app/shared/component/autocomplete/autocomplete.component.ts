import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FloatLabelType } from '@angular/material';

import { AutocompleteSelectionInterface } from '../../interface/autocomplete-selection.interface';
import { AutocompleteSuggestionInterface } from '../../interface/autocomplete-suggestion.interface';
import { OptionInterface } from '../../interface/option.interface';
import { AutocompleteService } from '../../../core/shared/autocomplete.service';
import { EntityEnum } from '../../enum/entity.enum';
import { ContactTypeEnum } from '../../enum/contact-type.enum';
import { ListTypeEnum } from '../../enum/list-type.enum';
import { AutocompleteSearchInterface } from '../../interface/autocomplete-search.interface';
import { AutocompleteSuffixInterface } from '../../interface/autocomplete-suffix.interface';

@Component({
  selector: 'app-shared-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * UID
   */
  @Input() uid: string = '';

  /**
   * Entities to search for
   */
  @Input() entities: EntityEnum[] = [];

  /**
   * Limit the number of results
   */
  @Input() limit: number = 10;

  /**
   * Type to search for
   */
  @Input() filterType: ContactTypeEnum|ListTypeEnum|null = null; // TODO[nico] feels dirty, to be improved

  /**
   * Search for archived values only
   */
  @Input() filterIsArchived: boolean = false;

  /**
   * Input placeholder
   */
  @Input() placeholder: string = '';

  /**
   * Selection ID
   */
  @Input() selectionId: string = '';

  /**
   * Selection text
   */
  @Input() selectionText: string = '';

  /**
   * Input label float type
   */
  @Input() floatLabel: FloatLabelType = 'auto';

  /**
   * Is the autocomplete disabled ?
   */
  @Input() isDisabled: boolean = false;

  /**
   * Display selection text
   */
  @Input() isDisplayedSelectionText: boolean = false;

  /**
   * Error message
   */
  @Input() error: string = '';

  /**
   * Suffix as icon and/or counter
   */
  @Input() suffix: AutocompleteSuffixInterface|null = null;

  /**
   * Selected a value
   */
  @Output() changeSelection: EventEmitter<AutocompleteSelectionInterface> = new EventEmitter<AutocompleteSelectionInterface>();

  /**
   * Changed query
   */
  @Output() changeQuery: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Clicked suffix
   */
  @Output() clickSuffix: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Query input
   */
  formControl: FormControl;

  /**
   * Suggestions to current query
   *
   * @important Must NOT be an observable in order to be compatible with autocomplete.component.html
   */
  suggestions: AutocompleteSuggestionInterface[] = [];

  /**
   * Loading state
   *
   * @important Must NOT be an observable in order to be compatible with autocomplete.component.html
   */
  isLoading: boolean = true;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private autocompleteService: AutocompleteService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Create form control
    this.formControl = new FormControl();

    // Subscribe to form control value changes
    this.subscriptions.push(
      this.formControl.valueChanges
        .pipe(
          filter(value => typeof value === 'string'),
        )
        .subscribe(value => this.onNextQuery(value)),
    );

    // Register autocomplete
    this.autocompleteService.register(this.uid, {
      entities: this.entities,
      query: '',
      archived: false,
      limit: this.limit,
    });

    // Set state observables
    this.subscriptions.push(
      this.autocompleteService.selectSuggestions(this.uid).subscribe(suggestions => this.suggestions = suggestions),
    );
    this.subscriptions.push(
      this.autocompleteService.selectIsLoading(this.uid).subscribe(isLoading => this.isLoading = isLoading),
    );

    // Next cycle
    setTimeout(() => this.update());
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (!this.formControl) {

      return;
    }

    this.update();
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe
    this.subscriptions.forEach(subscription => subscription.unsubscribe());

    // Unregister autocomplete
    this.autocompleteService.unregister(this.uid);
  }

  /**
   * Return empty string as autocomplete displayed value
   */
  displayWith(option?: OptionInterface): string | undefined {

    return this.isDisplayedSelectionText && this.selectionText || '';
  }

  /**
   * Changed input value
   */
  onChange(): void {

    const isEmpty = this.formControl.value === '';

    this.setSelection({
      id: isEmpty ? '' : this.selectionId,
      text: isEmpty ? '' : this.selectionText,
    }, isEmpty);
  }

  /**
   * Selected a result
   */
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {

    const selection = event.option.value as AutocompleteSelectionInterface;

    this.setSelection(selection, true);
  }

  /**
   * Clicked suffix
   */
  onClickSuffix(event: MouseEvent): void {

    event.stopPropagation();

    this.clickSuffix.emit();
  }

  /**
   * Update component
   */
  private update(): void {

    const options = {
      emitEvent: false,
    };

    // Selection
    this.setSelection({
      id: this.selectionId,
      text: this.selectionText,
    }, false);

    // Disable/enable
    this.isDisabled ? this.formControl.disable(options) : this.formControl.enable(options);

    // Error
    this.formControl.markAsTouched();
    this.formControl.setErrors(this.error ? { error: this.error } : null);
  }

  /**
   * Update selection
   */
  private setSelection(selection: AutocompleteSelectionInterface, emitEvent: boolean): void {

    this.selectionId = selection.id;
    this.selectionText = selection.text;

    this.formControl.patchValue(selection);
    this.formControl.markAsTouched();
    this.formControl.setErrors(this.error ? { error: this.error } : null);

    if (emitEvent === true) {

      this.changeSelection.emit(selection);
    }
  }

  /**
   * Next query
   */
  private onNextQuery(query: string): void {

    const search: AutocompleteSearchInterface = {
      entities: this.entities,
      query: query,
      archived: this.filterIsArchived,
      limit: this.limit,
    };

    if (this.filterType) {

      search.type = this.filterType;
    }

    this.autocompleteService.searchQuery(this.uid, search);

    this.changeQuery.emit(query);
  }
}
