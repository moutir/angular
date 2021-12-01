import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataEmailStateInterface, FEATURE_NAME } from './state';
import { EmailModel } from '../../shared/model/email.model';
import { EmailContentModel } from '../../shared/model/email-content.model';

export const selectDataState: MemoizedSelector<object, DataEmailStateInterface>
  = createFeatureSelector<DataEmailStateInterface>(FEATURE_NAME);

export const selectDataEmails: MemoizedSelector<object, Dictionary<EmailModel>> = createSelector(
  selectDataState,
  (state: DataEmailStateInterface) => state.models,
);

export const selectDataEmail = (id: string): MemoizedSelector<object, EmailModel|null> => createSelector(
  selectDataEmails,
  (models: Dictionary<EmailModel>) => models[id] || null,
);

/**
 * Select email contents
 */
export const selectDataEmailContents = createSelector(
  selectDataState,
  (state: DataEmailStateInterface): Dictionary<EmailContentModel> => state.emailContent.models,
);

/**
 * Select email content
 */
export const selectDataEmailContent = (id: string): MemoizedSelector<DataEmailStateInterface, EmailContentModel|null> => createSelector(
  selectDataEmailContents,
  (models: Dictionary<EmailContentModel>) => models[id] || null,
);
