import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { RuntimeService } from '../../runtime/shared/runtime.service';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { PromotionModel } from '../../shared/model/promotion.model';
import { PromotionSearchOptionsInterface } from '../../shared/interface/promotion-search-options.interface';
import { PromotionSearchModel } from '../../shared/model/promotion-search.model';
import { PromotionSearchlistService } from '../../core/shared/promotion/promotion-searchlist.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { MenuInterface } from '../../shared/interface/menu.interface';
import { MenuItemInterface } from '../../shared/interface/menu-item.interface';
import { BrochureQualityEnum } from '../../shared/enum/brochure-quality.enum';
import { LanguageEnum } from '../../shared/enum/language.enum';
import { PromotionService } from '../../core/shared/promotion/promotion.service';
import { OperationEnum } from '../../shared/enum/operation.enum';
import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';
import { HistoryModel } from '../../shared/model/history.model';
import { HistoryInterface } from '../../shared/interface/history.interface';
import { HistoryService } from '../../core/shared/history/history.service';
import { SearchlistComponentAbstract } from '../../shared/component/searchlist/searchlist-component.abstract';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { PromotionConfig } from '../../core/shared/promotion/promotion.config';

@Component({
  selector: 'app-promotion-searchlist',
  templateUrl: './promotion-searchlist.component.html',
  styleUrls: ['./promotion-searchlist.component.scss'],
})
export class PromotionSearchlistComponent extends SearchlistComponentAbstract<
  PromotionModel,
  PromotionSearchModel,
  PromotionSearchOptionsInterface
> implements OnInit {

  /**
   * Operation names
   */
  operationNameRemoveMls: string = OperationEnum.promotionRemoveMls;

  /**
   * State observables
   */
  runtimeFeature$: Observable<RuntimeFeatureInterface>;
  runtimePermissions$: Observable<PermissionEnum[]>;
  brochureMenuItems$: Observable<MenuInterface>;
  promotionHistory$: Observable<HistoryInterface>;
  historyModels$: Observable<HistoryModel[]>;

  /**
   * List of operation names that have a subform
   */
  private operationSubform: string[] = [
    OperationEnum.promotionRemoveMls,
  ];

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: PromotionConfig,
    protected searchlistService: PromotionSearchlistService,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected trackerService: TrackerService,
    protected promotionService: PromotionService,
    protected historyService: HistoryService,
  ) {

    super(
      moduleConfig,
      searchlistService,
      runtimeService,
      router,
    );
  }

  /**
   * @inheritDoc
   */
  protected setStateObservable(): void {

    super.setStateObservable();

    this.runtimePermissions$ = this.runtimeService.selectPermissions();
    this.runtimeFeature$ = this.runtimeService.selectFeature();
    this.brochureMenuItems$ = this.promotionService.selectBrochureMenuItems();
    this.promotionHistory$ = this.historyService.selectHistory();
    this.historyModels$ = this.historyService.selectHistoryModels();
  }

  /**
   * @inheritDoc
   */
  onClickModel(model: PromotionModel): void {

    // Nothing happens for a blacklisted promotion
    if (model.isBlacklisted === true) {

      return;
    }

    this.promotionService.page(model.id);
  }

  /**
   * @inheritDoc
   */
  onClickMenuItemOperation(menuItem: MenuItemInterface): void {

    // Parent
    super.onClickMenuItemOperation(menuItem);

    this
      .selection$
      .pipe(take(1))
      .subscribe(selection => {

        // Operations that trigger instantly
        switch (menuItem.id) {

          case OperationEnum.promotionArchive:
            this.promotionService.archive(selection.ids);
            break;

          case OperationEnum.promotionUnarchive:
            this.promotionService.unarchive(selection.ids);
            break;

          case OperationEnum.promotionSendEmail:
            this.promotionService.sendEmail(selection.ids);
            break;
        }

        // Operation with subform
        if (this.operationSubform.indexOf(menuItem.id) > -1) {

          return;
        }

        // Reset current operation
        this.resetOperation();
      });
  }

  /**
   * Submitted modal for operation: remove MLS
   */
  onSubmitModalOperationRemoveMls(event: ModalChoiceInterface<string[]>): void {

    // Reset current operation
    this.resetOperation();

    // User cancelled
    if (event.isValid === false) {

      return;
    }

    this.promotionService.removeMls(event.data);
  }

  /**
   * Clicked a brochure menu item
   */
  onClickMenuItemBrochure(menuItem: MenuItemInterface): void {

    const brochure: {
      promotionId: string,
      type: string,
      privacy: string,
      quality: BrochureQualityEnum,
      language: LanguageEnum,
    } = JSON.parse(menuItem.id);

    // No promotion ID defined
    if (brochure.promotionId === '') {

      return;
    }

    // Stats
    this.trackerService.trackStringBrochure(
      TrackingActionEnum.promotionRowBrochure,
      brochure.promotionId,
      brochure.type,
      brochure.privacy,
      brochure.quality,
      brochure.language,
    );

    // Open brochure
    this.promotionService.brochure(brochure.promotionId, brochure.quality, brochure.language);
  }

  /**
   * Submitted history modal
   */
  onSubmitModalHistory(event: ModalChoiceInterface<HistoryInterface>): void {

    // User cancelled
    if (event.isValid === false) {

      this.historyService.closeModal();

      return;
    }
  }
}
