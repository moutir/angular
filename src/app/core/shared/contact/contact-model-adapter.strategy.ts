import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { ContactModel } from '../../../shared/model/contact.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { phoneNumberValidator } from '../../../shared/validator/phone-number.validator';
import { PhoneTypeEnum } from '../../../shared/enum/phone-type.enum';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactSocialModel } from '../../../shared/model/contact-social.model';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';

@Injectable()
export class ContactModelAdapterStrategy extends FormModelAdapterStrategy<ContactModel> {

  /**
   * @inheritDoc
   */
  readonly FORM_ARRAY_MODEL_CONFIG: KeyValueType<string, FormArrayModelConfigInterface> = {
    mobiles: {
      factory: (): ModelAbstract => new ContactPhoneModel(),
      radioCheckboxes: ['isMainNumber'],
    },
    landlines: {
      factory: (): ModelAbstract => new ContactPhoneModel(),
      radioCheckboxes: ['isMainNumber'],
    },
    addresses: {
      factory: (): ModelAbstract => new ContactAddressModel(),
      radioCheckboxes: ['isMainAddress'],
    },
    emails: {
      factory: (): ModelAbstract => new ContactEmailModel(),
      radioCheckboxes: ['isMainEmail'],
    },
    socials: {
      factory: (): ModelAbstract => new ContactSocialModel(),
    },
  };

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: ContactModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      firstName: {
        value: model.firstName,
        validators: [],
      },
      lastName: {
        value: model.lastName,
        validators: [Validators.required],
      },
      titleId: {
        value: model.titleId,
        validators: [],
      },
      greetingId: {
        value: model.greetingId,
        validators: [],
      },
      languageId: {
        value: model.languageId,
        validators: [],
      },
      birthDate: {
        value: model.birthDate,
        validators: [],
      },
      nationalityId: {
        value: model.nationalityId,
        validators: [],
      },
      companyName: {
        value: model.companyName,
        validators: [],
      },
      profession: {
        value: model.profession,
        validators: [],
      },
      maritalStatusId: {
        value: model.maritalStatusId,
        validators: [],
      },
      childrenId: {
        value: model.childrenId,
        validators: [],
      },
      bankReference: {
        value: model.bankReference,
        validators: [],
      },
      mobiles: {
        value: model.mobiles.map(contactMobile => {

          return {
            isRemoved: contactMobile.isRemoved,
            number: contactMobile.number,
            notes: contactMobile.notes,
            isMainNumber: contactMobile.isMainNumber,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          number: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required), ifIsNotRemoved(phoneNumberValidator(PhoneTypeEnum.mobile))],
          },
          notes: {
            value: '',
            validators: [],
          },
          isMainNumber: {
            value: false,
            validators: [],
            updateOn: 'change',
          },
        },
      },
      landlines: {
        value: model.landlines.map(contactMobile => {

          return {
            isRemoved: contactMobile.isRemoved,
            number: contactMobile.number,
            notes: contactMobile.notes,
            isMainNumber: contactMobile.isMainNumber,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          number: {
            value: '',
            validators: [ifIsNotRemoved(Validators.required), ifIsNotRemoved(phoneNumberValidator(PhoneTypeEnum.landline))],
          },
          notes: {
            value: '',
            validators: [],
          },
          isMainNumber: {
            value: false,
            validators: [],
            updateOn: 'change',
          },
        },
      },
      emails: {
        value: model.emails.map(contactEmail => {

          return {
            isRemoved: contactEmail.isRemoved,
            emailId: contactEmail.emailId,
            notes: contactEmail.notes,
            isMainEmail: contactEmail.isMainEmail,
            isUsedMailing: contactEmail.isUsedMailing,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          emailId: {
            value: '',
            validators: [Validators.email],
          },
          notes: {
            value: '',
            validators: [],
          },
          isMainEmail: {
            value: false,
            validators: [],
            updateOn: 'change',
          },
          isUsedMailing: {
            value: true,
            validators: [],
            updateOn: 'change',
          },
        },
      },
      addresses: {
        value: model.addresses.map(contactAddress => {

          return {
            isRemoved: contactAddress.isRemoved,
            line1: contactAddress.line1,
            line2: contactAddress.line2,
            line3: contactAddress.line3,
            zipCode: contactAddress.zipCode,
            city: contactAddress.city,
            countryId: contactAddress.countryId,
            notes: contactAddress.notes,
            isMainAddress: contactAddress.isMainAddress,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          line1: {
            value: '',
            validators: [],
          },
          line2: {
            value: '',
            validators: [],
          },
          line3: {
            value: '',
            validators: [],
          },
          zipCode: {
            value: '',
            validators: [],
          },
          city: {
            value: '',
            validators: [],
          },
          countryId: {
            value: '',
            validators: [],
          },
          notes: {
            value: '',
            validators: [],
          },
          isMainAddress: {
            value: false,
            validators: [],
            updateOn: 'change',
          },
        },
      },
      socials: {
        value: model.socials.map(contactSocial => {

          return {
            isRemoved: contactSocial.isRemoved,
            network: contactSocial.network,
            url: contactSocial.url,
          };
        }),
        validators: [],
        formArrayConfig: {
          isRemoved: {
            value: false,
            validators: [],
          },
          network: {
            value: '',
            validators: [],
          },
          url: {
            value: '',
            validators: [],
          },
        },
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: ContactModel, formGroup: FormGroup, path: string, value: Object|Object[]): ContactModel {

    const newModel = super.getModel(model, formGroup, path, value);

    // Updating emails
    if (path === 'emails') {

      // Make main email always as "used in mailing"
      newModel.emails.some((email, i) => {

        if (email.isMainEmail === true) {

          newModel.emails[i].isUsedMailing = true;

          return true;
        }
      });
    }

    return newModel;
  }
}
