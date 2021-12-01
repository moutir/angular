import { EventEmitter, Input, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';

import { OrderEnum } from '../../enum/order.enum';
import { SortInterface } from '../../interface/sort.interface';
import { ListSelectionInterface } from '../../interface/list-selection.interface';
import { ModelAbstract } from '../../class/model.abstract';
import { EventContextModelInterface } from '../../interface/event-context-model.interface';
import { EventChangeSelectionModelInterface } from '../../interface/event-change-selection-model.interface';

export abstract class TableComponentAbstract<Model extends ModelAbstract> {

  /**
   * Models
   */
  @Input() models: Model[]|null = null;

  /**
   * Models: selectable
   */
  @Input() modelsSelectable: Model[] = [];

  /**
   * Models: selected
   */
  @Input() modelsSelected: Model[] = [];

  /**
   * Sort
   */
  @Input() sort: SortInterface = {
    id: '',
    order: OrderEnum.asc,
  };

  /**
   * Selection
   */
  @Input() selection: ListSelectionInterface = {
    isSelectedAll: false,
    ids: [],
    isLoading: false,
  };

  /**
   * Is the header checkbox selected ?
   */
  @Input() isSelectedHeader: boolean = false;

  /**
   * Is the table using single and mass actions ?
   */
  @Input() isUsingActions: boolean = true;

  /**
   * Are table rows clickable ?
   */
  @Input() isClickable: boolean = true;

  /**
   * Array of model ID that are loading
   */
  @Input() loadingModelIds: string[] = [];

  /**
   * Number of placeholders
   */
  @Input() placeholderCount: number = 10;

  /**
   * Changed sort
   */
  @Output() changeSort: EventEmitter<Sort> = new EventEmitter<Sort>();

  /**
   * Selected header
   */
  @Output() changeSelectionHeader: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Selected model
   */
  @Output() changeSelectionModel: EventEmitter<
    EventChangeSelectionModelInterface<Model>
  > = new EventEmitter<EventChangeSelectionModelInterface<Model>>();

  /**
   * Clicked a model
   */
  @Output() clickModel: EventEmitter<Model> = new EventEmitter<Model>();

  /**
   * Opened context menu on model
   */
  @Output() contextModel: EventEmitter<EventContextModelInterface<Model>> = new EventEmitter<EventContextModelInterface<Model>>();

  /**
   * Track by model ID
   */
  trackById(index: number, model: Model): string {

    return model.id;
  }

  /**
   * Clicked a model
   */
  onClickModel(model: Model): void {

    if (this.isClickable === false) {

      return;
    }

    this.clickModel.emit(model);
  }

  /**
   * Changed the sort order
   */
  onChangeSort(sort: Sort): void {

    this.changeSort.emit(sort);
  }

  /**
   * Opened contextual menu
   */
  onContextMenu(event: MouseEvent, model: Model): void {

    event.preventDefault();
    event.stopPropagation();

    this.contextModel.emit({
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      model: model,
    });
  }

  /**
   * Changed header selection
   */
  onChangeSelectionHeader(isSelected: boolean): void {

    this.changeSelectionHeader.emit(isSelected);
  }

  /**
   * Changed model selection
   */
  onChangeSelectionModel(isSelected: boolean, model: Model): void {

    this.changeSelectionModel.emit({
      isSelected,
      model,
    });
  }
}
