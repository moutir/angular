import { Injectable } from '@angular/core';

import { LegacyAgencyHydrator } from './legacy-agency.hydrator';
import { HelperService } from '../../../../core/shared/helper.service';
import { LegacyMlsDataInterface } from './legacy-mls-data.interface';
import { MlsModel } from '../../../../shared/model/mls.model';

@Injectable()
export class LegacyMlsHydrator {

  /**
   * Constructor
   */
  constructor(
    private legacyAgencyHydrator: LegacyAgencyHydrator,
    private helperService: HelperService,
  ) {

  }

  /**
   * Return a MlsModel from MlsDataInterface
   */
  hydrateModel(data: LegacyMlsDataInterface): MlsModel {

    const mls = new MlsModel();

    mls.id = data.id;
    mls.statusId = data.statusId;
    mls.invitationDate = this.helperService.stringToDate(data.invitationDatetime);
    mls.startDate = this.helperService.stringToDate(data.startDatetime);
    mls.endDate = this.helperService.stringToDate(data.endDatetime);

    if (data.agency) {

      mls.agency = this.legacyAgencyHydrator.hydrateModel(data.agency);
    }

    if (data.partnerAgency) {

      mls.partnerAgency = this.legacyAgencyHydrator.hydrateModel(data.partnerAgency);
    }

    if (data.startByAgency) {

      mls.startByAgency = this.legacyAgencyHydrator.hydrateModel(data.startByAgency);
    }

    if (data.endByAgency) {

      mls.endByAgency = this.legacyAgencyHydrator.hydrateModel(data.endByAgency);
    }

    return mls;
  }
}
