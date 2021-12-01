import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataWebsiteStateInterface, FEATURE_NAME } from './state';
import { WebsiteModel } from '../../shared/model/website.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataWebsiteStateInterface>
  = createFeatureSelector<DataWebsiteStateInterface>(FEATURE_NAME);

export const selectDataWebsites: MemoizedSelector<object, Dictionary<WebsiteModel>> = createSelector(
  selectDataState,
  (state: DataWebsiteStateInterface) => state.models,
);

export const selectDataWebsite = (id: string): MemoizedSelector<object, WebsiteModel|null> => createSelector(
  selectDataWebsites,
  (models: Dictionary<WebsiteModel>) => models[id] || null,
);
