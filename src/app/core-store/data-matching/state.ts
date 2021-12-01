import { MatchingModel } from '../../shared/model/matching.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-matching';

export interface DataMatchingStateInterface extends DataStateInterface<MatchingModel> {

}

export const initialState: DataMatchingStateInterface = {
  models: {},
};
