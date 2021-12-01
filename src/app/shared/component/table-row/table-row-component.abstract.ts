import { EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ModelAbstract } from '../../class/model.abstract';

export abstract class TableRowComponentAbstract implements OnInit {

  /**
   * Is the row a placeholder ?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Is the row selected ?
   */
  @Input() isSelected: boolean = false;

  /**
   * Is the row loading ?
   */
  @Input() isLoading: boolean = false;

  /**
   * Models selectable
   */
  @Input() modelsSelectable: ModelAbstract[] = [];

  /**
   * Is the row using single and mass actions ?
   */
  @Input() isUsingActions: boolean = true;

  /**
   * Select status changed
   */
  @Output() changeSelection: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Material checkbox component
   */
  @ViewChild(MatCheckbox, { static: false }) checkbox: MatCheckbox;

  /**
   * Initialized component
   */
  ngOnInit(): void {

    if (this.isPlaceholder) {

      this.isLoading = true;
    }
  }

  /**
   * Is the row selectable (checkbox enabled) ?
   */
  isSelectable(): boolean {

    const model = this.getModel();

    return this.isPlaceholder === false && this.modelsSelectable.some(modelSelectable => modelSelectable.id === model.id);
  }

  /**
   * Changed checkbox status
   */
  onChangeCheckbox(): void {

    // Emit event
    this.changeSelection.emit(this.isSelected);
  }

  /**
   * Clicked checkbox
   */
  onClickCheckbox(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();
  }

  /**
   * Clicked on the cell with checkbox
   */
  onClickCheckboxCell(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Row is selectable
    if (this.isSelectable()) {

      // Manually launch the ripple effect
      this.checkbox.ripple.launch(0, 0);

      // Emit event
      this.changeSelection.emit(!this.isSelected);
    }
  }

  /**
   * Return the model
   */
  protected abstract getModel(): ModelAbstract;
}
