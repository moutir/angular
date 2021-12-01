import { PropertyModel } from '../../shared/model/property.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-property';

export interface DataPropertyStateInterface extends DataStateInterface<PropertyModel> {

}

export const initialState: DataPropertyStateInterface = {
  models: {},
};
