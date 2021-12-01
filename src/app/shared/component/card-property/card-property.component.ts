import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PropertyModel } from '../../model/property.model';
import { PropertyService } from '../../../core/shared/property/property.service';

@Component({
  selector: 'app-shared-card-property',
  templateUrl: './card-property.component.html',
  styleUrls: ['./card-property.component.scss'],
})
export class CardPropertyComponent {

  /**
   * Property model
   */
  @Input() property: PropertyModel = new PropertyModel();

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
    private propertyService: PropertyService,
  ) {

  }

  /**
   * Clicked on property thumbnail
   */
  onClickThumbnail(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or a property preview not allowed
    if (this.isPlaceholder || this.property.isAllowedPreview === false) {

      return;
    }

    this.propertyService.preview(this.property.id, {
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
