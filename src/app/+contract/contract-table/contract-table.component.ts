import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { ContractModel } from '../../shared/model/contract.model';

@Component({
  selector: 'app-contract-table',
  templateUrl: './contract-table.component.html',
  styleUrls: ['./contract-table.component.scss'],
})
export class ContractTableComponent extends TableComponentAbstract<ContractModel> {

}
