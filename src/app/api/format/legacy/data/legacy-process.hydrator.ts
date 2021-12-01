import { Injectable } from '@angular/core';

import { HelperService } from '../../../../core/shared/helper.service';
import { ProcessModel } from '../../../../shared/model/process.model';
import { ProcessLogModel } from '../../../../shared/model/process-log.model';
import { LegacyProcessDataInterface } from './legacy-process-data.interface';
import { LegacyProcessLogDataInterface } from './legacy-process-log-data.interface';
import { LegacyAgencyHydrator } from './legacy-agency.hydrator';

@Injectable()
export class LegacyProcessHydrator {

  /**
   * Constructor
   */
  constructor(
    private legacyAgencyHydrator: LegacyAgencyHydrator,
    private helperService: HelperService,
  ) {

  }

  /**
   * Return a ProcessModel from LegacyProcessDataInterface
   */
  hydrateModel(data: LegacyProcessDataInterface): ProcessModel {

    const process = new ProcessModel();

    process.id = data.id;
    process.status = data.status;
    process.type = data.type;
    process.label = data.label;
    process.startDate = this.helperService.stringToDate(data.startDatetime, false);
    process.endDate = this.helperService.stringToDate(data.endDatetime, false);
    process.logs = data.logs.map(processLogData => this.hydrateModelLog(processLogData));

    if (data.agency) {

      process.agency = this.legacyAgencyHydrator.hydrateModel(data.agency);
    }

    return process;
  }

  /**
   * Return a ProcessLogModel from a ProcessLogDataInterface
   */
  hydrateModelLog(data: LegacyProcessLogDataInterface): ProcessLogModel {

    const processLog = new ProcessLogModel();

    processLog.id = data.id;
    processLog.status = data.status;
    processLog.uid = data.uid;
    processLog.data = data.data;

    return processLog;
  }
}
