import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { StateInterface } from '../../../core-store/state.interface';
import { selectUiBrochureMenuItems, selectUiPreviewPromotion } from '../../../core-store/ui-promotion/selectors';
import { PromotionModel } from '../../../shared/model/promotion.model';
import { BrowserService } from '../browser/browser.service';
import { PositionInterface } from '../../../shared/interface/position.interface';
import { PromotionEventPreview } from '../../../core-store/ui-promotion/actions/promotion-event-preview';
import { PromotionUpdateBrochureMenu } from '../../../core-store/ui-promotion/actions/promotion-update-brochure-menu';
import { BrochureQualityEnum } from '../../../shared/enum/brochure-quality.enum';
import { LanguageEnum } from '../../../shared/enum/language.enum';
import { MenuInterface } from '../../../shared/interface/menu.interface';
import { PromotionEventSendEmail } from '../../../core-store/ui-promotion/actions/promotion-event-send-email';
import { PromotionEventArchive } from '../../../core-store/ui-promotion/actions/promotion-event-archive';
import { PromotionEventUnarchive } from '../../../core-store/ui-promotion/actions/promotion-event-unarchive';
import { PromotionEventRemoveMls } from '../../../core-store/ui-promotion/actions/promotion-event-remove-mls';
import { TrackerService } from '../tracker/tracker.service';
import { TrackingActionEnum } from '../../../shared/enum/tracking-action.enum';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { HistoryService } from '../history/history.service';
import { EntityEnum } from '../../../shared/enum/entity.enum';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PromotionSearchModel } from '../../../shared/model/promotion-search.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PromotionApiService } from '../../../api/shared/promotion/promotion-api.service';
import { selectDataPromotion, selectDataPromotions } from '../../../core-store/data-promotion/selectors';
import { Dictionary } from '../../../shared/class/dictionary';

@Injectable()
export class PromotionService extends ModelServiceAbstract<PromotionModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private browserService: BrowserService,
    private trackerService: TrackerService,
    private runtimeService: RuntimeService,
    private historyService: HistoryService,
    private promotionApiService: PromotionApiService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): PromotionModel {

    return new PromotionModel();
  }

  /**
   * @inheritDoc
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: PromotionSearchModel,
  ): Observable<ModelListInterface<PromotionModel>> {

    return this.promotionApiService.list(pagination, sort, filters);
  }

  /**
   * @inheritDoc
   */
  ids(filters: PromotionSearchModel): Observable<string[]> {

    return this.promotionApiService.ids(filters);
  }

  /**
   * @inheritDoc
   */
  select(id: string): Observable<PromotionModel|null> {

    return this.store$.select(selectDataPromotion(id));
  }

  /**
   * Select promotion models
   */
  selectPromotions(): Observable<Dictionary<PromotionModel>> {

    return this.store$.select(selectDataPromotions);
  }

  /**
   * Select promotion to preview
   */
  selectPreviewPromotion(): Observable<PromotionModel|null> {

    return this.store$.select(selectUiPreviewPromotion);
  }

  /**
   * Return the brochures menu definition
   */
  selectBrochureMenuItems(): Observable<MenuInterface> {

    return this.store$.select(selectUiBrochureMenuItems);
  }

  /**
   * @inheritDoc
   */
  page(id: string): void {

    // TODO[later] Remove tracking from here and move it to property page component on init

    // Stats
    this.trackerService.trackString(TrackingActionEnum.promotionView, id);

    // Is in promotion legacy URL and has legacy function to show promotion details
    if (
      this.browserService.getWindow().location.pathname.indexOf('/promotion/') === 0 &&
      this.browserService.getWindow().showPromotionDetails
    ) {

      // Call legacy function to show promotion details
      this.browserService.getWindow().showPromotionDetails(id);

    } else {

      // Good old redirect
      this.browserService.redirect('/promotion/active?promotion_id=' + id);
    }
  }

  /**
   * Preview a promotion at the given position
   */
  preview(id: string, position: PositionInterface): void {

    this.store$.dispatch(
      new PromotionEventPreview({
        promotionId: id,
        position: position,
      }),
    );
  }

  /**
   * Send promotions by email
   */
  sendEmail(promotionIds: string[]): void {

    this.store$.dispatch(
      new PromotionEventSendEmail({ promotionIds }),
    );
  }

  /**
   * Archive promotions
   */
  archive(promotionIds: string[]): void {

    this.store$.dispatch(
      new PromotionEventArchive({ promotionIds }),
    );
  }

  /**
   * Unarchive promotions
   */
  unarchive(promotionIds: string[]): void {

    this.store$.dispatch(
      new PromotionEventUnarchive({ promotionIds }),
    );
  }

  /**
   * Remove promotions from MLS
   */
  removeMls(promotionIds: string[]): void {

    this.store$.dispatch(
      new PromotionEventRemoveMls({ promotionIds }),
    );
  }

  /**
   * Display brochures menu at the given position
   */
  openBrochureMenu(id: string, position: PositionInterface): void {

    this.store$.dispatch(
      new PromotionUpdateBrochureMenu({
        brochureMenu: {
          promotionId: id,
          position: position,
        },
      }),
    );
  }

  /**
   * Open brochure for the @promotionId
   */
  brochure(
    promotionId: string,
    quality: BrochureQualityEnum,
    language: LanguageEnum,
  ): void {

    // Open brochure in _blank
    this.browserService.blank([
      '/promotion/export',
      language,
      quality,
      promotionId,
    ].join('/'));
  }

  /**
   * Open history (Support for form legacy code)
   */
  openHistoryModal(id: string, name: string): void {

    this
      .runtimeService
      .selectFeature()
      .pipe(take(1))
      .subscribe(feature => {

        // Stats
        this.trackerService.trackString(TrackingActionEnum.promotionRowHistory, name);

        // New history enabled
        if (feature.history === true) {

          this.historyService.openModal(EntityEnum.promotion, id, name);
        }
      });
  }
}
