import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { MailboxApiService } from '../shared/mailbox-api.service';
import { MailboxStore } from '../shared/mailbox.store';
import { ImapSettingsModel } from '../shared/imap-settings.model';
import { ConfirmService } from '../../core/shared/confirm.service';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { MailboxListState } from '../shared/mailbox-list.state';
import { EmailResponseInterface } from '../../api/shared/mailbox/email-response.interface';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';

@Component({
  selector: 'app-email-page',
  templateUrl: './email-page.component.html',
  styleUrls: ['./email-page.component.scss'],
})
export class EmailPageComponent implements OnInit, OnDestroy {

  emailId: string;
  email: any; // TODO[later] A mix between EmailModel and EmailResponseInterface... what a mess :(
  emailThreads: any;
  emailData: any;
  emailListState: MailboxListState;
  contactConnected = [];
  showHide: boolean  = false;
  propertiesMap = {};
  promotionsMap = {};
  contactsMap = {};
  message_not_loaded: boolean  = false;
  message_loading: boolean  = false;

  /**
   * Is the component loading ?
   */
  isLoading: boolean = false;

  /**
   * IMAP settings
   */
  private imapSettings: ImapSettingsModel;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private mailboxApiService: MailboxApiService,
    private mailboxStore: MailboxStore,
    private router: Router,
    private route: ActivatedRoute,
    private confirmService: ConfirmService,
    private browserService: BrowserService,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.emailListState = new MailboxListState();

    // Updated IMAP settings
    this.subscriptions.push(
      this.mailboxStore.imapSettings$.subscribe(imapSettings => this.onNextImapSettings(imapSettings)),
    );

    // Updated email list state
    this.subscriptions.push(
      this.mailboxStore.emailListState$.subscribe(state => this.onNextEmailListState(state)),
    );

