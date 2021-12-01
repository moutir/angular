import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { FormService } from '../../../core/shared/form.service';
import { UserModel } from '../../../shared/model/user.model';
import { UserOptionsInterface } from '../../../shared/interface/user-options.interface';
import { UserPageService } from '../../../core/shared/user/user-page.service';
import { UserService } from '../../../core/shared/user/user.service';
import { UserUpsert } from '../../data-user/actions/user-upsert';
import { PageEventStoreModelSuccess } from '../../ui-page/actions/page-event-store-model-success';
import { BrowserService } from '../../../core/shared/browser/browser.service';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { DocumentEventLoad } from '../../ui-document/actions/document-event-load';
import { UserDocumentService } from '../../../core/shared/user/user-document.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ContactEventChangeAvatar } from '../../ui-contact/actions/contact-event-change-avatar';
import { PageEventChangeModel } from '../../ui-page/actions/page-event-change-model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';

@Injectable()
export class PageEffects extends EffectsAbstract<UserModel, UserOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: UserPageService,
    protected modelService: UserService,
    private runtimeService: RuntimeService,
    private browserService: BrowserService,
    private documentService: UserDocumentService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Update session user name AND reload page if specific user preference fields changed
   *
   * @action PageEventStoreModelSuccess
   */
  PageEventStoreModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventStoreModelSuccess>(PageEventStoreModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.runtimeService.selectSettings(),
    )),
    switchMap(([action, runtimeSettings]) => {

      // User preferred language changed
      if ((<UserModel>action.payload.model).account.language.value !== runtimeSettings.language.current) {

        // Reload page
        this.browserService.reload();
      }

      return [];
    })),
  );

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

      // Tab UID does not match user write document OR model ID not available OR model has already loaded documents
      if (action.payload.tabUid !== PageTabEnum.userWriteDocument || !model.id || model.account.contact.documents.length > 0) {

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
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const modelNew = model.clone<UserModel>();
      modelNew.account.contact = action.payload.contact;

      return [

        // Even page change model
        new PageEventChangeModel({
          entity: EntityEnum.user,
          model: modelNew,
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
      this.documentService.getUid(PageTabEnum.userWriteDocument),
    ].indexOf(uid) > -1;
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: UserModel): Action {

    return new UserUpsert({
      models: [model],
    });
  }
}
