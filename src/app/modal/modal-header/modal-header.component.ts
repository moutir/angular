import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-modal-header',
  templateUrl: './modal-header.component.html',
})
export class ModalHeaderComponent {

  /**
   * Title label (considered NOT translated)
   */
  @Input() labelTitle: string;

  /**
   * Has close button
   */
  @Input() hasCloseButton: boolean = false;

  /**
   * Event click close
   */
  @Output() clickClose: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Clicked the close button
   */
  onClickCloseButton(): void {

    this.clickClose.emit();
  }
}
