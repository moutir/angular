import { LegacyProcessLogDataInterface } from './legacy-process-log-data.interface';
import { LegacyAgencyDataInterface } from './legacy-agency-data.interface';

export interface LegacyProcessDataInterface {
  id: string;
  agency: LegacyAgencyDataInterface|null;
  status: string;
  type: string;
  label: string;
  startDatetime: string|null;
  endDatetime: string|null;
  logs: LegacyProcessLogDataInterface[];
}
