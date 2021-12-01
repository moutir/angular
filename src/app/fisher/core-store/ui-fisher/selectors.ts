import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiFisherStateInterface } from './state';
import { DataFisherStateInterface } from '../data-fisher/state';
import { FisherModel } from '../../shared/model/fisher.model';
import { FisherInterface } from '../../shared/interface/fisher.interface';
import { StateInterface } from '../state.interface';
import { selectDataState } from '../data-fisher/selectors';
import { FisherOptionsInterface } from '../../shared/interface/fisher-options.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiFisherStateInterface>
  = createFeatureSelector<UiFisherStateInterface>(FEATURE_NAME);

/**
 * Select the form state
 */
export const selectUiFisherForm: MemoizedSelector<StateInterface, FisherInterface> = createSelector(
  selectUiState,
  (state: UiFisherStateInterface): FisherInterface => state.form,
);

/**
 * Select fisher data
 */
export const selectUiFisherData: MemoizedSelector<object, FisherModel|null> = createSelector(
  selectDataState,
  (
    state: DataFisherStateInterface,
  ) => {

    return state.fisher || null;
  },
);

/**
 * Select fisher options
 */
export const selectUiFisherOptions: MemoizedSelector<StateInterface, FisherOptionsInterface> = createSelector(
  selectDataOptions,
  selectUiFisherForm,
  (
    options: RuntimeOptionsInterface,
    form: FisherInterface,
  ): FisherOptionsInterface => {

    return {
      propertyStatus: options.propertyStatus,
      country: options.countryById,
      motivation: options.motivation,
      propertyCategory: options.propertyCategory,
      propertySubCategory: form.propertyInfo ? options.propertySubCategory[form.propertyInfo.category] || [] : [],
    };
  },
);
