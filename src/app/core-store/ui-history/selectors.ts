import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiHistoryStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { HistoryInterface } from '../../shared/interface/history.interface';
import { HistoryModel } from '../../shared/model/history.model';
import { selectDataByEntityHash, selectDataHistories } from '../data-history/selectors';
import { Dictionary } from '../../shared/class/dictionary';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiHistoryStateInterface>
  = createFeatureSelector<UiHistoryStateInterface>(FEATURE_NAME);

/**
 * Select history
 */
export const selectUiHistory: MemoizedSelector<StateInterface, HistoryInterface> = createSelector(
  selectUiState,
  (state: UiHistoryStateInterface): HistoryInterface => state.history,
);

/**
 * Select history models
 */
export const selectUiModels: MemoizedSelector<StateInterface, HistoryModel[]|null> = createSelector(
  selectUiHistory,
  selectDataHistories,
  selectDataByEntityHash,
  (
    history: HistoryInterface,
    histories: Dictionary<HistoryModel>,
    byEntityHash: Dictionary<string[]>,
  ): HistoryModel[]|null => {

    if (history.entity === null) {

      return null;
    }

    const hash = [history.entity, history.entityId].join('_');

    const models = byEntityHash[hash] ? byEntityHash[hash].map(historyId => histories[historyId]) : null;

    return models;
  },
);
