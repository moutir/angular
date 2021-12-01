import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataLeadStateInterface, FEATURE_NAME } from './state';
import { LeadModel } from '../../shared/model/lead.model';
import { OptionInterface } from '../../shared/interface/option.interface';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataLeadStateInterface>
  = createFeatureSelector<DataLeadStateInterface>(FEATURE_NAME);

export const selectDataLeads: MemoizedSelector<object, Dictionary<LeadModel>> = createSelector(
  selectDataState,
  (state: DataLeadStateInterface) => state.models,
);

export const selectDataLead = (id: string): MemoizedSelector<object, LeadModel|null> => createSelector(
  selectDataLeads,
  (models: Dictionary<LeadModel>) => models[id] || null,
);

export const selectDataSubSourceBySource: MemoizedSelector<object, Dictionary<OptionInterface[]>> = createSelector(
  selectDataState,
  (state: DataLeadStateInterface) => state.subSourceBySourceId,
);
