import { FormGroup, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { multipleEmailValidator } from '../../../shared/validator/multiple-email.validator';
import { PortalModel } from '../../../shared/model/portal.model';
import { phoneNumberValidator } from '../../../shared/validator/phone-number.validator';
import { PortalEnum } from '../../../shared/enum/portal.enum';
import { KeyValueType } from '../../../shared/type/key-value.type';
import { FormControlConfigInterface } from '../../../shared/interface/form-control-config.interface';

@Injectable()
export class PortalModelRequiredAdapterStrategy extends FormModelAdapterStrategy<PortalModel> {

  /**
   * @inheritDoc
   */
  getFormControlConfig(model: PortalModel): KeyValueType<string, FormControlConfigInterface> {

    return {
      label: {
        value: model.label,
        validators: [Validators.required],
      },
      portalId: {
        value: model.portalId,
        validators: [Validators.required],
      },
      languageCode: {
        value: model.languageCode,
        validators: [Validators.required],
      },
      portalAgencyId: {
        value: model.agency.id,
        validators: [Validators.required],
      },
      publicationSites: {
        value: model.publicationSites,
        validators: [],
      },
      agencyWebsiteId: {
        value: model.agencyWebsiteId,
        validators: [],
      },
      agencyName: {
        value: model.agency.name,
        validators: [Validators.required],
      },
      agencyPhoneSales: {
        value: model.agency.phoneSales,
        validators: [Validators.required, phoneNumberValidator()],
      },
      agencyPhoneRentals: {
        value: model.agency.phoneRentals,
        validators: [Validators.required, phoneNumberValidator()],
      },
      agencyEmailSales: {
        value: model.agency.emailSales,
        validators: [Validators.required, multipleEmailValidator(';')],
      },
      agencyEmailRentals: {
        value: model.agency.emailRentals,
        validators: [Validators.required, multipleEmailValidator(';')],
      },
      ftpHost: {
        value: model.ftpHost,
        validators: [Validators.required],
      },
      ftpPort: {
        value: model.ftpPort,
        validators: [Validators.required],
      },
      ftpLogin: {
        value: model.ftpLogin,
        validators: [Validators.required],
      },
      ftpPassword: {
        value: model.ftpPassword,
        validators: [Validators.required],
      },
      isActivePortal: {
        value: model.isActivePortal,
        validators: [],
      },
      ftpPasv: {
        value: model.ftpPasv,
        validators: [],
      },
      ftpIsActive: {
        value: model.ftpIsActive,
        validators: [],
      },
    };
  }

  /**
   * @inheritDoc
   */
  getModel(model: PortalModel, formGroup: FormGroup, path: string, value: Object|Object[]): PortalModel {

    const newModel = super.getModel(model, formGroup, path, value);

    if (path === 'agencyName') {

      newModel.agency.name = String(value);

      return newModel;
    }

    if (path === 'agencyPhoneSales') {

      newModel.agency.phoneSales = String(value);

      return newModel;
    }

    if (path === 'agencyPhoneRentals') {

      newModel.agency.phoneRentals = String(value);

      return newModel;
    }

    if (path === 'agencyEmailSales') {

      newModel.agency.emailSales = String(value);

      return newModel;
    }

    if (path === 'agencyEmailRentals') {

      newModel.agency.emailRentals = String(value);

      return newModel;
    }

    // Update FTP paths based on portal agency ID
    if (path === 'portalAgencyId') {

      newModel.agency.id = String(value);

      if (newModel.portalId === PortalEnum.previsite) {

        newModel.ftpDataFolder = '/' + newModel.agency.id;
        newModel.ftpImagesFolder = '/' + newModel.agency.id;
        newModel.ftpDocsFolder = '/' + newModel.agency.id;
        newModel.ftpMoviesFolder = '/' + newModel.agency.id;
      }

      if (
        [
          PortalEnum.futurhome,
          PortalEnum.jamesEdition,
          PortalEnum.helvethome,
          PortalEnum.scanpark,
          PortalEnum.immoving,
          PortalEnum.luxuryEstate,
          PortalEnum.bazzileRealforce,
        ].indexOf(newModel.portalId) > -1
      ) {

        newModel.ftpDataFolder = '/' + [newModel.agency.id, 'data'].filter(Boolean).join('/');
        newModel.ftpImagesFolder = '/' + [newModel.agency.id, 'images'].filter(Boolean).join('/');
        newModel.ftpDocsFolder = '/' + [newModel.agency.id, 'docs'].filter(Boolean).join('/');
        newModel.ftpMoviesFolder = '/' + [newModel.agency.id, 'movies'].filter(Boolean).join('/');
      }
    }

    return newModel;
  }
}
