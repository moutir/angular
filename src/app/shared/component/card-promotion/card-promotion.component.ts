import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PromotionModel } from '../../model/promotion.model';
import { PromotionService } from '../../../core/shared/promotion/promotion.service';

@Component({
  selector: 'app-shared-card-promotion',
  templateUrl: './card-promotion.component.html',
  styleUrls: ['./card-promotion.component.scss'],
})
export class CardPromotionComponent {

  /**
   * promotion model
   */
  @Input() promotion: PromotionModel = new PromotionModel();

  /**
   * Is the component a placeholder ?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Is the component deletable?
   */
  @Input() isDeletable: boolean = false;

  /**
   * Clicked on delete
   */
  @Output() clickDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Constructor
   */
  constructor(
    private promotionService: PromotionService,
  ) {

  }

  /**
   * Clicked on promotion thumbnail
   */
  onClickThumbnail(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.promotionService.preview(this.promotion.id, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked on delete button
   */
  onClickDelete(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.clickDelete.emit();
  }
}