    // Updated route params
    this.subscriptions.push(
      this.route.params.subscribe(routeParams => this.onNextRouteParams(routeParams)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Clicked on the edit button
   */
  onClickEdit(): void {

    this.email.editMode = !this.email.editMode;
  }

  /**
   * Clicked on the reply button
   */
  onClickReply(): void {

    this
      .runtimeService
      .selectFeature()
      .pipe(take(1))
      .subscribe(feature => {

        // New emailing enabled
        if (feature.emailing === true) {

          return this.router.navigate(
            ['/emailing'],
            { queryParams: { in_reply_to: this.email.id, reply_mode: 'sender' } },
          );
        }

        // TODO[later]: update when implementing the rest of the feature on angular
        this.browserService.redirect('/emailing/emailCreation?in_reply_to=' + this.email.id + '&reply_mode=sender');
      });
  }

  /**
   * Clicked on the reply all button
   */
  onClickReplyAll(): void {

    this
      .runtimeService
      .selectFeature()
      .pipe(take(1))
      .subscribe(feature => {

        // New emailing enabled
        if (feature.emailing === true) {

          return this.router.navigate(
            ['/emailing'],
            { queryParams: { in_reply_to: this.email.id, reply_mode: 'all' } },
          );
        }

        // TODO[later]: update when implementing the rest of the feature on angular
        this.browserService.redirect('/emailing/emailCreation?in_reply_to=' + this.email.id + '&reply_mode=all');
      });
  }

  /**
   * Clicked on the mark as unread button
   */
  onClickMarkUnread(): void {

    this.isLoading = true;

    this.mailboxApiService
      .updateEmailUnseen([this.email.id])
      .subscribe(data => {

        if (!data.success) {

          // Failure notification
          this.runtimeService.notification(NotificationTypeEnum.failure, 'label_email_mark_as_unread_error');

          return;
        }

        // Success notification
        this.runtimeService.notification(NotificationTypeEnum.success, 'label_email_mark_as_unread');

        // Navigate to email list
        this.navigateToEmailList();
      });
  }

  /**
   * Clicked on a child email
   */
  onClickEmailChild(child): void {

    this.getEmailChild(child);
  }

  /**
   * Page changed
   */
  onChangePage(page: number): void {

    this.email.editMode = false;
    this.message_loading = false;

    const emailId = page ? this.emailData.next : this.emailData.prev;

    if (!emailId) {

      return;
    }

    // Update URL will re-use component
    this.router.navigate(['/mailbox/view', emailId]);
  }

  /**
   * Clicked on the unlink property button
   */
  onClickUnlinkProperty(e: MouseEvent, email: EmailResponseInterface, property: any): void {

    e.stopPropagation();

    const propertyId = property.ref ? property.ref : property.id;

    this.email.editMode = false;
    email.properties.splice(email.properties.indexOf(property), 1);

    this.propertiesMap[propertyId].forEach(emailId => {
      this.mailboxApiService
        .unlinkProperty(emailId, propertyId)
        .subscribe(() => this.loadAssets());
    });
  }

  /**
   * Clicked on the unlink contact button
   */
  onClickUnlinkContact(e: MouseEvent, email: EmailResponseInterface, contact: any): void {

    e.stopPropagation();

    this.email.contacts.splice(email.contacts.indexOf(contact), 1);

    email.contacts = email.contacts.filter(o => {

      if (o.from_imap === '0') {

        return o.contact_id !== contact.contact_id;
      }

      return o;
    });

    this.email.editMode = false;
    this.contactsMap[contact.contact_id].forEach(emailId => {
      this.mailboxApiService
        .unlinkContact(emailId, contact.contact_id)
        .subscribe(() => this.loadAssets());
    });

    const parent = (<HTMLElement>e.target).closest('.row').querySelector('.categories-output');

    if (parent) {

      parent.classList.remove('hide');
    }
  }

  /**
   * Clicked on the unlink promotion button
   */
  onClickUnlinkPromotion(e: MouseEvent, email: EmailResponseInterface, promotion: any): void {

    e.stopPropagation();

    this.email.editMode = false;
    const promotionId = promotion.data ? promotion.data : promotion.id;

    this.email.promotions.splice(email.promotions.indexOf(promotion), 1);

    this.promotionsMap[promotionId].forEach(emailId => {
      this.mailboxApiService
        .unlinkPromotion(emailId, promotionId)
        .subscribe(() => this.loadAssets()); // TODO[later] Are we sure this should be in a loop ? Seems off
    });

    // TODO[later] Remove this crap!
    const parent = (<HTMLElement>e.target).closest('.row').querySelector('.categories-output');

    if (parent) {

      parent.classList.remove('hide');
    }
  }

  /**
   * Linked the email to a property, contact or promotion
   */
  onLink(): void {

    this.loadAssets();
  }

  /**
   * Clicked on the delete button
   */
  onClickDelete(): void {

    const text = (this.contactConnected.length > 0 || this.email.properties.length > 0 || this.email.promotions.length > 0) ?
      'label_delete_email_connected_warning' :
      'label_delete_email_warning';

    // Confirm modal
    this
      .confirmService
      .message(text)
      .subscribe(isValid => {

        if (isValid === false) {

          return;
        }

        this.deleteEmail();
      });
  }

  /**
   * Clicked the back button
   */
  onClickBack(): void {

    this.navigateToEmailList();
  }

  /**
   * Load email
   */
  private loadEmail(): void {

    this.isLoading = true;

    this.mailboxApiService
      .loadEmailThreaded(this.emailId, this.imapSettings.id)
      .subscribe(response => {

        if (!response || this.isEmptyObject(response)) {

          this.isLoading = false;
          this.message_not_loaded = true;

          return;
        }

        this.isLoading = false;
        this.emailThreads = response.threads;
        this.email = this.emailThreads[0];
        this.emailData = response;

        this.getEmailChild(this.email, true);
      });
  }

  private getEmailChild(child, first?): void {
    child.showHide = !child.showHide;
    let firstLoad = false;
    if (first) {
      firstLoad = true;
      child.showHide = true;
    } else {
      if (!this.message_not_loaded) {
        this.emailThreads.forEach(thread => {
          if (thread.id === child.id && !thread.text) {
            firstLoad = true;
          }
        });
      }
    }

    if (!firstLoad) {
      return;
    }

    child.isLoading = true;
    this.message_loading = true;
    this.mailboxApiService.loadEmail(child.id, this.email.folder_id).subscribe(response => {
      if (!response || this.isEmptyObject(response)) {
        child.isLoading = false;
        this.message_not_loaded = true;
        return;
      }
      this.message_loading = false;
      child.isLoading = false;
      if (first) {
        const lastElement = this.emailThreads.length - 1;
        this.email = child;
        if (lastElement > 3) {
          // TODO[later] use browser service to manipulate document
          document.getElementById(lastElement.toString()).scrollIntoView();
        }
      }
      if (!this.email.properties) {
        this.email.properties = [];
      }
      if (!this.email.promotions) {
        this.email.promotions = [];
      }
      this.emailThreads.forEach((item, i) => {
        if (response.id === item.id) {
          item.showHide = true;
          item.mark_seen = response.mark_seen;
          item.text = response.text;
          item.contacts = response.contacts;
          item.attachments_list = response.attachments_list;
        }
        if (response.mark_seen) {
          this.mailboxApiService.updateEmailSeen(response.id).subscribe();
        }
        return item;
      });
      this.setModalState();
      this.getConnectedContacts();
      this.getRecipentTypes();
      this.setConnectedAssets();
      this.createConnectedAssetsIdMap();
    });
  }

  private isEmptyObject(obj): boolean {
    return (obj && (Object.keys(obj).length === 0));
  }

  private setConnectedAssets(): void {
    this.emailThreads.forEach(email => {
      if (email.properties && email.properties.length > 0) {
        email.properties.map(obj => {
          const found = this.email.properties.some(el => {
            return el.id === obj.id;
          });
          if (!found) {
            this.email.properties.push(obj);
          }
        });
      }
      if (email.promotions && email.promotions.length > 0) {
        email.promotions.map(obj => {
          const found = this.email.promotions.some(el => {
            return el.id === obj.id;
          });
          if (!found) {
            this.email.promotions.push(obj);
          }
        });
      }
      if (email.contacts && email.contacts.length > 0) {
        email.contacts.map(obj => {
          const found = this.contactConnected.some(el => {
            return el.id === obj.id;
          });
          if (!found && obj.from_imap !== '1') {
            this.contactConnected.push(obj);
          }
        });
      }

    });
  }

  private createConnectedAssetsIdMap(): void {
    this.emailThreads.forEach(email => {
      if (this.email.properties && this.email.properties.length > 0) {
        this.email.properties.map(prop => {
          const id = prop.id ? prop.id : prop.ref;
          if (!this.propertiesMap[id]) {
            this.propertiesMap[id] = [];
          }
          if (this.propertiesMap[id].indexOf(email.id) < 0) {
            this.propertiesMap[id].push(email.id);
          }
        });
      } else {
        this.propertiesMap = {};
      }
      if (this.email.promotions && this.email.promotions.length > 0) {
        this.email.promotions.map(prop => {
          const id = prop.id ? prop.id : prop.data;
          if (!this.promotionsMap[id]) {
            this.promotionsMap[id] = [];
          }
          if (this.promotionsMap[id].indexOf(email.id) < 0) {
            this.promotionsMap[id].push(email.id);
          }
        });
      } else {
        this.promotionsMap = {};
      }
      if (this.contactConnected && this.contactConnected.length > 0) {
        this.contactConnected.map(prop => {
          if (!this.contactsMap[prop.contact_id]) {
            this.contactsMap[prop.contact_id] = [];
          }
          if (this.contactsMap[prop.contact_id].indexOf(email.id) < 0) {
            this.contactsMap[prop.contact_id].push(email.id);
          }
        });
      } else {
        this.contactsMap = {};
      }
    });
  }

  private getRecipentTypes(): void {
    if (this.emailThreads) {
      this.emailThreads.forEach((data) => {
        if (data.contacts && data.contacts.length > 0) {
          data.to = [];
          data.cc = [];
          data.bcc = [];
          data.contacts.map(contact => {
            if (contact.from_imap === 1) {
              if (contact.recipient_type === 'to') {
                data.to.push(contact);
              }
              if (contact.recipient_type === 'cc') {
                data.cc.push(contact);
              }
              if (contact.recipient_type === 'bcc') {
                data.bcc.push(contact);
              }
            }
          });
        }
      });
    }

    if (this.email && this.email.contacts && this.email.contacts.length > 0) {
      this.email.to = [];
      this.email.cc = [];
      this.email.bcc = [];
      this.email.contacts.map(contact => {
        if (contact.from_imap === 1) {
          if (contact.recipient_type === 'to') {
            this.email.to.push(contact);
          }
          if (contact.recipient_type === 'cc') {
            this.email.cc.push(contact);
          }
          if (contact.recipient_type === 'bcc') {
            this.email.bcc.push(contact);
          }
        }
      });
    }
  }

  private setModalState(): void {
    if (!this.email.properties || this.email.properties.length <= 0) {
      this.email.modalState = 'properties';
    } else if (!this.email.promotions || this.email.promotions.length <= 0) {
      this.email.modalState = 'promotions';
    } else {
      this.email.modalState = 'contacts';
    }
  }

  private getConnectedContacts(): void {
    if (this.email.contacts && this.email.contacts.length > 0) {
      this.contactConnected = [];
      this.email.contacts.map(contact => {
        if (contact.from_imap !== '1') {
          this.contactConnected.push(contact);
        }
      });
    }
  }

  private loadAssets(): void {

    this.getConnectedContacts();
    this.setConnectedAssets();
    this.createConnectedAssetsIdMap();
  }

  /**
   * Delete current email
   */
  private deleteEmail(): void {

    this.isLoading = true;

    this.mailboxApiService
      .deleteEmail([this.emailId])
      .subscribe(response => {

        if (!response.success) {

          // Failure notification
          this.runtimeService.notification(NotificationTypeEnum.failure, 'label_email_deleted_error');

          return;
        }

        // Success notification
        this.runtimeService.notification(NotificationTypeEnum.success, 'label_email_deleted');

        // Navigate to email list
        this.navigateToEmailList();
      });
  }

  /**
   * Navigate to the email list
   */
  private navigateToEmailList(): void {

    this.router.navigate(['/mailbox/inbox', this.emailListState.page], {
      queryParams: {
        q: this.emailListState.searchQuery || null,
        folder: this.emailListState.folderId || null,
      },
    });
  }

  /**
   * Next IMAP settings
   */
  private onNextImapSettings(imapSettings: ImapSettingsModel): void {

    // Keep IMAP settings
    this.imapSettings = imapSettings;
  }

  /**
   * Next email list state
   */
  private onNextEmailListState(state: MailboxListState): void {

    // Keep email list state
    this.emailListState = state;
  }

  /**
   * Next route params
   */
  private onNextRouteParams(routeParams: Params): void {

    // Keep email ID
    this.emailId = routeParams.id;

    // Load email
    this.loadEmail();
  }
}
