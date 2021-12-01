import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalModelContactAdapterStrategy } from '../../core/shared/portal/portal-model-contact-adapter.strategy';
import { PortalOptionsInterface } from '../../shared/interface/portal-options.interface';

@Component({
  selector: 'app-portal-form-contact',
  templateUrl: './portal-form-contact.component.html',
  styleUrls: ['./portal-form-contact.component.scss'],
})
export class PortalFormContactComponent extends FormComponentAbstract<
  PortalModel,
  PortalOptionsInterface
> {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: PortalModelContactAdapterStrategy,
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
