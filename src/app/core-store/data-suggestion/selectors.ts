import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataSuggestionStateInterface, FEATURE_NAME } from './state';
import { SuggestionModel } from '../../shared/model/suggestion.model';

export const selectDataState: MemoizedSelector<object, DataSuggestionStateInterface>
  = createFeatureSelector<DataSuggestionStateInterface>(FEATURE_NAME);

export const selectDataSuggestions: MemoizedSelector<object, Dictionary<SuggestionModel>> = createSelector(
  selectDataState,
  (state: DataSuggestionStateInterface) => state.models,
);

export const selectDataSuggestion = (id: string): MemoizedSelector<object, SuggestionModel|null> => createSelector(
  selectDataSuggestions,
  (models: Dictionary<SuggestionModel>) => models[id] || null,
);
