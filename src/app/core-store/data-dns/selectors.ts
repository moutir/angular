import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataDnsStateInterface, FEATURE_NAME } from './state';
import { DnsModel } from '../../shared/model/dns.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataDnsStateInterface>
  = createFeatureSelector<DataDnsStateInterface>(FEATURE_NAME);

export const selectDataDnsRecords: MemoizedSelector<object, Dictionary<DnsModel>> = createSelector(
  selectDataState,
  (state: DataDnsStateInterface) => state.models,
);

export const selectDataDnsRecord = (id: string): MemoizedSelector<object, DnsModel|null> => createSelector(
  selectDataDnsRecords,
  (models: Dictionary<DnsModel>) => models[id] || null,
);
