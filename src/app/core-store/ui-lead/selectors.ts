import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiLeadStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { selectDataOptions } from '../data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';
import { LeadModifyStatusInterface } from '../../shared/interface/lead-modify-status.interface';
import { LeadModifyStatusOptionsInterface } from '../../shared/interface/lead-modify-status-options.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiLeadStateInterface>
  = createFeatureSelector<UiLeadStateInterface>(FEATURE_NAME);

/**
 * Select contact validation active state
 */
export const selectUiIsActiveValidation: MemoizedSelector<StateInterface, boolean> = createSelector(
  selectUiState,
  (state: UiLeadStateInterface): boolean => state.isActiveValidation,
);

/**
 * Select lead modify status
 */
export const selectUiModifyStatus: MemoizedSelector<StateInterface, LeadModifyStatusInterface> = createSelector(
  selectUiState,
  (state: UiLeadStateInterface): LeadModifyStatusInterface => state.modifyStatus,
);

/**
 * Select lead modify status options
 */
export const selectUiModifyStatusOptions: MemoizedSelector<StateInterface, LeadModifyStatusOptionsInterface> = createSelector(
  selectDataOptions,
  (
    options: RuntimeOptionsInterface,
  ): LeadModifyStatusOptionsInterface => {

    return {
      status: options.leadStatus,
    };
  },
);
