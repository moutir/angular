import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { FEATURE_NAME, UiEmailingStateInterface } from './state';
import { StateInterface } from '../state.interface';
import { KeyValueType } from '../../shared/type/key-value.type';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { DocumentModel } from '../../shared/model/document.model';
import { RecipientSummaryInterface } from '../../shared/interface/recipient-summary.interface';
import { Dictionary } from '../../shared/class/dictionary';
import { EmailingPreviewInterface } from '../../shared/interface/emailing-preview.interface';

/**
 * Select the module's state
 */
export const selectUiState: MemoizedSelector<object, UiEmailingStateInterface>
  = createFeatureSelector<UiEmailingStateInterface>(FEATURE_NAME);

/**
 * Select documents
 */
export const selectUiDocuments: MemoizedSelector<
  StateInterface,
  KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>
> = createSelector(
  selectUiState,
  (state: UiEmailingStateInterface): KeyValueType<EntityEnum, Dictionary<DocumentModel[]>> => state.documents,
);

/**
 * Select summaries
 */
export const selectUiSummaries: MemoizedSelector<StateInterface, RecipientSummaryInterface[]> = createSelector(
  selectUiState,
  (state: UiEmailingStateInterface): RecipientSummaryInterface[] => state.summaries,
);

/**
 * Select preview
 */
export const selectUiPreview: MemoizedSelector<StateInterface, EmailingPreviewInterface> = createSelector(
  selectUiState,
  (state: UiEmailingStateInterface): EmailingPreviewInterface => state.preview,
);
