import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataReportingStateInterface, FEATURE_NAME } from './state';
import { ReportingModel } from '../../shared/model/reporting.model';

export const selectDataState: MemoizedSelector<object, DataReportingStateInterface>
  = createFeatureSelector<DataReportingStateInterface>(FEATURE_NAME);

export const selectDataReportings: MemoizedSelector<object, Dictionary<ReportingModel>> = createSelector(
  selectDataState,
  (state: DataReportingStateInterface) => state.models,
);

export const selectDataReporting = (id: string): MemoizedSelector<object, ReportingModel|null> => createSelector(
  selectDataReportings,
  (models: Dictionary<ReportingModel>) => models[id] || null,
);
