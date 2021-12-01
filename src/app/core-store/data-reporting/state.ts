import { ReportingModel } from '../../shared/model/reporting.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-reporting';

export interface DataReportingStateInterface extends DataStateInterface<ReportingModel> {

}

export const initialState: DataReportingStateInterface = {
  models: {},
};
