import { FEATURE_NAME } from '../state';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class PromotionUpsert extends UpsertAbstract<PromotionModel, DataStateInterface<PromotionModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = PromotionUpsert.TYPE;
}
