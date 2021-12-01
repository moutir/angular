import { AgencyModel } from '../../shared/model/agency.model';
import { MlsModel } from '../../shared/model/mls.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-mls';

export interface DataMlsStateInterface extends DataStateInterface<MlsModel> {

  // Mls agencies
  agencies: AgencyModel[];
}

export const initialState: DataMlsStateInterface = {
  models: {},
  agencies: [],
};
