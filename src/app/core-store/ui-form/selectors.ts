import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiFormStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { UiFormInterface } from './ui-form.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { GeneralErrorInterface } from '../../shared/interface/general-error.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<StateInterface, UiFormStateInterface>
  = createFeatureSelector<UiFormStateInterface>(FEATURE_NAME);

/**
 * Select form linked to UID
 */
export const selectUiForm = (uid: string): MemoizedSelector<StateInterface, UiFormInterface> => createSelector(
  selectUiState,
  (state: UiFormStateInterface): UiFormInterface => state[uid],
);

/**
 * Select model error
 */
export const selectUiModelError = (uid: string): MemoizedSelector<StateInterface, KeyValueType<string, string|null>> => createSelector(
  selectUiForm(uid),
  (form: UiFormInterface): KeyValueType<string, string|null> => (form && form.modelError) || {},
);

/**
 * Select general error
 */
export const selectUiGeneralError = (uid: string): MemoizedSelector<StateInterface, GeneralErrorInterface[]> => createSelector(
  selectUiForm(uid),
  (form: UiFormInterface): GeneralErrorInterface[] => (form && form.generalError) || [],
);
