import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PropertyMortgageInterface } from '../../shared/interface/property-mortgage.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { AuthenticationStore } from '../../authentication/shared/authentication.store';
import { UserModel } from '../../shared/model/user.model';
import { PropertyModel } from '../../shared/model/property.model';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-property-modal-mortgage',
  templateUrl: './property-modal-mortgage.component.html',
  styleUrls: ['./property-modal-mortgage.component.scss'],
})
export class PropertyModalMortgageComponent
  extends ModalComponentAbstract<PropertyMortgageInterface> implements OnInit, OnChanges {

  /**
   * Mortgage state
   */
  @Input() mortgage: PropertyMortgageInterface;

  /**
   * Mortgage property
   */
  @Input() property: PropertyModel;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Constants
   */
  readonly PERMISSION_MORTGAGE_WRITE: PermissionEnum = PermissionEnum.propertyMortgageWrite;
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];

  /**
   * Component autocomplete UID
   */
  uid: string;

  /**
   * Form group
   */
  formGroup: FormGroup;

  /**
   * State observables
   */
  sessionUser$: Observable<UserModel>;

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private authenticationStore: AuthenticationStore,
  ) {

    super();
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set state observables
    this.sessionUser$ = this.authenticationStore.user$;
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Became visible
    if (changes.isVisible && changes.isVisible.currentValue === true) {

      this.updateFormGroup();
    }
  }

  /**
   * Update the form group
   */
  updateFormGroup(): void {

    this.formGroup = this.formBuilder.group({
      propertyId: [this.mortgage.propertyId, Validators.required],
      contactId: [this.mortgage.contactId, Validators.required],
      query: [this.mortgage.query, Validators.required],
      isAgreed: [false, Validators.requiredTrue],
    });
  }

  /**
   * Changed selection in autocomplete
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface): void {

    this.formGroup.get('contactId').setValue(selection.id);
    this.formGroup.get('query').setValue(selection.text);
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    // Emit event
    this.submitModal.emit({
      isValid: isValid,
      data: {
        ...this.mortgage,
        step: isValid ? this.mortgage.step + 1 : 0,
        propertyId: this.formGroup.value.propertyId,
        contactId: this.formGroup.value.contactId,
        query: this.formGroup.value.query,
      },
    });
  }
}
