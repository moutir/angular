import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-contextual',
  templateUrl: './contextual.component.html',
  styleUrls: ['./contextual.component.scss'],
})
export class ContextualComponent {

  /**
   * Is visible?
   */
  @Input() isVisible: boolean;

  /**
   * Event emitter for overlay click
   */
  @Output() clickOverlay: EventEmitter<null> = new EventEmitter<null>();

  /**
   * Clicked on the overlay
   */
  onClickOverlay(event: MouseEvent): void {

    event.preventDefault();
    event.stopPropagation();

    this.clickOverlay.emit();
  }
}
