import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ContractModel } from '../../shared/model/contract.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { ContractContactModel } from '../../shared/model/contract-contact.model';

@Component({
  selector: 'app-contract-table-row',
  templateUrl: './contract-table-row.component.html',
  styleUrls: ['./contract-table-row.component.scss'],
})
export class ContractTableRowComponent extends TableRowComponentAbstract implements OnChanges {

  /**
   * Contract to display
   */
  @Input() contract: ContractModel = new ContractModel();

  /**
   * Broker
   */
  broker: ContractContactModel;

  /**
   * Buyer
   */
  buyer: ContractContactModel;

  /**
   * Seller
   */
  seller: ContractContactModel;

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes.contract) {

      this.broker = this.contract.contractContacts.find(contractContact => contractContact.typeId === 'owner_broker');
      this.seller = this.contract.contractContacts.find(contractContact => contractContact.typeId === 'owner');
      this.buyer = this.contract.contractContacts.find(contractContact => contractContact.typeId === 'customer');
    }
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.contract;
  }
}
