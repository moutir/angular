import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatRadioChange } from '@angular/material';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { WebsiteModel } from '../../shared/model/website.model';
import { WebsiteModelGeneralAdapterStrategy } from '../../core/shared/website/website-model-general-adapter.strategy';
import { WebsiteOptionsInterface } from '../../shared/interface/website-options.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { WebsiteLayoutEnum } from '../../shared/enum/website-layout.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-website-form-general',
  templateUrl: './website-form-general.component.html',
  styleUrls: ['./website-form-general.component.scss'],
})
export class WebsiteFormGeneralComponent extends FormComponentAbstract<
  WebsiteModel,
  WebsiteOptionsInterface
> {

  /**
   * Constants
   */
  readonly WEBSITE_LAYOUT_WORDPRESS: WebsiteLayoutEnum = WebsiteLayoutEnum.wordpress;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Fisher set to active?
   */
  isActiveFisher: boolean = false;

  /**
   * Constants
   */
  readonly PERMISSION_WEBSITE_CONFIG_READ: PermissionEnum = PermissionEnum.websiteConfigRead;
  readonly PERMISSION_WEBSITE_CONTENT_READ: PermissionEnum = PermissionEnum.websiteContentRead;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: WebsiteModelGeneralAdapterStrategy,
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

    if (this.isLoading || this.isDisabled) {

      return;
    }

    // Toggle fields
    this.model.isInternal ? this.formGroup.get('layoutId').enable(options) : this.formGroup.get('layoutId').disable(options);
    this.model.isInternal ? this.formGroup.get('templateId').enable(options) : this.formGroup.get('templateId').disable(options);
  }

  /**
   * Changed fisher activation input
   */
  onChangeFisherActivation(event: MatRadioChange): void {

    this.isActiveFisher = event.value;
  }
}
