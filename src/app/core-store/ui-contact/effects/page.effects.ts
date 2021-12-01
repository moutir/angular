import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { ContactModel } from '../../../shared/model/contact.model';
import { ContactUpsert } from '../../data-contact/actions/contact-upsert';
import { ContactPageService } from '../../../core/shared/contact/contact-page.service';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { FormService } from '../../../core/shared/form.service';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { DocumentEventLoad } from '../../ui-document/actions/document-event-load';
import { ContactOptionsInterface } from '../../../shared/interface/contact-options.interface';
import { ContactDocumentService } from '../../../core/shared/contact/contact-document.service';
import { ContactEventChangeAvatar } from '../actions/contact-event-change-avatar';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { EntityEnum } from '../../../shared/enum/entity.enum';

@Injectable()
export class PageEffects extends EffectsAbstract<ContactModel, ContactOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: ContactPageService,
    protected modelService: ContactService,
    protected documentService: ContactDocumentService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Perform API call to fetch documents on tab index change
   *
   * @action PageEventChangeTabUid
   */
  PageEventChangeTabUid2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventChangeTabUid>(PageEventChangeTabUid.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      // Tab UID does not match contact write document OR model ID not available OR model has already loaded documents
      if (action.payload.tabUid !== PageTabEnum.contactWriteDocument || !model.id || model.documents.length > 0) {

        return [];
      }

      return [

        new DocumentEventLoad({
          uid: this.documentService.getUid(action.payload.tabUid),
          model: model,
        }),
      ];
    })),
  );

  /**
   * Update page model on changed contact avatar
   *
   * @action ContactEventChangeAvatar
   */
  ContactEventChangeAvatar$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<ContactEventChangeAvatar>(ContactEventChangeAvatar.TYPE),
    filter(action => this.filterEntity(action.payload.contact.entity)),
    switchMap(action => {

      return [

        // Even page change model
        new PageEventChangeModel({
          entity: EntityEnum.contact,
          model: action.payload.contact,
          input: {
            name: 'avatar',
            value: {
              id: action.payload.contact.photoId,
              url: action.payload.contact.photoURL,
            },
          },
        }),
      ];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected filterDocumentUid(uid: string): boolean {

    return [
      this.documentService.getUid(PageTabEnum.contactWriteDocument),
    ].indexOf(uid) > -1;
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: ContactModel): Action {

    return new ContactUpsert({
      models: [model],
    });
  }
}
