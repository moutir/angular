import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { WebsitePageService } from '../../../core/shared/website/website-page.service';
import { WebsiteService } from '../../../core/shared/website/website.service';
import { WebsiteUpsert } from '../../data-website/actions/website-upsert';
import { WebsiteModel } from '../../../shared/model/website.model';
import { FormService } from '../../../core/shared/form.service';
import { DocumentEventLoad } from '../../ui-document/actions/document-event-load';
import { WebsiteDocumentService } from '../../../core/shared/website/website-document.service';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { PageEventLoadModelSuccess } from '../../ui-page/actions/page-event-load-model-success';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { EntityEventList } from '../../ui-entity/actions/entity-event-list';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { EntityEventChanged } from '../../ui-entity/actions/entity-event-changed';
import { ContactModel } from '../../../shared/model/contact.model';
import { ContactService } from '../../../core/shared/contact/contact.service';
import { PageUpdateModel } from '../../ui-page/actions/page-update-model';
import { WebsiteOptionsInterface } from '../../../shared/interface/website-options.interface';

@Injectable()
export class PageEffects extends EffectsAbstract<WebsiteModel, WebsiteOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: WebsitePageService,
    protected modelService: WebsiteService,
    private contactService: ContactService,
    private documentService: WebsiteDocumentService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Load contacts on page model load
   *
   * @action PageEventLoadModelSuccess
   */
  PageEventLoadModelSuccess2$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventLoadModelSuccess>(PageEventLoadModelSuccess.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectType(),
    )),
    switchMap(([action, type]) => {

      // Not read page
      if (type !== PageTypeEnum.read) {

        return [];
      }

      const model = <WebsiteModel>action.payload.model;
      const actions: Action[] = [];

      if (model.brokers.length > 0) {

        const filters = new ContactSearchModel();
        filters.contactIds = model.brokers.map(broker => broker.id);

        // Load contacts
        actions.push(
          new EntityEventList({
            entity: EntityEnum.contact,
            pagination: { page: 1, perPage: 100 },
            sort: { id: 'id', order: OrderEnum.asc },
            filters: filters,
          }),
        );
      }

      return actions;
    }),
  ));

  /**
   * Perform API call to fetch photos on tab change
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

      // Photos tab in add page
      if (!model.id && action.payload.tabUid === PageTabEnum.websiteWritePhoto) {

        return [];
      }

      // Tab UID does not match website read/write photo OR model has photos
      if ((action.payload.tabUid !== PageTabEnum.websiteReadPhoto &&
        action.payload.tabUid !== PageTabEnum.websiteWritePhoto) ||
        model.documents.length > 0) {

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
   * Update contacts in page and data models
   *
   * @action EntityEventChanged entity === EntityEnum.contact
   */
  EntityEventChangedContact$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<EntityEventChanged>(EntityEventChanged.TYPE),
    switchMap(action => zip(of(action), this.pageService.selectEntity())),
    filter(([action, entity]) => entity === EntityEnum.website && action.payload.entity === EntityEnum.contact),
    switchMap(([action, entity]) => zip(
      of(action),
      this.contactService.selectContacts(),
      this.pageService.selectModel(),
    )),
    switchMap(([action, contacts, model]) => {

      const pageModel = model.clone<WebsiteModel>();
      pageModel.brokers = pageModel.brokers.map(broker => contacts[broker.id] || new ContactModel());

      return [

        // Upsert data model
        this.getUpsertAction(pageModel),

        // Update page model
        new PageUpdateModel({
          model: pageModel,
        }),
      ];
    })),
  );

  /**
   * @inheritDoc
   */
  protected filterDocumentUid(uid: string): boolean {

    return [
      this.documentService.getUid(PageTabEnum.websiteReadPhoto),
      this.documentService.getUid(PageTabEnum.websiteWritePhoto),
    ].indexOf(uid) > -1;
  }

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: WebsiteModel): Action {

    return new WebsiteUpsert({
      models: [model],
    });
  }
}
