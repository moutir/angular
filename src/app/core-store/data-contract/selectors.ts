import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataContractStateInterface, FEATURE_NAME } from './state';
import { ContractModel } from '../../shared/model/contract.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataContractStateInterface>
  = createFeatureSelector<DataContractStateInterface>(FEATURE_NAME);

export const selectDataContracts: MemoizedSelector<object, Dictionary<ContractModel>> = createSelector(
  selectDataState,
  (state: DataContractStateInterface) => state.models,
);

export const selectDataContract = (id: string): MemoizedSelector<object, ContractModel|null> => createSelector(
  selectDataContracts,
  (models: Dictionary<ContractModel>) => models[id] || null,
);
