import { SearchlistInterface } from '../../shared/interface/searchlist.interface';

export const FEATURE_NAME = 'ui-searchlist';

export interface UiSearchlistStateInterface {
  [uid: string]: SearchlistInterface;
}

export const initialState: UiSearchlistStateInterface = {

};
