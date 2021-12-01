import { Component, Input } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { PropertyValuationInterface } from '../../shared/interface/property-valuation.interface';

@Component({
  selector: 'app-property-modal-valuation',
  templateUrl: './property-modal-valuation.component.html',
  styleUrls: ['./property-modal-valuation.component.scss'],
})
export class PropertyModalValuationComponent
  extends ModalComponentAbstract<PropertyValuationInterface> {

  /**
   * Valuation state
   */
  @Input() valuation: PropertyValuationInterface;

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    // Emit event
    this.submitModal.emit({
      isValid: isValid,
      data: {
        ...this.valuation,
        step: isValid ? this.valuation.step + 1 : 0,
      },
    });
  }
}
