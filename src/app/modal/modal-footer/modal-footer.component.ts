import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-modal-footer',
  templateUrl: './modal-footer.component.html',
})
export class ModalFooterComponent {

  /**
   * Button labels (considered NOT translated)
   */
  @Input() labelValid: string = 'label_confirm_deactivate_confirm_button';
  @Input() labelInvalid: string = 'label_confirm_deactivate_cancel_button';

  /**
   * Buttons should be visible?
   */
  @Input() isVisibleValid: boolean = true;
  @Input() isVisibleInvalid: boolean = true;

  /**
   * Buttons should be disabled?
   */
  @Input() isDisabledValid: boolean = false;
  @Input() isDisabledInvalid: boolean = false;

  /**
   * Event emitter for clicked button
   */
  @Output() clickButton: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Clicked on button valid
   */
  onClickValid(): void {

    this.clickButton.emit(true);
  }

  /**
   * Clicked on button invalid
   */
  onClickInvalid(): void {

    this.clickButton.emit(false);
  }
}
