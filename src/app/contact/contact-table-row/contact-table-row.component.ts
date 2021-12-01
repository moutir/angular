import { Component, Input } from '@angular/core';

import { ContactModel } from '../../shared/model/contact.model';
import { ContactService } from '../../core/shared/contact/contact.service';
import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { ModelAbstract } from '../../shared/class/model.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { ContactTypeEnum } from '../../shared/enum/contact-type.enum';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { HistoryService } from '../../core/shared/history/history.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { UserModel } from '../../shared/model/user.model';
import { TrackerService } from '../../core/shared/tracker/tracker.service';
import { TrackingActionEnum } from '../../shared/enum/tracking-action.enum';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';

@Component({
  selector: 'app-contact-table-row',
  templateUrl: './contact-table-row.component.html',
  styleUrls: ['./contact-table-row.component.scss'],
})
export class ContactTableRowComponent extends TableRowComponentAbstract {

  /**
   * Is user subscribed to beta performance
   */
  @Input() isBetaPerformance: boolean|null = null;

  /**
   * Contact to display
   */
  @Input() contact: ContactModel = new ContactModel();

  /**
   *  List of permissions granted
   */
  @Input() permissions: PermissionEnum[];

  /**
   * List of enabled/disabled features
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Security hash
   */
  @Input() hash: string = '';

  /**
   * Constants
   */
  readonly CONTACT_TYPE_BROKER: ContactTypeEnum = ContactTypeEnum.colleague;
  readonly CONTACT_TYPE_BROKER_SALE: ContactTypeEnum = ContactTypeEnum.colleagueSalesBroker;

  /**
   * Constructor
   */
  constructor(
    private contactService: ContactService,
    private historyService: HistoryService,
    private trackerService: TrackerService,
    private clipboardService: ClipboardService,
    private runtimeService: RuntimeService,
  ) {

    super();
  }

  /**
   * Clicked matching property button
   */
  onClickButtonMatchingProperty(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder
    if (this.isPlaceholder) {

      return;
    }

    this.contactService.matchingProperty(this.contact);
  }

  /**
   * Clicked history button
   */
  onClickButtonHistory(event: MouseEvent): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or a blacklisted contact or a confidential contact
    if (this.isPlaceholder || this.contact.isBlacklisted || this.contact.isConfidential) {

      return;
    }

    // New history enabled
    if (this.feature.history === true) {

      this.historyService.openModal(EntityEnum.contact, this.contact.id, this.contact.fullName);

      const userModel = new UserModel();
      userModel.account.contact.firstName = this.contact.fullName;

      // Stats
      this.trackerService.trackUser(TrackingActionEnum.contactRowHistory, userModel);
    }
  }

  /**
   * Clicked rank button
   */
  onClickButtonRank(event: MouseEvent, ranking: number): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens for a placeholder or no write permission or blacklisted contact or confidential contact
    if (
      this.isPlaceholder ||
      this.permissions.indexOf(PermissionEnum.contactWrite) === -1 ||
      this.contact.isBlacklisted ||
      this.contact.isConfidential
    ) {

      return;
    }

    this.contactService.changeRanking(this.contact, ranking);
  }

  /**
   * Clicked on confidential contact
   */
  onClickConfidential(reference: string): void {

    if (this.contact.isConfidential === false) {

      return;
    }

    // Copy to clipboard
    this.clipboardService.copy(reference);

    // Notification
    this.runtimeService.notification(NotificationTypeEnum.success, 'contact_reference_copied_to_clipboard');
  }

  /**
   * Clicked on search cell
   */
  onClickSearchCell(event: MouseEvent, contact: ContactModel): void {

    // Prevent propagation of click event
    event.stopPropagation();

    // Nothing happens if no ID available or it is a placeholder or is confidential
    if (!this.contact.id || this.isPlaceholder || contact.isConfidential) {

      return;
    }

    this.contactService.preview(
      this.contact.id, {
        x: event.clientX,
        y: event.clientY,
      },
      this.hash,
    );
  }

  /**
   * @inheritDoc
   */
  protected getModel(): ModelAbstract {

    return this.contact;
  }
}
