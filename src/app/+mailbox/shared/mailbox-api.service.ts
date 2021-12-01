import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../api/http/phalcon-http.service';
import { ApiEndpointEnum } from '../../shared/enum/api-endpoint.enum';
import { ImapSettingsModel } from './imap-settings.model';
import { FolderModel } from './folder.model';
import { MailboxModel } from './mailbox.model';
import { MailboxListModel } from './mailbox-list.model';
import { SettingsImapLoadResponseInterface } from '../../api/shared/mailbox/settings-imap-load-response.interface';
import { FolderResponseInterface } from '../../api/shared/mailbox/folder-response.interface';
import { EmailResponseInterface } from '../../api/shared/mailbox/email-response.interface';
import { EmailListResponseInterface } from '../../api/shared/mailbox/email-list-response.interface';
import { MailboxConfig } from '../mailbox.config';
import { EmailListRequestInterface } from '../../api/shared/mailbox/email-list-request.interface';
import { EmailLoadRequestInterface } from '../../api/shared/mailbox/email-load-request.interface';
import { EmailLoadResponseInterface } from '../../api/shared/mailbox/email-load-response.interface';
import { PropertySearchRequestInterface } from '../../api/shared/mailbox/property-search-request.interface';
import { PropertySearchResponseInterface } from '../../api/shared/mailbox/property-search-response.interface';
import { ContactSearchRequestInterface } from '../../api/shared/mailbox/contact-search-request.interface';
import { ContactSearchResponseInterface } from '../../api/shared/mailbox/contact-search-response.interface';
import { PropertyLinkRequestInterface } from '../../api/shared/mailbox/property-link-request.interface';
import { PropertyLinkResponseInterface } from '../../api/shared/mailbox/property-link-response.interface';
import { PropertyUnlinkRequestInterface } from '../../api/shared/mailbox/property-unlink-request.interface';
import { PropertyUnlinkResponseInterface } from '../../api/shared/mailbox/property-unlink-response.interface';
import { PromotionLinkRequestInterface } from '../../api/shared/mailbox/promotion-link-request.interface';
import { PromotionLinkResponseInterface } from '../../api/shared/mailbox/promotion-link-response.interface';
import { PromotionUnlinkRequestInterface } from '../../api/shared/mailbox/promotion-unlink-request.interface';
import { PromotionUnlinkResponseInterface } from '../../api/shared/mailbox/promotion-unlink-response.interface';
import { ContactLinkRequestInterface } from '../../api/shared/mailbox/contact-link-request.interface';
import { ContactLinkResponseInterface } from '../../api/shared/mailbox/contact-link-response.interface';
import { ContactUnlinkRequestInterface } from '../../api/shared/mailbox/contact-unlink-request.interface';
import { ContactUnlinkResponseInterface } from '../../api/shared/mailbox/contact-unlink-response.interface';
import { SettingsImapSaveRequestInterface } from '../../api/shared/mailbox/settings-imap-save-request.interface';
import { SettingsImapSaveResponseInterface } from '../../api/shared/mailbox/settings-imap-save-response.interface';
import { SettingsDomainLoadRequestInterface } from '../../api/shared/mailbox/settings-domain-load-request.interface';
import { SettingsDomainLoadResponseInterface } from '../../api/shared/mailbox/settings-domain-load-response.interface';
import { SyncEmailsResponseInterface } from '../../api/shared/mailbox/sync-emails-response.interface';
import { EmailSeenResponseInterface } from '../../api/shared/mailbox/email-seen-response.interface';
import { EmailThreadedRequestInterface } from '../../api/shared/mailbox/email-threaded-request.interface';
import { EmailThreadedResponseInterface } from '../../api/shared/mailbox/email-threaded-response.interface';
import { EmailUnseenRequestInterface } from '../../api/shared/mailbox/email-unseen-request.interface';
import { EmailUnseenResponseInterface } from '../../api/shared/mailbox/email-unseen-response.interface';
import { EmailDeleteRequestInterface } from '../../api/shared/mailbox/email-delete-request.interface';
import { EmailDeleteResponseInterface } from '../../api/shared/mailbox/email-delete-response.interface';
import { PromotionSearchResponseInterface } from '../../api/shared/mailbox/promotion-search-response.interface';
import { PromotionSearchRequestInterface } from '../../api/shared/mailbox/promotion-search-request.interface';

