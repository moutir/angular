import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataReportStateInterface, FEATURE_NAME } from './state';
import { ReportModel } from '../../shared/model/report.model';

export const selectDataState: MemoizedSelector<object, DataReportStateInterface>
  = createFeatureSelector<DataReportStateInterface>(FEATURE_NAME);

export const selectDataReports: MemoizedSelector<object, Dictionary<ReportModel>> = createSelector(
  selectDataState,
  (state: DataReportStateInterface) => state.models,
);

export const selectDataReport = (id: string): MemoizedSelector<object, ReportModel|null> => createSelector(
  selectDataReports,
  (models: Dictionary<ReportModel>) => models[id] || null,
);
