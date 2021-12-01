import { HistoryInterface } from '../../shared/interface/history.interface';

export const FEATURE_NAME = 'ui-history';

export interface UiHistoryStateInterface {
  history: HistoryInterface;
}

export const initialState: UiHistoryStateInterface = {
  history: {
    entity: null,
    entityId: '',
    entityLabel: '',
  },
};
