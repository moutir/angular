import { Component, Input } from '@angular/core';

import { PromotionModel } from '../../model/promotion.model';

@Component({
  selector: 'app-shared-preview-promotion',
  templateUrl: './preview-promotion.component.html',
  styleUrls: ['./preview-promotion.component.scss'],
})
export class PreviewPromotionComponent {

  /**
   * Promotion to preview or null if not available yet
   */
  @Input() promotion: PromotionModel|null;
}
