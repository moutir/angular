import { Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ModelAbstract } from '../../class/model.abstract';
import { DocumentServiceAbstract } from '../../service/document.service.abstract';
import { DocumentModel } from '../../model/document.model';
import { ChangeFormEventInterface } from '../../interface/change-form-event.interface';
import { UploadStrategyInterface } from '../../interface/upload-strategy.interface';
import { UploadLayoutTypeEnum } from '../../enum/upload-layout-type.enum';
import { DocumentManagerStrategyInterface } from '../../interface/document-manager-strategy.interface';
import { UploadModel } from '../../model/upload.model';
import { DocumentTypeEnum } from '../../enum/document-type.enum';
import { EntityEnum } from '../../enum/entity.enum';

export abstract class DocumentListComponentAbstract<Model extends ModelAbstract>
  implements OnInit, OnChanges, OnDestroy {

  /**
   * Document list UID
   */
  @Input() uid: string = '';

  /**
   * Model linked to documents
   */
  @Input() model: Model|null = null;

  /**
   * Documents
   */
  @Input() documents: DocumentModel[] = [];

  /**
   * Is the list read only?
   */
  @Input() isReadOnly: boolean = true;

  /**
   * Is the list disabled?
   */
  @Input() isDisabled: boolean = false;

  /**
   * Is the list sortable?
   */
  @Input() isSortable: boolean = false;

  /**
   * Number of document placeholders
   */
  @Input() placeholderCount: number = 5;

  /**
   * State observables
   */
  isLoading$: Observable<boolean>;

  /**
   * Upload strategy
   */
  uploadStrategy: UploadStrategyInterface = {
    fileTypes: [],
    maxFileSize: 30,
    maxFileCount: 40,
    layoutType: UploadLayoutTypeEnum.document,
    isAllowedMultiple: true,
    documentType: DocumentTypeEnum.contactDocument,
    entity: EntityEnum.contact,
    entityId: '',
    description: '',
  };

  /**
   * Document manager strategy
   */
  documentManagerStrategy: DocumentManagerStrategyInterface = {
    inputs: [],
    options: {},
  };

  /**
   * Constructor
   */
  constructor(
    protected documentService: DocumentServiceAbstract<Model>,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Set registered UID
    this.uid = this.documentService.register(this.uid);

    // Set state observables
    this.setStateObservable();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.model && this.model) {

      this.uploadStrategy = {
        ...this.uploadStrategy,
        entityId: this.getEntityId(),
      };
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unregister
    this.documentService.unregister(this.uid);
  }

  /**
   * Changed documents in document manager
   */
  onChangeDocuments(documents: DocumentModel[]): void {

    this.documentService.changeList(this.uid, this.model, documents);
  }

  /**
   * Removed document in documents form
   */
  onRemoveDocument(document: DocumentModel): void {

    this.documentService.changeOne(this.uid, this.model, document, {
      name: 'isRemoved',
      value: true,
    });
  }

  /**
   * Changed input in documents form
   */
  onChangeDocumentInput(event: ChangeFormEventInterface<DocumentModel>): void {

    this.documentService.changeOne(this.uid, this.model, event.model, event.input);
  }

  /**
   * Upload completed
   */
  onUploadComplete(uploads: UploadModel[]): void {

    const uploadedDocuments = uploads.map(upload => {

      const document = new DocumentModel();

      document.id = upload.fileId;
      document.name = upload.name;
      document.photoSmallURL = upload.thumbnailUrl;
      document.size = upload.size;
      document.extension = upload.type;
      document.createDate = upload.createDate;
      document.updateDate = upload.updateDate;
      document.fileUrl = this.documentService.getDownloadUrl(this.model, document);

      // Add document inputs
      this.documentManagerStrategy.inputs.forEach(ip => document.data[ip.name] = null);

      return document;
    });

    // Add newly uploaded documents
    this.documentService.changeList(this.uid, this.model, [
      ...this.documents,
      ...uploadedDocuments,
    ]);
  }

  /**
   * Set state observables
   */
  protected setStateObservable(): void {

    this.isLoading$ = this.documentService.selectLoading(this.uid);
  }

  /**
   * Return the entity ID
   */
  protected getEntityId(): string {

    return this.model.id;
  }
}
