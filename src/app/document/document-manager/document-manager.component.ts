import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { DocumentModel } from '../../shared/model/document.model';
import { DocumentManagerStrategyInterface } from '../../shared/interface/document-manager-strategy.interface';
import { ChangeFormEventInterface } from '../../shared/interface/change-form-event.interface';

@Component({
  selector: 'app-document-manager',
  templateUrl: './document-manager.component.html',
  styleUrls: ['./document-manager.component.scss'],
})
export class DocumentManagerComponent {

  /**
   * Documents to display
   */
  @Input() documents: DocumentModel[] = [];

  /**
   * Is the document list loading ?
   */
  @Input() isLoading: boolean = true;

  /**
   * Is the document list read only ?
   */
  @Input() isReadOnly: boolean = true;

  /**
   * Is the document list disabled ?
   */
  @Input() isDisabled: boolean = false;

  /**
   * Is the document list sortable?
   */
  @Input() isSortable: boolean = false;

  /**
   * Number of document placeholders
   */
  @Input() placeholderCount: number;

  /**
   * Message to show when no documents are available
   */
  @Input() messageEmptyState: string = '';

  /**
   * Strategy
   */
  @Input() strategy: DocumentManagerStrategyInterface = {
    options: {},
    inputs: [],
  };

  /**
   * Changed documents
   */
  @Output() changeDocuments: EventEmitter<DocumentModel[]> = new EventEmitter<DocumentModel[]>();

  /**
   * Removed document
   */
  @Output() removeDocument: EventEmitter<DocumentModel> = new EventEmitter<DocumentModel>();

  /**
   * Changed document input
   */
  @Output() changeInput: EventEmitter<ChangeFormEventInterface<DocumentModel>> =
    new EventEmitter<ChangeFormEventInterface<DocumentModel>>();

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Dropped a document (from drag'n'drop)
   */
  onDropDocument(event: CdkDragDrop<DocumentModel[]>): void {

    // Clone documents
    const documents = this.documents.slice(0);

    // Sort documents
    moveItemInArray(documents, event.previousIndex, event.currentIndex);

    // Change documents
    this.changeDocuments.emit(documents);
  }

  /**
   * Changed a document
   */
  onChangeDocument(event: ChangeFormEventInterface<DocumentModel>): void {

    this.changeInput.emit(event);
  }

  /**
   * Removed a document
   */
  onRemoveDocument(document: DocumentModel): void {

    // Readonly
    if (this.isReadOnly !== false) {

      return;
    }

    // Change event
    this.removeDocument.emit(document);
  }
}
