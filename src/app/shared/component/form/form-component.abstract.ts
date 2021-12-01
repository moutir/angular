import { EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ModelAbstract } from '../../class/model.abstract';
import { ChangeFormEventInterface } from '../../interface/change-form-event.interface';
import { FormModelAdapterStrategy } from '../../../core/shared/form/form-model-adapter.strategy';
import { ErrorFormEventInterface } from '../../interface/error-form-event.interface';
import { FormControlConfigInterface } from '../../interface/form-control-config.interface';
import { KeyValueType } from '../../type/key-value.type';
import { FormArrayInterface } from '../../interface/form-array.interface';
import { Dictionary } from '../../../shared/class/dictionary';

export abstract class FormComponentAbstract<Model extends ModelAbstract, Options> implements OnInit, OnChanges, OnDestroy {

  /**
   * Model to generate form
   */
  @Input() model: Model;

  /**
   * List of options
   */
  @Input() options: Options;

  /**
   * Dictionary of error message per field
   */
  @Input() error: Dictionary<string|null> = {};

  /**
   * Is the form loading ?
   */
  @Input() isLoading: boolean = true;

  /**
   * Is the form disabled ?
   */
  @Input() isDisabled: boolean = false;

  /**
   * Changed form input and model
   */
  @Output() changeForm: EventEmitter<ChangeFormEventInterface<Model>> = new EventEmitter<ChangeFormEventInterface<Model>>();

  /**
   * Validation error
   */
  @Output() errorForm: EventEmitter<ErrorFormEventInterface> = new EventEmitter<ErrorFormEventInterface>();

  /**
   * Validation error
   */
  @Output() pristineForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Form group
   */
  formGroup: FormGroup;

  /**
   * Index of FormArray
   */
  formArray: KeyValueType<string, FormArrayInterface> = {};

  /**
   * Form array error count
   */
  formArrayErrorCount: KeyValueType<string, number> = {};

  /**
   * Observable subscriptions per control path
   */
  protected subscriptions: Subscription[] = [];

  /**
   * Debounce timer to update the form using the model
   */
  protected updateDebounceTimer: number = 0;

  /**
   * Is the form allowed to emit events ?
   */
  protected isAllowedEmitEvent: boolean = true;

  /**
   * Is the form validation active ? (automatically set to false if the form config has no validator at all)
   */
  protected isActiveValidation: boolean = true;

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<Model>,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.setStateObservable();

    this.isActiveValidation = this.hasValidators(
      this.modelAdapterStrategy.getFormControlConfig(this.model),
    );
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Start "update from outside" cycle
    this.setIsAllowedEmitEvent(false);

    // Form group not defined yet
    if (!this.formGroup) {

      // Build form
      this.build();
    }

    // Model, loading or disable input changed
    if (!!changes.model || !!changes.isLoading || !!changes.isDisabled) {

      // Disable/enable form
      this.isLoading || this.isDisabled ?
        this.formGroup.disable({emitEvent: false}) : this.formGroup.enable({emitEvent: false});
    }

    // Model changed
    if (!!changes.model) {

      // Update form
      this.updateFormValue();
      this.updateFormArray();

      // Emit pristine status
      this.pristineForm.emit(this.formGroup.pristine);
    }

    // Not loading nor disabled
    if (this.isLoading === false && this.isDisabled === false) {

      this.updateControls();
    }

    // Updated errors
    if (!!changes.error) {

      this.updateErrors();
    }

    // End "update from outside" cycle
    this.setIsAllowedEmitEvent(true);

    // Not loading anymore
    if (!!changes.isLoading && this.isLoading === false) {

      // Initialize form
      this.initialize();

      // Update form value to trigger Angular validation (next cycle after initialization is complete)
      setTimeout(() => this.updateFormValue());
    }

