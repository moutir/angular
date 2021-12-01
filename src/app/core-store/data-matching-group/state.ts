import { MatchingGroupModel } from '../../shared/model/matching-group.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-matching-group';

export interface DataMatchingGroupStateInterface extends DataStateInterface<MatchingGroupModel> {

}

export const initialState: DataMatchingGroupStateInterface = {
  models: {},
};
