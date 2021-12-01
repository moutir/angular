import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataSectorStateInterface, FEATURE_NAME } from './state';
import { SectorModel } from '../../shared/model/sector.model';

export const selectDataState: MemoizedSelector<object, DataSectorStateInterface>
  = createFeatureSelector<DataSectorStateInterface>(FEATURE_NAME);

export const selectDataSectors: MemoizedSelector<object, Dictionary<SectorModel>> = createSelector(
  selectDataState,
  (state: DataSectorStateInterface) => state.models,
);

export const selectDataSector = (id: string): MemoizedSelector<object, SectorModel|null> => createSelector(
  selectDataSectors,
  (models: Dictionary<SectorModel>) => models[id] || null,
);
