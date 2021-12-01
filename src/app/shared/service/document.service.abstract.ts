import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ModelAbstract } from '../class/model.abstract';
import { StateInterface } from '../../core-store/state.interface';
import { DocumentSet } from '../../core-store/ui-document/actions/document-set';
import { ModuleConfig } from '../class/module-config';
import { selectUiIsLoading, selectUiState } from '../../core-store/ui-document/selectors';
import { DocumentApiService } from '../../api/shared/document/document-api.service';
import { DocumentModel } from '../model/document.model';
import { EntityEnum } from '../enum/entity.enum';
import { DocumentTypeEnum } from '../enum/document-type.enum';
import { DocumentEventChangeList } from '../../core-store/ui-document/actions/document-event-change-list';
import { InputFormInterface } from '../interface/input-form.interface';
import { DocumentEventChangeOne } from '../../core-store/ui-document/actions/document-event-change-one';
import { UiDocumentStateInterface } from '../../core-store/ui-document/state';
import { selectDataDocuments } from '../../core-store/data-document/selectors';
import { Dictionary } from '../class/dictionary';

export abstract class DocumentServiceAbstract<Model extends ModelAbstract> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: ModuleConfig,
    protected store$: Store<StateInterface>,
    protected documentApiService: DocumentApiService,
  ) {

  }

  /**
   * Select state
   */
  selectState(): Observable<UiDocumentStateInterface> {

    return this.store$.select(selectUiState);
  }

  /**
   * Select documents
   */
  selectDocuments(): Observable<Dictionary<DocumentModel>> {

    return this.store$.select(selectDataDocuments);
  }

  /**
   * Select loading state
   */
  selectLoading(uid: string): Observable<boolean> {

    return this.store$.select(selectUiIsLoading(uid));
  }

  /**
   * Register document and returns a UID
   */
  register(name: string): string {

    const uid = this.getUid(name);

    this.store$.dispatch(
      new DocumentSet({
        uid,
        document: {
          isLoading: true,
        },
      }),
    );

    return uid;
  }

  /**
   * Unregister document UID
   */
  unregister(uid: string): void {

    this.store$.dispatch(
      new DocumentSet({
        uid,
        document: null,
      }),
    );
  }

  /**
   * Change list of documents
   */
  changeList(uid: string, model: Model, documents: DocumentModel[]): void {

    this.store$.dispatch(
      this.getDocumentEventChangeListAction(uid, model, documents),
    );
  }

  /**
   * Change one document
   */
  changeOne(uid: string, model: Model, document: DocumentModel, input: InputFormInterface): void {

    this.store$.dispatch(
      new DocumentEventChangeOne({ uid, model, document, input }),
    );
  }

  /**
   * List documents
   */
  list(model: Model): Observable<DocumentModel[]> {

    return this.documentApiService
      .list(this.getEntity(), model.id, this.getDocumentType(model), this.getDataAttributes(model))
      .pipe(
        map(documents => documents.map(doc => {

          doc.fileUrl = this.getDownloadUrl(model, doc);

          return doc;
        })),
      )
    ;
  }

  /**
   * Remove document
   */
  remove(model: Model, document: DocumentModel): Observable<boolean> {

    return this.documentApiService
      .remove(this.getEntity(), model.id, this.getDocumentType(model), document.id)
      .pipe(
        map(response => response && response.success),
      )
    ;
  }

  /**
   * Save document by updating a single data attribute
   */
  save(model: Model, document: DocumentModel, dataAttribute: string): Observable<boolean> {

    return this.documentApiService
      .save(this.getEntity(), this.getDocumentType(model), document, dataAttribute)
      .pipe(
        map(response => response && response.success),
      )
    ;
  }

  /**
   * Return UID based on provided name
   */
  getUid(name: string): string {

    return ['document', this.getEntity(), name].join(':');
  }

  /**
   * Return DocumentEventChangeList action
   */
  getDocumentEventChangeListAction(uid: string, model: Model, documents: DocumentModel[]): DocumentEventChangeList {

    const newModel = model.clone<Model>();
    this.setDocuments(newModel, documents);

    return new DocumentEventChangeList({
      uid: uid,
      model: newModel,
    });
  }

  /**
   * Return the model entity
   */
  getEntity(): EntityEnum {

    return this.moduleConfig.ENTITY;
  }

  /**
   * Return the list of data attributes stored within a document
   */
  getDataAttributes(model: Model): string[] {

    return [];
  }

  /**
   * Return a document's download URL
   */
  getDownloadUrl(model: Model, document: DocumentModel): string {

    return [
      '/upload/download',
      this.getDocumentType(model),
      this.getEntity(),
      document.id,
    ].join('/');
  }

  /**
   * Return the document type
   */
  abstract getDocumentType(model: Model): DocumentTypeEnum;

  /**
   * Return model's documents
   */
  abstract getDocuments(model: Model): DocumentModel[];

  /**
   * Set model's documents
   */
  abstract setDocuments(model: Model, documents: DocumentModel[]): void;
}
