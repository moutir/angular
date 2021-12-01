import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, switchMap } from 'rxjs/operators';
import { Observable, of, zip } from 'rxjs';

import { EffectsAbstract } from '../../ui-page/effects.abstract';
import { SectorService } from '../../../core/shared/sector/sector.service';
import { SectorPageService } from '../../../core/shared/sector/sector-page.service';
import { SectorModel } from '../../../shared/model/sector.model';
import { SectorOptionsInterface } from '../../../shared/interface/sector-options.interface';
import { SectorUpsert } from '../../data-sector/actions/sector-upsert';
import { PageEventChangeTabUid } from '../../ui-page/actions/page-event-change-tab-uid';
import { PropertySearchlistService } from '../../../core/shared/property/property-searchlist.service';
import { PageTabEnum } from '../../../shared/enum/page-tab.enum';
import { ListTypeEnum } from '../../../shared/enum/list-type.enum';
import { PageEventOpen } from '../../ui-page/actions/page-event-open';
import { PageTypeEnum } from '../../../shared/enum/page-type.enum';
import { FormService } from '../../../core/shared/form.service';
import { PageEventClickMenuItem } from '../../ui-page/actions/page-event-click-menu-item';
import { SectorEventRemove } from '../actions/sector-event-remove';

@Injectable()
export class PageEffects extends EffectsAbstract<SectorModel, SectorOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected actions$: Actions,
    protected formService: FormService,
    protected pageService: SectorPageService,
    protected modelService: SectorService,
    protected propertySearchlistService: PropertySearchlistService,
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

      // Tab property sale
      if (tabUids.indexOf(PageTabEnum.sectorReadPropertySale) > -1) {

        // Register searchlist
        this.propertySearchlistService.register(PageTabEnum.sectorReadPropertySale);
      }

      // Tab property rent
      if (tabUids.indexOf(PageTabEnum.sectorReadPropertyRent) > -1) {

        // Register searchlist
        this.propertySearchlistService.register(PageTabEnum.sectorReadPropertyRent);
      }

      return [];
    }),
  ));

  /**
   * Update tabs content on change tab UID event
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

      // Tab property sale or rent
      if ([PageTabEnum.sectorReadPropertySale, PageTabEnum.sectorReadPropertyRent].indexOf(action.payload.tabUid) > -1) {

        // Load properties linked to this sector's locations
        this.propertySearchlistService.submitByFilters(
          this.propertySearchlistService.getUid(action.payload.tabUid),
          {
            type: action.payload.tabUid === PageTabEnum.sectorReadPropertySale ? ListTypeEnum.sell : ListTypeEnum.rent,
            sectors: [model.id],
          },
        );
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
          new SectorEventRemove({ id: model.id }),
        );
      }

      return [];
    }),
  ));

  /**
   * @inheritDoc
   */
  protected getUpsertAction(model: SectorModel): Action {

    return new SectorUpsert({
      models: [model],
    });
  }
}
