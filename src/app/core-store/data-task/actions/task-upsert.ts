import { FEATURE_NAME } from '../state';
import { TaskModel } from '../../../shared/model/task.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class TaskUpsert extends UpsertAbstract<TaskModel, DataStateInterface<TaskModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = TaskUpsert.TYPE;
}
