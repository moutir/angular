import { Injectable } from '@angular/core';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { AgencyBackupModel } from '../../../shared/model/agency-backup.model';

@Injectable()
export class AgencyBackupService extends ModelServiceAbstract<AgencyBackupModel> {

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): AgencyBackupModel {

    return new AgencyBackupModel();
  }
}
