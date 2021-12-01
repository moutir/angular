import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { startWith } from 'rxjs/operators';
import { MatAutocomplete, MatChipInputEvent } from '@angular/material';

import { OptionInterface } from '../../interface/option.interface';

@Component({
  selector: 'app-shared-input-chip-list',
  templateUrl: './input-chip-list.component.html',
  styleUrls: ['./input-chip-list.component.scss'],
})
export class InputChipListComponent implements OnInit, OnChanges {

  /**
   * Selection of options
   */
  @Input() selection: OptionInterface[] = [];

  /**
   * Options available for selection
   */
  @Input() options: OptionInterface[] = [];

  /**
   * Input placeholder
   */
  @Input() placeholder: string = '';

  /**
   * Error message
   */
  @Input() error: string = '';

  /**
   * Translation format, Ex: 'suggestion_tag_{text}'
   */
  @Input() translationFormat: string = '{text}';

  /**
   * Changed selection
   */
  @Output() changeSelection: EventEmitter<OptionInterface[]> = new EventEmitter<OptionInterface[]>();

  /**
   * Form control
   */
  formControl: FormControl = new FormControl();

  /**
   * Filter results
   */
  results: OptionInterface[] = [];

  /**
   * DOM references
   */
  @ViewChild('chipInput', { static: false }) chipInput: ElementRef<HTMLInputElement>;
  @ViewChild('chipAutocomplete', { static: false }) chipAutocomplete: MatAutocomplete;

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.formControl.valueChanges
      .pipe(startWith(''))
      .subscribe(value => this.onChangeInput(value));
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Error
    this.formControl.markAsTouched();
    this.formControl.setErrors(this.error ? { error: this.error } : null);
  }

  /**
   * Changed text input value
   */
  onChangeInput(value: string|null): void {

    if (typeof value === 'string' && !!value) {

      this.results = this.options.filter(option => option.text.toLowerCase().indexOf(value.toLowerCase()) > -1);

      return;
    }

    this.results = this.options.slice(0);
  }

  /**
   * Added new option from text input
   */
  onAdd(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;

    if (typeof value === 'string' && value.trim()) {

      const selection = this.selection.slice(0);
      selection.push({
        value: '',
        text: this.translationFormat.replace('{text}', value.trim().toLowerCase()),
      });

      this.changeSelection.emit(selection);
    }

    // Reset the input value
    if (input) {

      input.value = '';
    }

    this.formControl.setValue(null);
  }

  /**
   * Clicked remove button
   */
  onClickRemove(removed: OptionInterface): void {

    // Compare TEXT and not VALUE, in order to support removal of option not recorded in DB yet
    const index = this.selection.findIndex(option => option.text === removed.text);

    if (index >= 0) {

      const selection = this.selection.slice(0);
      selection.splice(index, 1);

      this.changeSelection.emit(selection);
    }
  }

  /**
   * Selected an option
   */
  onSelect(event: MatAutocompleteSelectedEvent): void {

    // Compare TEXT and not VALUE, in order to support removal of option not recorded in DB yet
    if (!this.selection.find(option => option.text === event.option.value.text)) {

      const selection = this.selection.slice(0);
      selection.push(event.option.value);

      this.changeSelection.emit(selection);
    }

    this.chipInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }
}
