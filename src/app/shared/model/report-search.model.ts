import { ListFiltersInterface } from '../interface/list-filters.interface';
import { ReportTypeEnum } from '../enum/report-type.enum';
import { ModelAbstract } from '../class/model.abstract';

export class ReportSearchModel extends ModelAbstract implements ListFiltersInterface {
  id: string = '';
  reportType: ReportTypeEnum|null = null;
  propertyIds: string[] = [];
  clientIds: string[] = [];
  brokerIds: string[] = [];
  dateFrom: Date|null = null;
  dateTo: Date|null = null;
  propertyTypeId: string|null = null;
  scheduleId: string|null = null;
}
