import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { concat, Observable, of } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { DocumentUpsert } from '../data-document/actions/document-upsert';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { RuntimeEventError } from '../ui-runtime/actions/runtime-event-error';
import { RuntimeEventNotification } from '../ui-runtime/actions/runtime-event-notification';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { DocumentServiceAbstract } from '../../shared/service/document.service.abstract';
import { DocumentEventLoad } from './actions/document-event-load';
import { DocumentUpdateIsLoading } from './actions/document-update-is-loading';
import { DocumentEventChangeOne } from './actions/document-event-change-one';

export abstract class EffectsAbstract<Model extends ModelAbstract> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected runtimeService: RuntimeService,
    protected documentService: DocumentServiceAbstract<Model>,
  ) {

  }

  /**
   * Perform API call to fetch documents
   *
   * @action DocumentEventLoad
   */
  DocumentEventLoad$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<DocumentEventLoad>(DocumentEventLoad.TYPE),
    filter(action => this.filterUid(action.payload.uid)),
    switchMap(action => concat(

        // Start loading
        of(new DocumentUpdateIsLoading({
          uid: action.payload.uid,
          isLoading: true,
        })),

        // API call
        this
          .documentService
          .list(<Model>action.payload.model)
          .pipe(

            // Success
            switchMap(documents => [

              // Upsert documents
              new DocumentUpsert({
                models: documents,
              }),

              // Change documents list
              this.documentService.getDocumentEventChangeListAction(action.payload.uid, <Model>action.payload.model, documents),

              // Stop loading
              new DocumentUpdateIsLoading({
                uid: action.payload.uid,
                isLoading: false,
              }),
            ]),

            // Error
            catchError(error => [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.failure,
                message: 'notification_rollback',
              }),

              // Broadcast error
              new RuntimeEventError({ id: '37', error: error }),

              // Stop loading
              new DocumentUpdateIsLoading({
                uid: action.payload.uid,
                isLoading: false,
              }),
            ]),
          ),
      )),
  ));

  /**
   * Perform API call to update document
   *
   * @action DocumentEventChangeOne
   */
  DocumentEventChangeOne$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<DocumentEventChangeOne>(DocumentEventChangeOne.TYPE),
    filter(action => this.filterUid(action.payload.uid)),
    switchMap(action => {

      const model = <Model>action.payload.model;
      const documents = this.documentService.getDocuments(model).slice(0);
      const originalDocument = documents.find(doc => doc.id === action.payload.document.id);

      // Changed removed, but document is not removed
      if (action.payload.input.name === 'isRemoved' && action.payload.document.isRemoved === false) {

        return [];
      }

      // Document not found or data did not change
      if (
        action.payload.input.name !== 'isRemoved' &&
        (!originalDocument || originalDocument.data[action.payload.input.name] === action.payload.document.data[action.payload.input.name])
      ) {

        return [];
      }

      // Default save API call
      let apiCall: () => Observable<boolean> = () => this.documentService.save(model, action.payload.document, action.payload.input.name);

      // Delete API call
      if (action.payload.input.name === 'isRemoved') {

        apiCall = () => this.documentService.remove(model, action.payload.document);
      }

      // API call
      return apiCall()
        .pipe(

          // Success
          switchMap(isSuccess => {

            // Failed to remove
            if (isSuccess === false) {

              return [

                // Notification
                new RuntimeEventNotification({
                  type: NotificationTypeEnum.failure,
                  message: 'notification_rollback',
                }),
              ];
            }

            // Update document in list of documents
            const documentIndex = documents.findIndex((d) => d.id === action.payload.document.id);
            documents[documentIndex] = action.payload.document;

            return [

              // Notification
              new RuntimeEventNotification({
                type: NotificationTypeEnum.success,
                message: action.payload.input.name === 'isRemoved' ? 'notification_document_remove' : 'notification_document_update',
              }),

              // Change documents list
              this.documentService.getDocumentEventChangeListAction(
                action.payload.uid,
                model,
                documents.filter(document => document.isRemoved === false),
              ),
            ];
          }),

          // Error
          catchError(error => [

            // Notification
            new RuntimeEventNotification({
              type: NotificationTypeEnum.failure,
              message: 'notification_rollback',
            }),

            // Broadcast error
            new RuntimeEventError({ id: '48', error: error }),
          ]),
        );
    })),
  );

  /**
   * Return true if the UID matches the document UID
   */
  protected filterUid(uid: string = ''): boolean {

    return this.documentService.getUid(uid.split(/:/)[2] || '') === uid;
  }
}
