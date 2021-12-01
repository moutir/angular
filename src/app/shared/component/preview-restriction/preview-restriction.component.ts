import { Component, Input } from '@angular/core';

import { RestrictionModel } from '../../model/restriction.model';

@Component({
  selector: 'app-shared-preview-restriction',
  templateUrl: './preview-restriction.component.html',
  styleUrls: ['./preview-restriction.component.scss'],
})
export class PreviewRestrictionComponent {

  /**
   * Restriction to preview or null if not available yet
   */
  @Input() restriction: RestrictionModel|null;

}
