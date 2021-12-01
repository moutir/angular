import { Component, Input, OnChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PromotionModel } from '../../shared/model/promotion.model';

@Component({
  selector: 'app-promotion-modal-remove-mls',
  templateUrl: './promotion-modal-remove-mls.component.html',
  styleUrls: ['./promotion-modal-remove-mls.component.scss'],
})
export class PromotionModalRemoveMlsComponent extends ModalComponentAbstract<string[]> implements OnChanges {

  /**
   * Selected promotions
   */
  @Input() promotions: PromotionModel[] = [];

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: this.promotions.map(promotion => promotion.id),
    });
  }
}
