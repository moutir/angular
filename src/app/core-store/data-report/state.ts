import { ReportModel } from '../../shared/model/report.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-report';

export interface DataReportStateInterface extends DataStateInterface<ReportModel> {

}

export const initialState: DataReportStateInterface = {
  models: {},
};
