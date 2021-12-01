import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { TaskModel } from '../../shared/model/task.model';
import { TaskModelGeneralAdapterStrategy } from '../../core/shared/task/task-model-general-adapter.strategy';
import { TaskOptionsInterface } from '../../shared/interface/task-options.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { PromotionModel } from '../../shared/model/promotion.model';
import { PropertyModel } from '../../shared/model/property.model';
import { ContactModel } from '../../shared/model/contact.model';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureTaskInterface } from '../../shared/interface/runtime-feature-task.interface';

@Component({
  selector: 'app-task-form-general',
  templateUrl: './task-form-general.component.html',
  styleUrls: ['./task-form-general.component.scss'],
})
export class TaskFormGeneralComponent extends FormComponentAbstract<
  TaskModel,
  TaskOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_BROKER_INTERMEDIATE: EntityEnum[] = [EntityEnum.broker, EntityEnum.intermediate];
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_PROMOTION: EntityEnum[] = [EntityEnum.property, EntityEnum.promotion];
  readonly PERMISSION_AGENDA_READ: PermissionEnum = PermissionEnum.agendaRead;

  /**
   * List of enabled/disabled features
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Task feature
   */
  @Input() featureTask: RuntimeFeatureTaskInterface;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: TaskModelGeneralAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed selection autocomplete contact
   */
  onChangeSelectionContact(selection: AutocompleteSelectionInterface, fieldName: keyof TaskModel): void {

    this.setValueAutocompleteContact(selection, fieldName);
  }

  /**
   * Changed autocomplete selection
   */
  onChangeSelectionObject(selection: AutocompleteSelectionInterface): void {

    if (selection.entity === EntityEnum.property) {

      return this.setValueAutocompleteProperty(selection);
    }

    if (selection.entity === EntityEnum.promotion) {

      return this.setValueAutocompletePromotion(selection);
    }
  }

  /**
   * Clicked the button to remove entity
   */
  onClickRemoveEntity(index: number, fieldName: keyof TaskModel): void {

    const entities = this.formGroup.get(fieldName).value.filter((entity, i) => i !== index);

    // Update input by removing an entity
    this.setValue(fieldName, entities);
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    const options = {
      emitEvent: false,
    };

    // Disable/enable form
    this.model.isSystemGenerated === true ? this.formGroup.disable(options) : this.formGroup.enable(options);

    // Always enable notes
    this.formGroup.get('brokerNotes').enable(options);
    this.formGroup.get('contactNotes').enable(options);
    this.formGroup.get('publicReport').enable(options);

    // System generated task
    if (this.model.isSystemGenerated === true) {

      // Enable the editable fields for system generated task
      this.formGroup.get('isShownInReports').enable(options);

      return;
    }

    // Disable agenda field on task edit
    this.model.id ? this.formGroup.get('agendaIds').disable(options) : this.formGroup.get('agendaIds').enable(options);

    // Disable checkbox if no properties selected
    this.model.properties.length === 0 ?
      this.formGroup.get('isSendMessageToOwner').disable(options) :
      this.formGroup.get('isSendMessageToOwner').enable(options)
    ;
  }

  /**
   * Set value for autocomplete contact
   */
  private setValueAutocompleteContact(selection: AutocompleteSelectionInterface, fieldName: keyof TaskModel): void {

    const contacts = this.formGroup.get(fieldName).value.slice(0);

    const isExisting = contacts.find(c => c.id === selection.id);

    // Contact already selected
    if (isExisting) {

      return;
    }

    // Generate contact
    const contact = new ContactModel();
    contact.id = selection.id;
    contact.fullName = selection.text.split(' - ')[0];

    contacts.push(contact);

    // Update input by adding a contact
    return this.setValue(fieldName, contacts);
  }

  /**
   * Set value for autocomplete property
   */
  private setValueAutocompleteProperty(selection: AutocompleteSelectionInterface): void {

    const properties = this.formGroup.get('properties').value.slice(0);
    const isExisting = properties.find(p => p.id === selection.id);

    // Property already selected
    if (isExisting) {

      return;
    }

    // Generate property
    const property = new PropertyModel();
    property.id = selection.id;
    property.reference = selection.text;
    property.isLoading = true;

    properties.push(property);

    // Update input by adding a property
    return this.setValue('properties', properties);
  }

  /**
   * Set value for autocomplete promotion
   */
  private setValueAutocompletePromotion(selection: AutocompleteSelectionInterface): void {

    const promotions = this.formGroup.get('promotions').value.slice(0);
    const isExisting = promotions.find(p => p.id === selection.id);

    // Promotion already selected
    if (isExisting) {

      return;
    }

    // Generate promotion
    const promotion = new PromotionModel();
    promotion.id = selection.id;
    promotion.reference = selection.text;
    promotion.isLoading = true;

    promotions.push(promotion);

    // Update input by adding a promotion
    return this.setValue('promotions', promotions);
  }
}
