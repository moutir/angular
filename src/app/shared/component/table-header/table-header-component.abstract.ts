import { Input } from '@angular/core';
import { TableRowComponentAbstract } from '../table-row/table-row-component.abstract';
import { ModelAbstract } from '../../class/model.abstract';

export abstract class TableHeaderComponentAbstract extends TableRowComponentAbstract {

  /**
   * Is the row selection loading ?
   */
  @Input() isLoadingSelection: boolean = false;

  /**
   * Is the row selection disabled ?
   */
  @Input() isDisabledSelection: boolean = false;

  /**
   * Is the row using single and mass actions ?
   */
  @Input() isUsingActions: boolean = true;

  /**
   * Constructor
   */
  constructor() {

    super();
  }

  /**
   * @inheritDoc
   */
  isSelectable(): boolean {

    return this.isDisabledSelection === false;
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return null;
  }
}
