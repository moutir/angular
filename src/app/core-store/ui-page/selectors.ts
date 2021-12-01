import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiPageStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { PageTypeEnum } from '../../shared/enum/page-type.enum';
import { PageActionEnum } from '../../shared/enum/page-action.enum';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiPageStateInterface>
  = createFeatureSelector<UiPageStateInterface>(FEATURE_NAME);

/**
 * Select model
 */
export const selectUiModel: MemoizedSelector<StateInterface, ModelAbstract|null> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): ModelAbstract => state.model,
);

/**
 * Select entity
 */
export const selectUiEntity: MemoizedSelector<StateInterface, EntityEnum> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): EntityEnum => state.entity,
);

/**
 * Select ID
 */
export const selectUiId: MemoizedSelector<StateInterface, string> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): string => state.id,
);

/**
 * Select can deactivate
 */
export const selectUiCanDeactivate: MemoizedSelector<StateInterface, boolean> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): boolean => state.canDeactivate,
);

/**
 * Select tabUid
 */
export const selectUiTabUid: MemoizedSelector<StateInterface, PageTabEnum> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): PageTabEnum => state.tabUid,
);

/**
 * Select icon
 */
export const selectUiIcon: MemoizedSelector<StateInterface, string> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): string => state.icon,
);

/**
 * Select type
 */
export const selectUiType: MemoizedSelector<StateInterface, PageTypeEnum> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): PageTypeEnum => state.type,
);

/**
 * Select action
 */
export const selectUiAction: MemoizedSelector<StateInterface, PageActionEnum> = createSelector(
  selectUiState,
  (
    state: UiPageStateInterface,
  ): PageActionEnum => state.action,
);
