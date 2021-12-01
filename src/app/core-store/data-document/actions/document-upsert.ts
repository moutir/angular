import { FEATURE_NAME } from '../state';
import { DocumentModel } from '../../../shared/model/document.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class DocumentUpsert extends UpsertAbstract<DocumentModel, DataStateInterface<DocumentModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = DocumentUpsert.TYPE;
}
