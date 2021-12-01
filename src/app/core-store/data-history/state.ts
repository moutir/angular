import { HistoryModel } from '../../shared/model/history.model';
import { DataStateInterface } from '../data-state.interface';
import { Dictionary } from '../../shared/class/dictionary';

export const FEATURE_NAME = 'data-history';

export interface DataHistoryStateInterface extends DataStateInterface<HistoryModel> {

  // History IDs per entity hash
  byEntityHash: Dictionary<string[]>;
}

export const initialState: DataHistoryStateInterface = {
  models: {},
  byEntityHash: {},
};