@Injectable()
export class MailboxApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private mailboxConfig: MailboxConfig,
  ) {

  }

  /**
   * Load email list
   */
  loadEmailList(imapId: string, folderId: string, page: number, query: string): Observable<MailboxListModel> {

    const request: EmailListRequestInterface = {
      contact_imap_id: imapId,
      page: String(page),
      q: encodeURIComponent(query),
      threaded: this.mailboxConfig.emailAsThread ? '1' : '0',
      folder_id: folderId,
    };

    return this
      .httpService
      .get<EmailListRequestInterface, EmailListResponseInterface>(ApiEndpointEnum.mailboxEmailList, request)
      .pipe(
        map(response => this.convertToEmailListModel(response)),
      );
  }

  /**
   * Load an email
   */
  loadEmail(id: string, folderId: string): Observable<EmailLoadResponseInterface> {

    const request: EmailLoadRequestInterface = {
      imap_message_id: id,
      folder_id: folderId,
    };

    return this.httpService.get<EmailLoadRequestInterface, EmailLoadResponseInterface>(ApiEndpointEnum.mailboxEmailLoad, request);
  }

  /**
   * Load properties // TODO[later] To be moved in PropertyService
   */
  loadProperties(keyword: string): Observable<PropertySearchResponseInterface> {

    if (!keyword) {

      return of([]);
    }

    const request: PropertySearchRequestInterface = {
      q: keyword,
    };

    return this
      .httpService
      .get<PropertySearchRequestInterface, PropertySearchResponseInterface>(
        ApiEndpointEnum.mailboxPropertySearch,
        request,
      );
  }

  /**
   * Load promotions // TODO[later] To be moved in PromotionService
   */
  loadPromotions(keyword: string): Observable<PromotionSearchResponseInterface> {

    if (!keyword) {

      return of({
        query: '',
        suggestions: [],
      });
    }

    const request: PromotionSearchRequestInterface = {
      q: keyword,
    };

    return this
      .httpService
      .get<PromotionSearchRequestInterface, PromotionSearchResponseInterface>(
        ApiEndpointEnum.mailboxPromotionSearch,
        request,
      );
  }

  /**
   * Load contacts // TODO[later] To be moved in ContactService
   */
  loadContacts(keyword: string): Observable<ContactSearchResponseInterface> {

    if (!keyword) {

      return of([]);
    }

    const request: ContactSearchRequestInterface = {
      q: keyword,
    };

    return this
      .httpService
      .get<ContactSearchRequestInterface, ContactSearchResponseInterface>(
        ApiEndpointEnum.mailboxContactSearch,
        request,
      );
  }

  /**
   * Link an email to a property
   */
  linkProperty(emailId: string, propertyId: string): Observable<PropertyLinkResponseInterface> {

    const request: PropertyLinkRequestInterface = {
      id: emailId,
      properties: [propertyId],
    };

    return this
      .httpService
      .post<PropertyLinkRequestInterface, PropertyLinkResponseInterface>(
        ApiEndpointEnum.mailboxPropertyLink,
        request,
      );
  }

  /**
   * Unlink an email from a property
   */
  unlinkProperty(emailId: string, propertyId: string): Observable<PropertyUnlinkResponseInterface> {

    const request: PropertyUnlinkRequestInterface = {
      id: emailId,
      property_id: propertyId,
    };

    return this
      .httpService
      .post<PropertyUnlinkRequestInterface, PropertyUnlinkResponseInterface>(
        ApiEndpointEnum.mailboxPropertyUnlink,
        request,
      );
  }

  /**
   * Link an email to a promotion
   */
  linkPromotion(emailId: string, promotionId: string): Observable<PromotionLinkResponseInterface> {

    const request: PromotionLinkRequestInterface = {
      id: emailId,
      promotions: [promotionId],
    };

    return this
      .httpService
      .post<PromotionLinkRequestInterface, PromotionLinkResponseInterface>(
        ApiEndpointEnum.mailboxPromotionLink,
        request,
      );
  }

  /**
   * Unlink an email from a promotion
   */
  unlinkPromotion(emailId: string, promotionId: string): Observable<PromotionUnlinkResponseInterface> {

    const request: PromotionUnlinkRequestInterface = {
      id: emailId,
      promotion_id: promotionId,
    };

    return this
      .httpService
      .post<PromotionUnlinkRequestInterface, PromotionUnlinkResponseInterface>(
        ApiEndpointEnum.mailboxPromotionUnlink,
        request,
      );
  }

  /**
   * Link an email to a contact
   */
  linkContact(emailId: string, contactId: string): Observable<ContactLinkResponseInterface> {

    const request: ContactLinkRequestInterface = {
      id: emailId,
      contacts: [contactId],
    };

    return this
      .httpService
      .post<ContactLinkRequestInterface, ContactLinkResponseInterface>(
        ApiEndpointEnum.mailboxContactLink,
        request,
      );
  }

  /**
   * Unlink an email from a contact
   */
  unlinkContact(emailId: string, contactId: string): Observable<ContactUnlinkResponseInterface> {

    const request: ContactUnlinkRequestInterface = {
      id: emailId,
      contact_id: contactId,
    };

    return this
      .httpService
      .post<ContactUnlinkRequestInterface, ContactUnlinkResponseInterface>(
        ApiEndpointEnum.mailboxContactUnlink,
        request,
      );
  }

  /**
   * Save IMAP settings
   */
  saveImapSettings(request: SettingsImapSaveRequestInterface): Observable<SettingsImapSaveResponseInterface> {

    return this
      .httpService
      .post<SettingsImapSaveRequestInterface, SettingsImapSaveResponseInterface>(
        ApiEndpointEnum.mailboxSettingsSave,
        request,
        null,
        true,
      );
  }

  /**
   * Load IMAP settings
   */
  loadImapSettings(): Observable<ImapSettingsModel> {

    return this
      .httpService
      .get<null, SettingsImapLoadResponseInterface>(ApiEndpointEnum.mailboxSettings)
      .pipe(
        map(response => this.convertToImapSettingsModel(response)),
      );
  }

  /**
   * Load domain settings
   */
  loadDomainSettings(email: string): Observable<SettingsDomainLoadResponseInterface> {

    const request: SettingsDomainLoadRequestInterface = {
      email: email,
    };

    return this
      .httpService
      .get<SettingsDomainLoadRequestInterface, SettingsDomainLoadResponseInterface>(
        ApiEndpointEnum.mailboxSettingsDomainLoad,
        request,
      );
  }

  /**
   * Sync emails
   */
  syncEmails(): Observable<SyncEmailsResponseInterface> {

    return this.httpService.get<null, SyncEmailsResponseInterface>(ApiEndpointEnum.mailboxSync);
  }

  /**
   * Load threaded emails
   */
  loadEmailThreaded(emailId: string, imapId: string): Observable<EmailThreadedResponseInterface> {

    const request: EmailThreadedRequestInterface = {
      contact_imap_id: imapId,
      imap_id: emailId,
    };

    return this
      .httpService
      .get<EmailThreadedRequestInterface, EmailThreadedResponseInterface>(
        ApiEndpointEnum.mailboxEmailThreaded,
        request,
      );
  }

  /**
   * Update email as seen
   */
  updateEmailSeen(emailId: string): Observable<EmailSeenResponseInterface> {

    return this
      .httpService
      .post<null, EmailSeenResponseInterface>(
        ApiEndpointEnum.mailboxEmailSeen,
        null,
        { id: emailId },
      );
  }

  /**
   * Update emails as unseen
   */
  updateEmailUnseen(emailIds: string[]): Observable<EmailUnseenResponseInterface> {

    const request: EmailUnseenRequestInterface = {
      'message_id[]': emailIds,
    };

    return this.httpService.get<EmailUnseenRequestInterface, EmailUnseenResponseInterface>(ApiEndpointEnum.mailboxEmailUnseen, request);
  }

  /**
   * Delete emails
   */
  deleteEmail(emailIds: string[]): Observable<EmailDeleteResponseInterface> {

    const request: EmailDeleteRequestInterface = {
      'message_id[]': emailIds,
    };

    return this.httpService.get<EmailDeleteRequestInterface, EmailDeleteResponseInterface>(ApiEndpointEnum.mailboxEmailDelete, request);
  }

  /**
   * Convert response to a IMAP settings model
   */
  private convertToImapSettingsModel(response: SettingsImapLoadResponseInterface): ImapSettingsModel {

    const imapSettings = new ImapSettingsModel();

    if (response.data) {

      imapSettings.id = response.data.id;
      imapSettings.server_name = response.data.server_name;
      imapSettings.server_port = response.data.server_port;
      imapSettings.login = response.data.login;
      imapSettings.contact_id = response.data.contact_id;
      imapSettings.no_ssl = response.data.no_ssl;
      imapSettings.from_cache = response.data.from_cache;
      imapSettings.novalidate_cert = response.data.novalidate_cert;
      imapSettings.folder_name = response.data.folder_name;
      imapSettings.folder_id = response.data.folder_id;
      imapSettings.folders = response.data.folders.map(data => this.convertToFolderModel(data));
    }

    imapSettings.isValid = response.success;
    imapSettings.errorMessage = response.msg || '';

    return imapSettings;
  }

  /**
   * Convert response to a folder model
   */
  private convertToFolderModel(response: FolderResponseInterface): FolderModel {

    const folder = new FolderModel();

    folder.id = String(response.id);
    folder.name = String(response.name).replace('\/', '/');
    folder.type = String(response.type);
    folder.type_id = String(response.type_id);
    folder.unseen = response.unseen ? parseInt(String(response.unseen), 10) : 0;

    return folder;
  }

  /**
   * Convert response to an email list model
   */
  private convertToEmailListModel(response: EmailListResponseInterface): MailboxListModel {

    const emailList = new MailboxListModel();

    emailList.totalCount = parseInt(response.recordsTotal, 10);
    emailList.filteredCount = parseInt(response.recordsFiltered, 10);
    emailList.unreadCount = parseInt(response.count_unseen, 10);
    emailList.perPageCount = response.per_page;
    emailList.totalPageCount = Math.ceil(emailList.totalCount / emailList.perPageCount);
    emailList.folders = response.folders.map(data => this.convertToFolderModel(data));
    emailList.emails = response.data.map(data => this.convertToEmailModel(data));

    return emailList;
  }

  /**
   * Convert response to a email model
   */
  private convertToEmailModel(response: EmailResponseInterface): MailboxModel {

    const email = new MailboxModel();

    email.id = response.id;
    email.folderId = response.folder_id;
    email.folderType = response.folder_type;
    email.sender = response.sender;
    email.subject = response.subject;
    email.timestamp = parseInt(response.date, 10);
    email.isRead = response.seen;
    email.isDeleted = response.deleted === '1';
    email.children = response.children; // TODO[later] most likely need to cast into array of models
    email.contacts = response.contacts; // TODO[later] most likely need to cast into array of models
    email.properties = response.properties; // TODO[later] most likely need to cast into array of models
    email.promotions = response.promotions; // TODO[later] most likely need to cast into array of models

    return email;
  }
}
