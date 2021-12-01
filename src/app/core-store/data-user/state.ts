import { UserModel } from '../../shared/model/user.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-user';

export interface DataUserStateInterface extends DataStateInterface<UserModel> {

}

export const initialState: DataUserStateInterface = {
  models: {},
};
