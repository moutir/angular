import { Injectable } from '@angular/core';

import { LegacyAgencyDataInterface } from './legacy-agency-data.interface';
import { AgencyModel } from '../../../../shared/model/agency.model';
import { DocumentModel } from '../../../../shared/model/document.model';

@Injectable()
export class LegacyAgencyHydrator {

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Return a AgencyModel from AgencyDataInterface
   */
  hydrateModel(data: LegacyAgencyDataInterface): AgencyModel {

    const agency = new AgencyModel();

    agency.id = data.id;
    agency.name = data.name;
    agency.logo = new DocumentModel();
    agency.logo.fileUrl = data.logoUrl;
    agency.logo.photoSmallURL = data.logoUrl;
    agency.isActive = data.isActive;

    return agency;
  }

  /**
   * Return a AgencyDataInterface from AgencyModel
   */
  hydrateData(model: AgencyModel): LegacyAgencyDataInterface {

    return {
      id: model.id,
      name: model.name,
      logoUrl: model.logo.photoSmallURL,
      isActive: model.isActive,
    };
  }
}
