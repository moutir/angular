import { SuggestionModel } from '../../shared/model/suggestion.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-suggestion';

export interface DataSuggestionStateInterface extends DataStateInterface<SuggestionModel> {

}

export const initialState: DataSuggestionStateInterface = {
  models: {},
};
