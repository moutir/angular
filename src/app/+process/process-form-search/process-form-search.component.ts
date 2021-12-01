import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ProcessSearchOptionsInterface } from '../../shared/interface/process-search-options.interface';
import { ProcessSearchModel } from '../../shared/model/process-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';

@Component({
  selector: 'app-process-form-search',
  templateUrl: './process-form-search.component.html',
  styleUrls: ['./process-form-search.component.scss'],
})
export class ProcessFormSearchComponent extends FormComponentAbstract<
  ProcessSearchModel,
  ProcessSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_AGENCY: EntityEnum[] = [EntityEnum.agency];

  /**
   * Display agency field
   */
  @Input() isDisplayedAgency: boolean = false;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<ProcessSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete agency selection
   */
  onChangeSelectionAgency(selection: AutocompleteSelectionInterface): void {

    this.setValue('agencyId', selection.id);
  }
}
