import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { CustomAttributeService } from '../../../core/shared/custom-attribute/custom-attribute.service';
import { CustomAttributePageService } from '../../../core/shared/custom-attribute/custom-attribute-page.service';
import { CustomAttributeModel } from '../../../shared/model/custom-attribute.model';
import { CustomAttributeOptionsInterface } from '../../../shared/interface/custom-attribute-options.interface';
import { CustomAttributeUpsert } from '../../data-custom-attribute/actions/custom-attribute-upsert';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { PropertySearchlistService } from '../../../core/shared/property/property-searchlist.service';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { PropertySearchModel } from '../../../shared/model/property-search.model';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { FormService } from '../../../core/shared/form.service';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { PromotionSearchlistService } from '../../../core/shared/promotion/promotion-searchlist.service';
import { ContactSearchlistService } from '../../../core/shared/contact/contact-searchlist.service';
import { ListTypeEnum } from '../../../shared/enum/list-type.enum';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { ContactSearchModel } from '../../../shared/model/contact-search.model';
import { CustomAttributeEventRemove } from '../actions/custom-attribute-event-remove';

@Injectable()
export class PageEffects extends EffectsAbstract<CustomAttributeModel, CustomAttributeOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: CustomAttributePageService,
    protected modelService: CustomAttributeService,
    protected propertySearchlistService: PropertySearchlistService,
    protected promotionSearchlistService: PromotionSearchlistService,
    protected contactSearchlistService: ContactSearchlistService,
  ) {

    super(actions$, formService, pageService, modelService);
  }

  /**
   * Initialize tabs content on ready event
   *
   * @action PageEventOpen type === 'read'
   */
  PageEventOpenRead$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventOpen>(PageEventOpen.TYPE),
    filter(action => this.filterEntity(action.payload.entity) && action.payload.type === PageTypeEnum.read),
    switchMap(action => {

      const tabUids = this.pageService.getReadTabUids();

      // Tab properties sell
      if (tabUids.indexOf(PageTabEnum.customAttributeReadPropertySale) > -1) {

        // Register searchlist
        this.propertySearchlistService.register(PageTabEnum.customAttributeReadPropertySale);
      }

      // Tab properties rent
      if (tabUids.indexOf(PageTabEnum.customAttributeReadPropertyRent) > -1) {

        // Register searchlist
        this.propertySearchlistService.register(PageTabEnum.customAttributeReadPropertyRent);
      }

      // Tab promotions
      if (tabUids.indexOf(PageTabEnum.customAttributeReadPromotion) > -1) {

        // Register searchlist
        this.promotionSearchlistService.register(PageTabEnum.customAttributeReadPromotion);
      }

      // Tab contacts
      if (tabUids.indexOf(PageTabEnum.customAttributeReadContact) > -1) {

        // Register searchlist
        this.contactSearchlistService.register(PageTabEnum.customAttributeReadContact);
      }

      return [];
    }),
  ));

  /**
   * Update tabs content on change tab index event
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

      // Not tab property, promotion or contact
      if ([
        PageTabEnum.customAttributeReadPropertySale,
        PageTabEnum.customAttributeReadPropertyRent,
        PageTabEnum.customAttributeReadPromotion,
        PageTabEnum.customAttributeReadContact,
      ].indexOf(action.payload.tabUid) === -1) {

        return [];
      }

      if (
        PageTabEnum.customAttributeReadPropertySale.indexOf(action.payload.tabUid) > -1 ||
        PageTabEnum.customAttributeReadPropertyRent.indexOf(action.payload.tabUid) > -1
      ) {

        const filters: Partial<PropertySearchModel> = {
          type: PageTabEnum.customAttributeReadPropertySale.indexOf(action.payload.tabUid) > -1 ? ListTypeEnum.sell : ListTypeEnum.rent,
          customAttributeIds: model.values.map(value => value.id),
        };

        // Load properties linked to this custom attribute's values
        this.propertySearchlistService.submitByFilters(
          this.propertySearchlistService.getUid(action.payload.tabUid),
          filters,
        );

        return [];
      }

      if (PageTabEnum.customAttributeReadPromotion.indexOf(action.payload.tabUid) > -1) {

        const filters: Partial<PromotionSearchModel> = {
          customAttributeIds: model.values.map(value => value.id),
        };

        // Load promotions linked to this custom attribute's values
        this.promotionSearchlistService.submitByFilters(
          this.promotionSearchlistService.getUid(action.payload.tabUid),
          filters,
        );

        return [];
      }

      if (PageTabEnum.customAttributeReadContact.indexOf(action.payload.tabUid) > -1) {

        const filters: Partial<ContactSearchModel> = {
          mode: ListTypeEnum.contact,
          customAttributeIds: model.values.map(value => value.id),
        };

        // Load contacts linked to this custom attribute's values
        this.contactSearchlistService.submitByFilters(
          this.contactSearchlistService.getUid(action.payload.tabUid),
          filters,
        );

        return [];
      }

      return [];
    })),
  );

  /**
   * @inheritDoc
   */
  PageEventClickMenuItem$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType<PageEventClickMenuItem>(PageEventClickMenuItem.TYPE),
    filter(action => this.filterEntity(action.payload.entity)),
    switchMap(action => zip(
      of(action),
      this.pageService.selectModel(),
    )),
    switchMap(([action, model]) => {

      // Remove
      if (action.payload.menuItem.id === 'remove') {

        return of(
          new CustomAttributeEventRemove({ id: model.id }),
        );
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: CustomAttributeModel): Action {

    return new CustomAttributeUpsert({
      models: [model],
    });
  }
}
