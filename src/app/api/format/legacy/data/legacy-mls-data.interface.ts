import { LegacyAgencyDataInterface } from './legacy-agency-data.interface';
import { MlsStatusEnum } from '../../../../shared/enum/mls-status.enum';

export interface LegacyMlsDataInterface {
  id: string;
  agency: LegacyAgencyDataInterface|null;
  invitationDatetime: string|null;
  partnerAgency: LegacyAgencyDataInterface|null;
  startByAgency: LegacyAgencyDataInterface|null;
  endByAgency: LegacyAgencyDataInterface|null;
  endDatetime: string|null;
  startDatetime: string|null;
  statusId: MlsStatusEnum;
}
