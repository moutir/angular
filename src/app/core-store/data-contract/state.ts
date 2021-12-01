import { ContractModel } from '../../shared/model/contract.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-contract';

export interface DataContractStateInterface extends DataStateInterface<ContractModel> {

}

export const initialState: DataContractStateInterface = {
  models: {},
};
