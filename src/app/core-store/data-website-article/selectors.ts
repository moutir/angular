import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataWebsiteArticleStateInterface, FEATURE_NAME } from './state';
import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataWebsiteArticleStateInterface>
  = createFeatureSelector<DataWebsiteArticleStateInterface>(FEATURE_NAME);

export const selectDataWebsiteArticles: MemoizedSelector<object, Dictionary<WebsiteArticleModel>> = createSelector(
  selectDataState,
  (state: DataWebsiteArticleStateInterface) => state.models,
);

export const selectDataWebsiteArticle = (id: string): MemoizedSelector<object, WebsiteArticleModel|null> => createSelector(
  selectDataWebsiteArticles,
  (models: Dictionary<WebsiteArticleModel>) => models[id] || null,
);
