import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataPromotionStateInterface, FEATURE_NAME } from './state';
import { PromotionModel } from '../../shared/model/promotion.model';

export const selectDataState: MemoizedSelector<object, DataPromotionStateInterface>
  = createFeatureSelector<DataPromotionStateInterface>(FEATURE_NAME);

export const selectDataPromotions: MemoizedSelector<object, Dictionary<PromotionModel>> = createSelector(
  selectDataState,
  (state: DataPromotionStateInterface) => state.models,
);

export const selectDataPromotion = (id: string): MemoizedSelector<object, PromotionModel|null> => createSelector(
  selectDataPromotions,
  (models: Dictionary<PromotionModel>) => models[id] || null,
);
