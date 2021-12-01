import { DataSearchlistInterface } from './data-searchlist.interface';

export const FEATURE_NAME = 'data-searchlist';

export interface DataSearchlistStateInterface {
  [hash: string]: DataSearchlistInterface;
}

export const initialState: DataSearchlistStateInterface = {

};
