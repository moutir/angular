import { TaskModel } from '../../shared/model/task.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-task';

export interface DataTaskStateInterface extends DataStateInterface<TaskModel> {

}

export const initialState: DataTaskStateInterface = {
  models: {},
};
