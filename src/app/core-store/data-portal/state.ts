import { PortalModel } from '../../shared/model/portal.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-portal';

export interface DataPortalStateInterface extends DataStateInterface<PortalModel> {

}

export const initialState: DataPortalStateInterface = {
  models: {},
};
