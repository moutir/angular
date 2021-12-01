import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-custom-attribute';

export interface DataCustomAttributeStateInterface extends DataStateInterface<CustomAttributeModel> {

}

export const initialState: DataCustomAttributeStateInterface = {
  models: {},
};
