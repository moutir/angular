import { Component, Input } from '@angular/core';

import { MatchingModel } from '../../shared/model/matching.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { PropertyService } from '../../core/shared/property/property.service';

@Component({
  selector: 'app-matching-table-row',
  templateUrl: './matching-table-row.component.html',
  styleUrls: ['./matching-table-row.component.scss'],
})
export class MatchingTableRowComponent extends TableRowComponentAbstract {

  /**
   * Matching to display
   */
  @Input() matching: MatchingModel = new MatchingModel();

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
    private propertyService: PropertyService,
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

    this.runtimeService.previewImage(this.matching.property.photoLargeURL, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked a property
   */
  onClickProperty(event: MouseEvent, propertyId: string): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.propertyService.preview(propertyId, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.matching;
  }
}
