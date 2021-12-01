import { DocumentInterface } from '../../shared/interface/document.interface';

export const FEATURE_NAME = 'ui-document';

export interface UiDocumentStateInterface {
  [uid: string]: DocumentInterface;
}

export const initialState: UiDocumentStateInterface = {

};
