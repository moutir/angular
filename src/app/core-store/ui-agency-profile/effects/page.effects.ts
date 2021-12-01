import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { FormService } from '../../../core/shared/form.service';
import { AgencyModel } from '../../../shared/model/agency.model';
import { AgencyProfilePageService } from '../../../core/shared/agency-profile/agency-profile-page.service';
import { AgencyProfileService } from '../../../core/shared/agency-profile/agency-profile.service';
import { AgencyUpsert } from '../../data-agency/actions/agency-upsert';
import { AgencyOptionsInterface } from '../../../shared/interface/agency-options.interface';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { DocumentEventLoad } from '../../ui-document/actions/document-event-load';
import { AgencyProfileGeneralDocumentService } from '../../../core/shared/agency-profile/agency-profile-general-document.service';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { AgencyProfileImageDocumentService } from '../../../core/shared/agency-profile/agency-profile-image-document.service';
import { UserModel } from '../../../shared/model/user.model';
import { AgencyProfileEventChangedImage } from '../actions/agency-profile-event-changed-image';
import { AuthenticationStore } from '../../../authentication/shared/authentication.store';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { DocumentModel } from '../../../shared/model/document.model';

@Injectable()
export class PageEffects extends EffectsAbstract<AgencyModel, AgencyOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: AgencyProfilePageService,
    protected modelService: AgencyProfileService,
    private generalDocumentService: AgencyProfileGeneralDocumentService,
    private imageDocumentService: AgencyProfileImageDocumentService,
    private authenticationStore: AuthenticationStore,
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

      if (!model.id) {

        return [];
      }

      if (model.images.length === 0 &&
        action.payload.tabUid === PageTabEnum.agencyProfileReadImage ||
        action.payload.tabUid === PageTabEnum.agencyProfileWriteImage
      ) {

        return [

          new DocumentEventLoad({
            uid: this.imageDocumentService.getUid(action.payload.tabUid),
            model: model,
          }),
        ];
      }

      if (model.documents.length === 0 &&
        action.payload.tabUid === PageTabEnum.agencyProfileReadDocument ||
        action.payload.tabUid === PageTabEnum.agencyProfileWriteDocument
      ) {

        return [

          new DocumentEventLoad({
            uid: this.generalDocumentService.getUid(action.payload.tabUid),
            model: model,
          }),
        ];
      }

      return [];
    })),
  );

  /**
   * Changed agency logo
   *
   * @action AgencyProfileEventChangedImage
   */
  AgencyProfileEventChangedLogo$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventChangedImage>(AgencyProfileEventChangedImage.TYPE),
    filter(action => action.payload.uid === 'logo'),
    switchMap(action => zip(
      of(action),
      this.authenticationStore.user$,
    )),
    switchMap(([action, authUser]) => {

      const newAuthUser = authUser.clone<UserModel>();
      newAuthUser.account.contact.agency.logo.id = action.payload.imageDocument.id;
      newAuthUser.account.contact.agency.logo.photoSmallURL = action.payload.imageDocument.photoSmallURL;

      // Set session user agency logo
      this.authenticationStore.setUser(newAuthUser);

      return [];
    }),
  ));

  /**
   * Changed agency image
   *
   * @action AgencyProfileEventChangedImage
   */
  AgencyProfileEventChangedImage$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<AgencyProfileEventChangedImage>(AgencyProfileEventChangedImage.TYPE),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      const newModel = model.clone<AgencyModel>();
      const document = action.payload.imageDocument.clone<DocumentModel>();

      // Logo
      if (action.payload.uid === 'logo') {

        document.isAgencyLogo = true;
        newModel.logo = document;
      }

      // Watermark
      if (action.payload.uid === 'watermark') {

        document.isAgencyWatermark = true;
        newModel.watermark = document;
      }

      // Default property image
      if (action.payload.uid === 'default-property-image') {

        document.isDefaultPropertyImage = true;
        newModel.defaultPropertyPhoto = document;
      }

      // Prestige brochure cover
      if (action.payload.uid === 'prestige-brochure-cover') {

        document.isPrestigeBrochureCover = true;
        newModel.prestigeBrochureCover = document;
      }

      // Email banner
      if (action.payload.uid === 'email-banner') {

        document.isEmailBanner = true;
        newModel.emailBanner = document;
      }

      newModel.images.push(document);

      return [ new PageUpdateModel({ model: newModel }) ];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected filterDocumentUid(uid: string): boolean {

    return [
      this.generalDocumentService.getUid(PageTabEnum.agencyProfileReadDocument),
      this.imageDocumentService.getUid(PageTabEnum.agencyProfileReadImage),
      this.generalDocumentService.getUid(PageTabEnum.agencyProfileWriteDocument),
      this.imageDocumentService.getUid(PageTabEnum.agencyProfileWriteImage),
    ].indexOf(uid) > -1;
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: AgencyModel): Action {

    return new AgencyUpsert({
      models: [model],
    });
  }
}
