import { Component, Input } from '@angular/core';

import { LeadModel } from '../../shared/model/lead.model';
import { LeadService } from '../../core/shared/lead/lead.service';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { LeadPageService } from '../../core/shared/lead/lead-page.service';

@Component({
  selector: 'app-lead-table-row',
  templateUrl: './lead-table-row.component.html',
  styleUrls: ['./lead-table-row.component.scss'],
})
export class LeadTableRowComponent extends TableRowComponentAbstract {

  /**
   * Lead to display
   */
  @Input() lead: LeadModel = new LeadModel();

  /**
   * Constructor
   */
  constructor(
    private leadService: LeadService,
    private pageService: LeadPageService,
  ) {

    super();
  }

  /**
   * Return the action tooltip's translation key
   */
  getActionTooltip(): string {

    return this.pageService.getEmailActionTooltip(this.lead);
  }

  /**
   * Clicked on send mail button
   */
  onClickSendMail(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.leadService.sendEmail([this.lead]);
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.lead;
  }
}
