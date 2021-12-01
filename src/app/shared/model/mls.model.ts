import { ModelAbstract } from '../class/model.abstract';
import { AgencyModel } from './agency.model';
import { MlsStatusEnum } from '../enum/mls-status.enum';

export class MlsModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'agency',
    'partnerAgency',
    'startByAgency',
    'endByAgency',
  ];

  id: string = '';
  statusId: MlsStatusEnum = MlsStatusEnum.pending;
  agency: AgencyModel = new AgencyModel();
  partnerAgency: AgencyModel = new AgencyModel();
  startByAgency: AgencyModel = new AgencyModel();
  endByAgency: AgencyModel = new AgencyModel();
  startDate: Date = null;
  endDate: Date = null;
  invitationDate: Date = null;
}
