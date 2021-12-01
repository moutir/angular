import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { DnsModel } from '../../shared/model/dns.model';

@Component({
  selector: 'app-dns-table',
  templateUrl: './dns-table.component.html',
})
export class DnsTableComponent extends TableComponentAbstract<DnsModel> {

}
