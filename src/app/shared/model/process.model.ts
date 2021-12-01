import { ModelAbstract } from '../class/model.abstract';
import { AgencyModel } from './agency.model';
import { ProcessLogModel } from './process-log.model';

export class ProcessModel extends ModelAbstract {

  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
    'logs',
  ];

  id: string = '';
  agency: AgencyModel = new AgencyModel();
  status: string = '';
  type: string = '';
  label: string = '';
  startDate: Date|null = null;
  endDate: Date|null = null;
  logs: ProcessLogModel[] = [];
}
