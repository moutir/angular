import { Component, Input } from '@angular/core';

import { EmailModel } from '../../shared/model/email.model';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { EmailService } from '../../core/shared/email/email.service';
import { EmailStatusEnum } from '../../shared/enum/email-status.enum';

@Component({
  selector: 'app-email-table-row',
  templateUrl: './email-table-row.component.html',
  styleUrls: ['./email-table-row.component.scss'],
})
export class EmailTableRowComponent extends TableRowComponentAbstract {

  /**
   * Email to display
   */
  @Input() email: EmailModel = new EmailModel();

  /**
   * Constants
   */
  readonly EMAIL_STATUS_DELIVERED: EmailStatusEnum = EmailStatusEnum.delivered;
  readonly EMAIL_STATUS_OPENED: EmailStatusEnum = EmailStatusEnum.opened;
  readonly EMAIL_STATUS_BOUNCED: EmailStatusEnum = EmailStatusEnum.bounced;

  /**
   * Constructor
   */
  constructor(
    private emailService: EmailService,
  ) {

    super();
  }

  /**
   * Clicked on summary button
   */
  onClickButtonSummary(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.emailService.summary({
      step: 1,
      email: this.email,
    });

  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.email;
  }
}
