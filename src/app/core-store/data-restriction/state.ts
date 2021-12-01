import { RestrictionModel } from '../../shared/model/restriction.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-restriction';

export interface DataRestrictionStateInterface extends DataStateInterface<RestrictionModel> {

}

export const initialState: DataRestrictionStateInterface = {
  models: {},
};
