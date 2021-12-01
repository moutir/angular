import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AgencyPreferenceModel } from '../../shared/model/agency-preference.model';
import { AgencyPreferenceOptionsInterface } from '../../shared/interface/agency-preference-options.interface';
import { AgencyPreferenceContentInterface } from '../../shared/interface/agency-preference-content.interface';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-agency-preference-form-required',
  templateUrl: './agency-preference-form-required.component.html',
  styleUrls: ['./agency-preference-form-required.component.scss'],
})
export class AgencyPreferenceFormRequiredComponent extends FormComponentAbstract<
  AgencyPreferenceModel,
  AgencyPreferenceOptionsInterface
> {

  /**
   * Description per agency preference
   */
  @Input() content: AgencyPreferenceContentInterface = {
    pages: [],
  };

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<AgencyPreferenceModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }
}
