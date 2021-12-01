import { WebsiteModel } from '../../shared/model/website.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-website';

export interface DataWebsiteStateInterface extends DataStateInterface<WebsiteModel> {

}

export const initialState: DataWebsiteStateInterface = {
  models: {},
};
