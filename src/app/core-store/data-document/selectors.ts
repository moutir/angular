import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataDocumentStateInterface, FEATURE_NAME } from './state';
import { DocumentModel } from '../../shared/model/document.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataDocumentStateInterface>
  = createFeatureSelector<DataDocumentStateInterface>(FEATURE_NAME);

export const selectDataDocuments: MemoizedSelector<object, Dictionary<DocumentModel>> = createSelector(
  selectDataState,
  (state: DataDocumentStateInterface) => state.models,
);

export const selectDataDocument = (id: string): MemoizedSelector<object, DocumentModel|null> => createSelector(
  selectDataDocuments,
  (models: Dictionary<DocumentModel>) => models[id] || null,
);
