import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataPropertyStateInterface, FEATURE_NAME } from './state';
import { PropertyModel } from '../../shared/model/property.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataPropertyStateInterface>
  = createFeatureSelector<DataPropertyStateInterface>(FEATURE_NAME);

export const selectDataProperties: MemoizedSelector<object, Dictionary<PropertyModel>> = createSelector(
  selectDataState,
  (state: DataPropertyStateInterface) => state.models,
);

export const selectDataProperty = (id: string): MemoizedSelector<object, PropertyModel|null> => createSelector(
  selectDataProperties,
  (models: Dictionary<PropertyModel>) => models[id] || null,
);
