import { AgencyModel } from '../../shared/model/agency.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-agency';

export interface DataAgencyStateInterface extends DataStateInterface<AgencyModel> {

}

export const initialState: DataAgencyStateInterface = {
  models: {},
};
