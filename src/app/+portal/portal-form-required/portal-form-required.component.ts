import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { PortalModel } from '../../shared/model/portal.model';
import { PortalModelRequiredAdapterStrategy } from '../../core/shared/portal/portal-model-required-adapter.strategy';
import { PortalOptionsInterface } from '../../shared/interface/portal-options.interface';
import { RuntimeFeaturePortalInterface } from '../../shared/interface/runtime-feature-portal.interface';

@Component({
  selector: 'app-portal-form-required',
  templateUrl: './portal-form-required.component.html',
  styleUrls: ['./portal-form-required.component.scss'],
})
export class PortalFormRequiredComponent extends FormComponentAbstract<
  PortalModel,
  PortalOptionsInterface
> {

  /**
   * Feature portal
   */
  @Input() featurePortal: RuntimeFeaturePortalInterface;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: PortalModelRequiredAdapterStrategy,
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
      onlySelf: true,
    };

    if (!this.model.portalId) {

      // Disable all fields except portal select field
      this.formGroup.disable(options);
      this.formGroup.get('portalId').enable(options);

      return;
    }

    if (this.model.isWithCredentials === false) {

      this.formGroup.get('ftpLogin').disable(options);
    }

    if (this.model.isWithCredentials === false) {

      this.formGroup.get('ftpPassword').disable(options);
    }
  }
}
