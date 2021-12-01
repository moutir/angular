import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TaskSearchModel } from '../../shared/model/task-search.model';
import { TaskSearchOptionsInterface } from '../../shared/interface/task-search-options.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-task-form-search',
  templateUrl: './task-form-search.component.html',
  styleUrls: ['./task-form-search.component.scss'],
})
export class TaskFormSearchComponent extends FormComponentAbstract<
  TaskSearchModel,
  TaskSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_CONTACT: EntityEnum[] = [EntityEnum.contact];
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY_PROMOTION: EntityEnum[] = [EntityEnum.property, EntityEnum.promotion];

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<TaskSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete task-addressee selection
   */
  onChangeSelectionTaskAddressee(selection: AutocompleteSelectionInterface): void {

    const value = this.model.clientIds.slice(0);
    value.push(selection.id);

    return this.setValue('clientIds', value);
  }

  /**
   * Changed autocomplete property/promotion selection
   */
  onChangeSelectionPropertyPromotion(selection: AutocompleteSelectionInterface): void {

    // Property
    if (selection.entity === EntityEnum.property) {

      const value = this.model.propertyIds.slice(0);
      value.push(selection.id);

      return this.setValue('propertyIds', value);
    }

    // Promotion
    if (selection.entity === EntityEnum.promotion) {

      const value = this.model.promotionIds.slice(0);
      value.push(selection.id);

      return this.setValue('promotionIds', value);
    }
  }
}
