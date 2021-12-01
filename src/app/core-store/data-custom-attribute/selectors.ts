import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataCustomAttributeStateInterface, FEATURE_NAME } from './state';
import { CustomAttributeModel } from '../../shared/model/custom-attribute.model';

export const selectDataState: MemoizedSelector<object, DataCustomAttributeStateInterface>
  = createFeatureSelector<DataCustomAttributeStateInterface>(FEATURE_NAME);

export const selectDataCustomAttributes: MemoizedSelector<object, Dictionary<CustomAttributeModel>> = createSelector(
  selectDataState,
  (state: DataCustomAttributeStateInterface) => state.models,
);

export const selectDataCustomAttribute = (id: string): MemoizedSelector<object, CustomAttributeModel|null> => createSelector(
  selectDataCustomAttributes,
  (models: Dictionary<CustomAttributeModel>) => models[id] || null,
);
