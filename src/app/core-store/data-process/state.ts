import { ProcessModel } from '../../shared/model/process.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-process';

export interface DataProcessStateInterface extends DataStateInterface<ProcessModel> {

}

export const initialState: DataProcessStateInterface = {
  models: {},
};
