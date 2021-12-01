import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { EmailSummaryInterface } from '../../shared/interface/email-summary.interface';
import { EmailStatusEnum } from '../../shared/enum/email-status.enum';
import { PropertyService } from '../../core/shared/property/property.service';
import { PromotionService } from '../../core/shared/promotion/promotion.service';
import { EmailService } from '../../core/shared/email/email.service';
import { KeyValueType } from '../../shared/type/key-value.type';
import { EmailRecipientModel } from '../../shared/model/email-recipient.model';
import { TranslateService } from '@ngx-translate/core';
import { DatetimePipe } from '../../shared/pipe/datetime.pipe';

@Component({
  selector: 'app-email-modal-summary',
  templateUrl: './email-modal-summary.component.html',
  styleUrls: ['./email-modal-summary.component.scss'],
})
export class EmailModalSummaryComponent
  extends ModalComponentAbstract<EmailSummaryInterface> implements OnChanges {

  /**
   * Email summary state
   */
  @Input() summary: EmailSummaryInterface;

  /**
   * Full message mode state
   */
  hasFullMessage: boolean = false;

  /**
   * Recipient status data
   */
  recipientStatus: KeyValueType<EmailStatusEnum, {
    icon: string;
    label: string;
    cssClass: string;
    tooltip: (recipient: EmailRecipientModel) => string;
  }> = {};

  /**
   * Constructor
   */
  constructor(
    private emailService: EmailService,
    private propertyService: PropertyService,
    private promotionService: PromotionService,
    private translateService: TranslateService,
    private datetimePipe: DatetimePipe,
  ) {

    super();

    // Delivered
    this.recipientStatus[EmailStatusEnum.delivered] = {
      icon: 'mail',
      label: 'label_email_delivered',
      cssClass: 'email-status--delivered',
      tooltip: (recipient: EmailRecipientModel) => this.translateService.instant('label_email_not_opened'),
    };

    // Opened
    this.recipientStatus[EmailStatusEnum.opened] = {
      icon: 'drafts',
      label: 'label_email_opened',
      cssClass: 'email-status--opened',
      tooltip: (recipient: EmailRecipientModel) => this.translateService.instant('tooltip_email_open_dates', {
        date1: this.datetimePipe.transform(recipient.firstOpenDate) || this.translateService.instant('label_email_not_opened'),
        date2: this.datetimePipe.transform(recipient.lastOpenDate) || this.translateService.instant('label_email_not_opened'),
      }),
    };

    // Bounced
    this.recipientStatus[EmailStatusEnum.bounced] = {
      icon: 'cancel_schedule_send',
      label: 'label_email_bounced',
      cssClass: 'email-status--bounced',
      tooltip: (recipient: EmailRecipientModel) => {

        if (recipient.statusCode) {

          return this.translateService.instant('tooltip_email_bounce_reason', {
            reason: (recipient.statusCode + ' - ' + recipient.statusDescription),
          });
        }

        return this.translateService.instant('label_email_bounce_reason_not_found');
      },
    };
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.summary) {

      this.hasFullMessage = false;
    }
  }

  /**
   * @inheritDoc
   */
  onClickButton(isValid: boolean): void {

    // Emit event
    this.submitModal.emit({
      isValid: isValid,
      data: {
        step: 0,
        email: null,
      },
    });
  }

  /**
   * Clicked on property
   */
  onClickProperty(event: MouseEvent, propertyId: string): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.propertyService.preview(propertyId, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked on promotion
   */
  onClickPromotion(event: MouseEvent, promotionId: string): void {

    // Prevent propagation of click event
    event.stopPropagation();

    this.promotionService.preview(promotionId, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  /**
   * Clicked on toggle button
   */
  onClickButtonToggle(): void {

    this.hasFullMessage = !this.hasFullMessage;
  }
}
