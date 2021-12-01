import { EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { ModalChoiceInterface } from '../../shared/interface/modal-choice.interface';

export abstract class ModalComponentAbstract<I> implements OnChanges {

  /**
   * Is the confirm modal visible ?
   */
  @Input() isVisible: boolean = false;

  /**
   * Event emitter submit modal
   */
  @Output() submitModal: EventEmitter<ModalChoiceInterface<I>> = new EventEmitter<ModalChoiceInterface<I>>();

  /**
   * Is the confirm modal active ?
   */
  isActive: boolean = false;

  /**
   * Deactivation timeout
   */
  protected deactivationTimeout: number;

  /**
   * Deactivation delay (ms)
   */
  protected deactivationDelay: number = 300;

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    // Changed visibility
    if (changes.isVisible) {

      changes.isVisible.currentValue === true ? this.activate() : this.deactivate();
    }
  }

  /**
   * Clicked button
   */
  onClickButton(isValid: boolean): void {

    this.submitModal.emit({
      isValid: isValid,
    });
  }

  /**
   * Activate modal
   */
  protected activate(): void {

    // Clear timeout
    if (this.deactivationTimeout) {

      clearTimeout(this.deactivationTimeout);
    }

    this.isVisible = true;
    this.isActive = true;
  }

  /**
   * Deactivate modal
   */
  protected deactivate(): void {

    this.isVisible = false;
    this.deactivationTimeout = setTimeout(() => this.isActive = false, this.deactivationDelay);
  }
}
