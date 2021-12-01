import { AccountModel } from '../../shared/model/account.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-account';

export interface DataAccountStateInterface extends DataStateInterface<AccountModel> {

}

export const initialState: DataAccountStateInterface = {
  models: {},
};
