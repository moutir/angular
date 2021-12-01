import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { PortalModel } from '../../../shared/model/portal.model';
import { ModelAbstract } from '../../../shared/class/model.abstract';
import { AgencyModel } from '../../../shared/model/agency.model';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';

@Injectable()
export class PortalModelContactAdapterStrategy extends FormModelAdapterStrategy<PortalModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: PortalModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      agencyStreet: {
        value: model.agency.mainAddress,
        validators: [],
      },
      agencyZip: {
        value: model.agency.zipCode,
        validators: [],
      },
      agencyCity: {
        value: model.agency.city,
        validators: [],
      },
      agencyCountry: {
        value: model.agency.countryId,
        validators: [],
      },
      agencyContact: {
        value: model.agency.contactName,
        validators: [],
      },
      agencyFax: {
        value: model.agency.fax,
        validators: [],
      },
      sendLeadCopyRentals: {
        value: model.sendLeadCopyRentals,
        validators: [],
      },
      sendLeadCopySales: {
        value: model.sendLeadCopySales,
        validators: [],
      },
      sendEmptyFile: {
        value: model.sendEmptyFile,
        validators: [],
      },
      sendBrokerPhone: {
        value: model.sendBrokerPhone,
        validators: [],
      },
      sendLeadCopy: {
        value: model.sendLeadCopy,
        validators: [],
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(
    model: PortalModel,
    formGroup: FormGroup,
    key: string,
    value: string|string[]|Date|boolean|null|number|ModelAbstract|ModelAbstract[],
  ): PortalModel {

    const newModel = model.clone<PortalModel>();
    const newAgency = newModel.agency.clone<AgencyModel>();

    if (key === 'agencyStreet') {

      newAgency.mainAddress = String(value);
      newModel.agency = newAgency;

      return newModel;
    }

    if (key === 'agencyZip') {

      newAgency.zipCode = String(value);
      newModel.agency = newAgency;

      return newModel;
    }

    if (key === 'agencyCity') {

      newAgency.city = String(value);
      newModel.agency = newAgency;

      return newModel;
    }

    if (key === 'agencyCountry') {

      newAgency.countryId = String(value);
      newModel.agency = newAgency;

      return newModel;
    }

    if (key === 'agencyContact') {

      newAgency.contactName = String(value);
      newModel.agency = newAgency;

      return newModel;
    }

    if (key === 'agencyFax') {

      newAgency.fax = String(value);
      newModel.agency = newAgency;

      return newModel;
    }

    newModel[key] = value;

    return newModel;
  }
}
