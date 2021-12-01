import { Component, Input } from '@angular/core';

import { RestrictionService } from '../../../core/shared/restriction/restriction.service';
import { RestrictionLinkLayoutType } from '../../type/restriction-link-layout.type';
import { RestrictionModel } from '../../model/restriction.model';

@Component({
  selector: 'app-shared-restriction-link',
  templateUrl: './restriction-link.component.html',
  styleUrls: ['./restriction-link.component.scss'],
})
export class RestrictionLinkComponent {

  /**
   * Restriction
   */
  @Input() restriction: RestrictionModel = new RestrictionModel();

  /**
   * Layout type
   */
  @Input() layout: RestrictionLinkLayoutType = 'icon';

  /**
   * Placeholder mode?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private restrictionService: RestrictionService,
  ) {

  }

  /**
   * Clicked component
   */
  onClick(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // No restriction ID or is a placeholder
    if (!this.restriction.id || this.isPlaceholder === true) {

      return;
    }

    this.restrictionService.preview(this.restriction.id, {
      x: event.clientX,
      y: event.clientY,
    });
  }
}
