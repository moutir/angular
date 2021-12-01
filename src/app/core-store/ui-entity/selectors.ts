import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiEntityStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { EntityEnum } from '../../shared/enum/entity.enum';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiEntityStateInterface>
  = createFeatureSelector<UiEntityStateInterface>(FEATURE_NAME);

/**
 * Select entity IDs in operation
 */
export const selectUiOperationIds = (entity: EntityEnum): MemoizedSelector<StateInterface, string[]> => createSelector(
  selectUiState,
  (state: UiEntityStateInterface): string[] => state.operationIds[entity] || [],
);
