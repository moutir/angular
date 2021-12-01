import { PromotionModel } from '../../shared/model/promotion.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-promotion';

export interface DataPromotionStateInterface extends DataStateInterface<PromotionModel> {

}

export const initialState: DataPromotionStateInterface = {
  models: {},
};
