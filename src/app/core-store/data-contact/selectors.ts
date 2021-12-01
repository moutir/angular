import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataContactStateInterface, FEATURE_NAME } from './state';
import { ContactModel } from '../../shared/model/contact.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataContactStateInterface>
  = createFeatureSelector<DataContactStateInterface>(FEATURE_NAME);

export const selectDataContacts: MemoizedSelector<object, Dictionary<ContactModel>> = createSelector(
  selectDataState,
  (state: DataContactStateInterface) => state.models,
);

export const selectDataContact = (id: string): MemoizedSelector<object, ContactModel|null> => createSelector(
  selectDataContacts,
  (models: Dictionary<ContactModel>) => models[id] || null,
);

export const selectDataByAgency: MemoizedSelector<object, Dictionary<string[]>> = createSelector(
  selectDataState,
  (state: DataContactStateInterface) => state.byAgencyId,
);
