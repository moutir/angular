import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {

  /**
   * Current color
   */
  @Input() color: string = '';

  /**
   * Is color picker disabled?
   */
  @Input() isDisabled: boolean = false;

  /**
   * Popup position
   * Available options:
   *  'auto' (It does not always fit the popup inside viewport)
   *  'top', 'bottom', 'left', 'right',
   *  'top-left', 'top-right', 'bottom-left', 'bottom-right'
   */
  @Input() popupPosition: string = 'top';

  /**
   *  Color pick triggered
   */
  @Output() pick: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Selected color
   */
  onSelectColor(color: string): void {

    this.pick.emit(color);
  }
}
