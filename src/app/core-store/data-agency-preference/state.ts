import { AgencyPreferenceModel } from '../../shared/model/agency-preference.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-agency-preference';

export interface DataAgencyPreferenceStateInterface extends DataStateInterface<AgencyPreferenceModel> {

}

export const initialState: DataAgencyPreferenceStateInterface = {
  models: {},
};
