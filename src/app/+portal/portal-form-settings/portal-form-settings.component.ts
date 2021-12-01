import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalOptionsInterface } from '../../shared/interface/portal-options.interface';
import { PortalModelSettingsAdapterStrategy } from '../../core/shared/portal/portal-model-settings-adapter.strategy';

@Component({
  selector: 'app-portal-form-settings',
  templateUrl: './portal-form-settings.component.html',
  styleUrls: ['./portal-form-settings.component.scss'],
})
export class PortalFormSettingsComponent extends FormComponentAbstract<
  PortalModel,
  PortalOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: PortalModelSettingsAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected updateControls(): void {

    super.updateControls();

    const options = {
      emitEvent: false,
    };

    // Toggle fields disabled state based on portal value availability
    this.model.portalId ? this.formGroup.enable(options) : this.formGroup.disable(options);
  }
}
