import { FEATURE_NAME } from '../state';
import { ContractModel } from '../../../shared/model/contract.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class ContractUpsert extends UpsertAbstract<ContractModel, DataStateInterface<ContractModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = ContractUpsert.TYPE;
}
