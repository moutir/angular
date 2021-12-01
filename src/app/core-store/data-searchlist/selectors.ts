import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';

import { DataSearchlistStateInterface, FEATURE_NAME } from './state';
import { StateInterface } from '../state.interface';

export const selectDataState: MemoizedSelector<StateInterface, DataSearchlistStateInterface>
  = createFeatureSelector<DataSearchlistStateInterface>(FEATURE_NAME);
