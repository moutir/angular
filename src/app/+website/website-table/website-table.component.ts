import { Component } from '@angular/core';

import { TableComponentAbstract } from '../../shared/component/table/table-component.abstract';
import { WebsiteModel } from '../../shared/model/website.model';

@Component({
  selector: 'app-website-table',
  templateUrl: './website-table.component.html',
  styleUrls: ['./website-table.component.scss'],
})
export class WebsiteTableComponent extends TableComponentAbstract<WebsiteModel> {

}