    // Model changed
    if (!!changes.model) {

      // Validate form
      this.validate();
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Return the FormArrayInterface identified by @name
   */
  getFormArray(name: string): FormArrayInterface|null {

    if (!this.formArray[name]) {

      return null;
    }

    return this.formArray[name];
  }

  /**
   * Return the form array's control error
   */
  getFormArrayError(path: string, index: number, controlName: string): string {

    return this.error[[path, index, controlName].join('.')] || '';
  }

  /**
   * Return the form array's index error count
   */
  getFormArrayErrorCount(path: string, index: number): number {

    const uid = [path, String(index)].join('.');

    return this.formArrayErrorCount[uid] || 0;
  }

  /**
   * Clicked on button to add form array control
   */
  onClickFormArrayAdd(path: string): void {

    const formArray = this.getFormArray(path);

    if (!formArray) {

      return ;
    }

    const formControlConfig = this.modelAdapterStrategy.getFormControlConfig(this.model)[path];
    const index = formArray.control.length;

    // Add control to form array
    this.addFormArrayChild(
      formArray.control,
      path,
      index,
      formControlConfig.formArrayConfig,
    );

    // Control value
    const controlValue = {};
    Object
      .keys(formControlConfig.formArrayConfig)
      .forEach(key => controlValue[key] = formControlConfig.formArrayConfig[key].value);

    this.updateFormArrayChild(formArray.control, path, index, controlValue);
  }

  /**
   * Clicked on button to remove form array control
   */
  onClickFormArrayToggle(path: string, index: number, isRemoved: boolean): void {

    const formArray = this.getFormArray(path);

    if (!formArray) {

      return ;
    }

    this.updateFormArrayChild(formArray.control, path, index, { isRemoved });
  }

  /**
   * Set is form allowed to emit events
   */
  protected setIsAllowedEmitEvent(isAllowedEmitEvent: boolean): void {

    this.isAllowedEmitEvent = isAllowedEmitEvent;
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    // Extend to define your state observables
  }

  /**
   * Build form
   */
  protected build(): void {

    // Generate form config
    const config = {};
    const formControlConfig = this.modelAdapterStrategy.getFormControlConfig(this.model);

    // Generate controls config
    Object
      .keys(formControlConfig)
      .forEach(path => config[path] = this.formControlFactory(formControlConfig[path], path));

    // Build form
    this.formGroup = this.formBuilder.group(config);
  }

  /**
   * Initialise form
   */
  protected initialize(): boolean {

    if (!this.formGroup) {

      console.error('You cannot initialize a form that has not been built yet!');

      return false;
    }

    // Extend if you need to manipulate the form once it has been built, like adding default values on runtime
    return true;
  }

  /**
   * Validate form current values.
   * You will only use/define cross-fields validators than belong to this form only.
   * Cross-field validators for the model in general go into ModelAdapter.validate().
   * Single-field validators go into ModelAdapter.getFormGroupConfig().
   *
   * Example:
   *
   * if (this.formGroup.get('password1').value === this.formGroup.get('password2').value) {
   *
   *   error.password1 = 'message_different_than_password2;
   *   error.password2 = 'message_different_than_password1;
   *
   *   this.errorForm.emit({
   *     name: 'password1',
   *     error: 'message_different_than_password2',
   *   });
   *
   *   this.errorForm.emit({
   *     name: 'password2',
   *     error: 'message_different_than_password1',
   *   });
   * }
   */
  protected validate(): void {

    if (this.isActiveValidation === false) {

      return;
    }

    const error = this.modelAdapterStrategy.validate(this.model, this.error);

    if (error === null) {

      return;
    }

    Object
      .keys(error)
      .forEach(key => this.emitError(key, error[key] || null));
  }

  /**
   * Instantiate a FormControl or FormArray for the control @name, based on the config @formControlConfig
   */
  protected formControlFactory(
    formControlConfig: FormControlConfigInterface,
    path: string,
    index: number|null = null,
    childName: string = '',
  ): FormControl|FormArray {

    // FormArray
    if (!!formControlConfig.formArrayConfig) {

      // The control becomes a form array
      this.formArray[path] = {
        control: this.formBuilder.array([], {
          validators: formControlConfig.validators,
          updateOn: formControlConfig.updateOn || 'blur',
        }),
        indexes: [],
      };

      // Add children
      (<Object[]>formControlConfig.value).forEach((child, i) => {

        const childConfig = {
          ...formControlConfig.formArrayConfig,
        };

        Object.keys(child).forEach(key => {

          if (!childConfig[key]) {

            console.error('formArrayConfig[', key, '] is not defined!');
          }

          childConfig[key].value = child[key];
        });

        this.addFormArrayChild(this.formArray[path].control, path, i, childConfig);
      });

      // Subscribe to form array updates
      this.formControlSubscribe(this.formArray[path].control, path);

      return this.formArray[path].control;
    }

    // FormControl
    const control = this.formBuilder.control(formControlConfig.value, {
      validators: formControlConfig.validators,
      updateOn: formControlConfig.updateOn || 'blur',
    });

    // Subscribe to form control updates
    this.formControlSubscribe(control, path, index, childName);

    return control;
  }

  /**
   * Subscribe to control value and status updates
   */
  formControlSubscribe(control: FormControl|FormArray, path: string, index: number|null = null, childName: string = ''): void {

    const fullPath = index === null ? path : [path, index, childName].join('.');

    this.subscriptions.push(
      control.valueChanges.subscribe(value => this.onNextFieldValue(fullPath, value)),
    );

    this.subscriptions.push(
      control.statusChanges.subscribe(status => this.onNextFieldStatus(fullPath, status)),
    );
  }

  /**
   * Add control to form array identified by @name
   */
  protected addFormArrayChild(
    formArray: FormArray,
    path: string,
    index: number|null,
    childConfig: KeyValueType<string, FormControlConfigInterface>,
  ): void {

    const formGroup = {};

    Object
      .keys(childConfig)
      .forEach(key => formGroup[key] = this.formControlFactory(childConfig[key], path, index, key));

    formArray.push(this.formBuilder.group(formGroup));
  }

  /**
   * Update control form array identified by @path
   */
  protected updateFormArrayChild(formArray: FormArray, path: string, index: number, patchValue: Object): void {

    // Trigger update value
    this.setValue([path, index].join('.'), {
      ...formArray.value[index],
      ...patchValue,
    });
  }

  /**
   * Update form value and trigger Angular validation
   */
  protected updateFormValue(): void {

    // Dictionary of latest control values
    const controlValues = {};
    const formControlConfig = this.modelAdapterStrategy.getFormControlConfig(this.model);

    Object
      .keys(formControlConfig)
      .forEach(key => {

        // Input does not exist
        if (this.formGroup.get(key) === null || !formControlConfig[key]) {

          return;
        }

        // Input is a form array
        if (!!formControlConfig[key].formArrayConfig) {

          const formArray = this.getFormArray(key);
          const difference = formArray.control.length - (<Object[]>formControlConfig[key].value).length;
          const addStartIndex = formArray.control.length;

          for (let i = 0; i < Math.abs(difference); i++) {

            if (difference < 0) {

              const childConfig: KeyValueType<string, FormControlConfigInterface> = {
                ...formControlConfig[key].formArrayConfig,
              };

              // Set child values
              Object
                .keys(formControlConfig[key].value[i])
                .forEach(attr => childConfig[attr].value = formControlConfig[key].value[i][attr]);

              this.addFormArrayChild(formArray.control, key, addStartIndex + i, childConfig);
            }

            if (difference > 0) {

              this.updateFormArrayChild(formArray.control, key, i, { isRemoved: true });
            }
          }
        }

        // Input value changed
        if (this.isAllowedEmitEvent === true || this.formGroup.get(key).value !== formControlConfig[key].value) {

          controlValues[key] = formControlConfig[key].value;
        }
      });

    // Patch values (ignore unknown attributes)
    this.formGroup.patchValue(controlValues, { emitEvent: !this.isLoading });
  }

  /**
   * Update form array indexes order
   */
  protected updateFormArray(): void {

    Object
      .keys(this.formArray)
      .forEach(formArrayName => {

        // Model and FormArray name do not match
        if (!this.model[formArrayName] || Array.isArray(this.model[formArrayName]) === false) {

          console.error('The form model does not have an attribute [', formArrayName, '] used as a FormArray.');

          return;
        }

        // Sort by order
        const indexes = this.model[formArrayName]
          .map((model, i) => i)
          .sort((aIndex: number, bIndex: number) => {

            // Model does not have getOrder() function
            if (!this.model[formArrayName][aIndex].getOrder || !this.model[formArrayName][bIndex].getOrder) {

              console.error('The model used as FormArray [', formArrayName, '] does not implement FormArrayModelInterface.');

              return 0;
            }

            const aOrder = this.model[formArrayName][aIndex].getOrder();
            const bOrder = this.model[formArrayName][bIndex].getOrder();

            if (aOrder === bOrder) {

              return 0;
            }

            return aOrder < bOrder ? -1 : 1;
          });

        // Indexes changed
        if (JSON.stringify(indexes) !== JSON.stringify(this.formArray[formArrayName].indexes)) {

          this.formArray[formArrayName].indexes = indexes;
        }
      });
  }

  /**
   * Update controls (unable/disable states)
   */
  protected updateControls(): void {

    return;
  }

  /**
   * Update errors
   */
  protected updateErrors(): void {

    // Reset form array error count
    this.formArrayErrorCount = {};

    // Update control errors without triggering change events
    Object
      .keys(this.error)
      .forEach(path => {

        // Set control as invalid or valid
        const control = this.formGroup.get(path);

        if (control) {

          const errors = {};

          // FormArray can be invalid with an undefined error, only null is considered as no error at all
          if (this.error[path] !== null) {

            errors[this.error[path]] = true;

            // Error count per form array index
            const pathChunk = path.split('.');
            if (pathChunk.length > 1 && this.formArray[pathChunk[0]]) {

              const formArrayIndexUid = [pathChunk[0], pathChunk[1]].join('.');

              if (!this.formArrayErrorCount[formArrayIndexUid]) {

                this.formArrayErrorCount[formArrayIndexUid] = 0;
              }

              this.formArrayErrorCount[formArrayIndexUid]++;
            }
          }

          control.setErrors(!this.error[path] ? null : errors, { emitEvent: true });
          control.markAsTouched();
        }
      })
    ;
  }

  /**
   * Set input value
   */
  protected setValue(path: string, value: Object|Object[]): void {

    const control = this.formGroup.get(path);
    control.markAsDirty();
    control.setValue(value, {emitEvent: true});
  }

  /**
   * Emit "errorForm" event
   */
  protected emitError(path: string, error: string): void {

    // Form is not allowed to emit events
    if (this.isAllowedEmitEvent === false || this.isActiveValidation === false) {

      return;
    }

    // Field became invalid or became valid
    if (error === this.error[path]) {

      return;
    }

    // Emit first error
    this.errorForm.emit({
      name: path,
      error: error ? this.getErrorName(error) : error,
    });
  }

  /**
   * Emit "changeForm" event
   */
  protected emitChangeForm(path: string, value: Object|Object[]): void {

    // Emit change form
    this.changeForm.emit({
      input: {
        name: path,
        value: value,
      },
      model: this.modelAdapterStrategy.getModel(this.model, this.formGroup, path, value),
    });
  }

  /**
   * Return a standardised error name
   */
  protected getErrorName(errorUid: string): string {

    return errorUid.indexOf('form_error_') !== 0 ? 'form_error_' + errorUid : errorUid;
  }

  /**
   * Returns true if the form config has validators
   */
  protected hasValidators(formControlConfig: KeyValueType<string, FormControlConfigInterface>): boolean {

    return Object
      .keys(formControlConfig)
      .some(key => {

        // Has custom validation function
        if (this.modelAdapterStrategy.validate(this.model, {}) !== null) {

          return true;
        }

        // Has validators
        if (Array.isArray(formControlConfig[key].validators) && formControlConfig[key].validators.length > 0) {

          return true;
        }

        // Is form array
        if (formControlConfig[key].formArrayConfig) {

          return this.hasValidators(formControlConfig[key].formArrayConfig);
        }

        return false;
      });
  }

  /**
   * Next field status
   */
  protected onNextFieldStatus(path: string, status: string): void {

    const errors = Object.keys(this.formGroup.get(path).errors || {});
    const error = status === 'INVALID' ? (errors[0] || 'is_invalid') : null;

    // Emit error
    this.emitError(path, error);
  }

  /**
   * Next field value
   */
  protected onNextFieldValue(path: string, value: string|string[]): void {

    // @PERFORMANCE If path is child of form array, don't emit
    const pathChunk = path.split('.');
    if (pathChunk.length > 1 && this.formArray[pathChunk[0]]) {

      return;
    }

    // Form is not allowed to emit events
    if (this.isAllowedEmitEvent === false) {

      return;
    }

    // Emit changeForm
    this.emitChangeForm(path, value);
  }
}
