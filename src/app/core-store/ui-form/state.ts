import { UiFormInterface } from './ui-form.interface';

export const FEATURE_NAME = 'ui-form';

export interface UiFormStateInterface {
  [uid: string]: UiFormInterface|null;
}

export const initialState: UiFormStateInterface = {

};
