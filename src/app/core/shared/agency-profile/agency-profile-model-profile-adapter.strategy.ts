import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { PhoneTypeEnum } from '../../../shared/enum/phone-type.enum';
import { FormArrayModelConfigInterface } from '../../../shared/interface/form-array-model-config.interface';

import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';
import { AgencyModel } from '../../../shared/model/agency.model';
import { ContactAddressModel } from '../../../shared/model/contact-address.model';
import { ContactEmailModel } from '../../../shared/model/contact-email.model';
import { ContactPhoneModel } from '../../../shared/model/contact-phone.model';
import { ContactSocialModel } from '../../../shared/model/contact-social.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { ifIsNotRemoved } from '../../../shared/validator/if-is-not-removed.validator';
import { phoneNumberValidator } from '../../../shared/validator/phone-number.validator';
import { yearValidator } from '../../../shared/validator/year.validator';
import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';

@Injectable()
export class AgencyProfileModelProfileAdapterStrategy extends FormModelAdapterStrategy<AgencyModel> {

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
  getFormControlConfig(model: AgencyModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      name: {
        value: model.name,
        validators: [Validators.required],
      },
      reference: {
        value: model.reference,
        validators: [],
      },
      foundingYear: {
        value: model.foundingYear,
        validators: [yearValidator()],
      },
      employeeCount: {
        value: model.employeeCount,
        validators: [],
      },
      founder: {
        value: model.founder,
        validators: [],
      },
      director: {
        value: model.director,
        validators: [],
      },
      president: {
        value: model.president,
        validators: [],
      },
      administrator: {
        value: model.administrator,
        validators: [],
      },
      description: {
        value: model.description,
        validators: [],
      },
      emailTemplateId: {
        value: model.emailTemplateId,
        validators: [],
      },
      bgColorHeaderFooter: {
        value: model.bgColorHeaderFooter,
        validators: [],
      },
      textColorHeaderFooter: {
        value: model.textColorHeaderFooter,
        validators: [],
      },
      bgColorMain: {
        value: model.bgColorMain,
        validators: [],
      },
      textColorMain: {
        value: model.textColorMain,
        validators: [],
      },
      bgColorMessage: {
        value: model.bgColorMessage,
        validators: [],
      },
      textColorMessage: {
        value: model.textColorMessage,
        validators: [],
      },
      bgColorTitle: {
        value: model.bgColorTitle,
        validators: [],
      },
      textColorTitle: {
        value: model.textColorTitle,
        validators: [],
      },
      mobiles: {
        value: model.mobiles.map(agencyMobile => {

          return {
            isRemoved: agencyMobile.isRemoved,
            number: agencyMobile.number,
            notes: agencyMobile.notes,
            isMainNumber: agencyMobile.isMainNumber,
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
        value: model.landlines.map(agencyLandline => {

          return {
            isRemoved: agencyLandline.isRemoved,
            number: agencyLandline.number,
            notes: agencyLandline.notes,
            isMainNumber: agencyLandline.isMainNumber,
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
        value: model.emails.map(agencyEmail => {

          return {
            isRemoved: agencyEmail.isRemoved,
            emailId: agencyEmail.emailId,
            notes: agencyEmail.notes,
            isMainEmail: agencyEmail.isMainEmail,
            isUsedMailing: agencyEmail.isUsedMailing,
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
        value: model.addresses.map(agencyAddress => {

          return {
            isRemoved: agencyAddress.isRemoved,
            line1: agencyAddress.line1,
            line2: agencyAddress.line2,
            line3: agencyAddress.line3,
            zipCode: agencyAddress.zipCode,
            city: agencyAddress.city,
            countryId: agencyAddress.countryId,
            notes: agencyAddress.notes,
            isMainAddress: agencyAddress.isMainAddress,
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
        value: model.socials.map(agencySocial => {

          return {
            isRemoved: agencySocial.isRemoved,
            network: agencySocial.network,
            url: agencySocial.url,
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
  getModel(model: AgencyModel, formGroup: FormGroup, path: string, value: Object|Object[]): AgencyModel {

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
