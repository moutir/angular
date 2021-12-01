import { UiAutocompleteInterface } from './ui-autocomplete.interface';

export const FEATURE_NAME = 'ui-autocomplete';

export interface UiAutocompleteStateInterface {
  [uid: string]: UiAutocompleteInterface;
}

export const initialState: UiAutocompleteStateInterface = {

};
