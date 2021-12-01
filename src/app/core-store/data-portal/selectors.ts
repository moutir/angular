import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataPortalStateInterface, FEATURE_NAME } from './state';
import { PortalModel } from '../../shared/model/portal.model';

export const selectDataState: MemoizedSelector<object, DataPortalStateInterface>
  = createFeatureSelector<DataPortalStateInterface>(FEATURE_NAME);

export const selectDataPortals: MemoizedSelector<object, Dictionary<PortalModel>> = createSelector(
  selectDataState,
  (state: DataPortalStateInterface) => state.models,
);

export const selectDataPortal = (id: string): MemoizedSelector<object, PortalModel|null> => createSelector(
  selectDataPortals,
  (models: Dictionary<PortalModel>) => models[id] || null,
);
