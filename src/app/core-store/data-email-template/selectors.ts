import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { DataEmailTemplateStateInterface, FEATURE_NAME } from './state';
import { EmailTemplateModel } from '../../shared/model/email-template.model';
import { Dictionary } from '../../shared/class/dictionary';

export const selectDataState: MemoizedSelector<object, DataEmailTemplateStateInterface>
  = createFeatureSelector<DataEmailTemplateStateInterface>(FEATURE_NAME);

export const selectDataEmailTemplates: MemoizedSelector<object, Dictionary<EmailTemplateModel>> = createSelector(
  selectDataState,
  (state: DataEmailTemplateStateInterface) => state.models,
);

export const selectDataEmailTemplate = (id: string): MemoizedSelector<object, EmailTemplateModel|null> => createSelector(
  selectDataEmailTemplates,
  (models: Dictionary<EmailTemplateModel>) => models[id] || null,
);
