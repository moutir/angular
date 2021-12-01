import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { FormComponentAbstract } from '../form/form-component.abstract';
import { PhoneTypeEnum } from '../../enum/phone-type.enum';
import { ContactOptionsInterface } from '../../interface/contact-options.interface';
import { ContactModel } from '../../model/contact.model';
import { ContactModelAdapterStrategy } from '../../../core/shared/contact/contact-model-adapter.strategy';

@Component({
  selector: 'app-shared-contact-form-required',
  templateUrl: './contact-form-required.component.html',
  styleUrls: ['./contact-form-required.component.scss'],
})
export class ContactFormRequiredComponent extends FormComponentAbstract<
  ContactModel,
  ContactOptionsInterface
> {

  /**
   * Constants
   */
  readonly PHONE_TYPE_MOBILE: PhoneTypeEnum = PhoneTypeEnum.mobile;
  readonly PHONE_TYPE_LANDLINE: PhoneTypeEnum = PhoneTypeEnum.landline;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: ContactModelAdapterStrategy,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Return the social network name
   */
  getSocialMediaName(network: string): string {

    const option = this.options.socialMedia && this.options.socialMedia.find(o => o.value === network);

    return option && option.text || '';
  }
}
