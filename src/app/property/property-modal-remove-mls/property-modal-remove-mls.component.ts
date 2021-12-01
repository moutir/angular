import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PropertyModel } from '../../shared/model/property.model';

@Component({
  selector: 'app-property-modal-remove-mls',
  templateUrl: './property-modal-remove-mls.component.html',
  styleUrls: ['./property-modal-remove-mls.component.scss'],
})
export class PropertyModalRemoveMlsComponent extends ModalComponentAbstract<string[]> implements OnChanges {

  /**
   * Selected properties
   */
  @Input() properties: PropertyModel[] = [];

  /**
   * Is there any invalid properties?
   */
  hasInvalidProperties: boolean;

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    // Became visible
    if (changes.isVisible && changes.isVisible.currentValue === true) {

      this.hasInvalidProperties = this.hasInvalidSelection();
    }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
      data: this.properties.map(property => property.id),
    });
  }

  /**
   * Check if selected properties are invalid (included in promotions OR is not a MLS property)
  */
  private hasInvalidSelection(): boolean {

    return this.properties && this.properties.some(
      property => !!property.promotionId || property.isMls === false,
    );
  }
}
