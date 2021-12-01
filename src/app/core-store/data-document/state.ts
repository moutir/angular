import { DocumentModel } from '../../shared/model/document.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-document';

export interface DataDocumentStateInterface extends DataStateInterface<DocumentModel> {

}

export const initialState: DataDocumentStateInterface = {
  models: {},
};
