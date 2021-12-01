import { Component, Input } from '@angular/core';

import { PromotionModel } from '../../shared/model/promotion.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { PromotionService } from '../../core/shared/promotion/promotion.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { HistoryService } from '../../core/shared/history/history.service';
import { EntityEnum } from '../../shared/enum/entity.enum';

@Component({
  selector: 'app-promotion-table-row',
  templateUrl: './promotion-table-row.component.html',
  styleUrls: ['./promotion-table-row.component.scss'],
})
export class PromotionTableRowComponent extends TableRowComponentAbstract {

  /**
   * Promotion to display
   */
  @Input() promotion: PromotionModel = new PromotionModel();

  /**
   * List of enabled/disabled features
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Constructor
   */
  constructor(
    private promotionService: PromotionService,
    private runtimeService: RuntimeService,
    private historyService: HistoryService,
    private trackerService: TrackerService,
  ) {

    super();
  }

  /**
   * Clicked on thumbnail
   */
  onClickThumbnail(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.runtimeService.previewImage(this.promotion.photoLargeURL, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked brochure button
   */
  onClickButtonBrochure(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or a blacklisted promotion
    if (this.isPlaceholder || this.promotion.isBlacklisted) {

      return;
    }

    this.promotionService.openBrochureMenu(this.promotion.id, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked history button
   */
  onClickButtonHistory(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or a blacklisted promotion
    if (this.isPlaceholder || this.promotion.isBlacklisted) {

      return;
    }

    // New history enabled
    if (this.feature.history === true) {

      this.historyService.openModal(EntityEnum.promotion, this.promotion.id, this.promotion.name);

      // Stats
      this.trackerService.trackString(TrackingActionEnum.promotionRowHistory, this.promotion.name);
    }
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.promotion;
  }
}
