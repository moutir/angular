import { Component, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { AgencyProfileModelProfileAdapterStrategy } from '../../core/shared/agency-profile/agency-profile-model-profile-adapter.strategy';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AgencyModel } from '../../shared/model/agency.model';
import { AgencyOptionsInterface } from '../../shared/interface/agency-options.interface';
import { AgencyProfileService } from '../../core/shared/agency-profile/agency-profile.service';

@Component({
  selector: 'app-agency-profile-form-profile',
  templateUrl: './agency-profile-form-profile.component.html',
  styleUrls: ['./agency-profile-form-profile.component.scss'],
})
export class AgencyProfileFormProfileComponent extends FormComponentAbstract<
  AgencyModel,
  AgencyOptionsInterface
> implements OnChanges {

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: AgencyProfileModelProfileAdapterStrategy,
    private agencyProfileService: AgencyProfileService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Return the social network name
   */
  getSocialMediaName(network: string): string {

    if (network === 'website') {

      return 'label_website';
    }

    const option = this.options.socialMedia && this.options.socialMedia.find(o => o.value === network);

    return option && option.text || '';
  }

  /**
   * Color picked from color picker
   */
  onPickColor(fieldName: string, color: string): void {

    this.setValue(fieldName, color);
  }

  /**
   * Clicked on email preview button
   */
  onClickPreview(): void {

    this.agencyProfileService.emailPreview();
  }
}
