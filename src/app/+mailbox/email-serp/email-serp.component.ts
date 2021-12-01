import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';

import { MailboxApiService } from '../shared/mailbox-api.service';
import { MailboxStore } from '../shared/mailbox.store';
import { ImapSettingsModel } from '../shared/imap-settings.model';
import { HelperService } from '../../core/shared/helper.service';
import { MailboxConfig } from '../mailbox.config';
import { FolderModel } from '../shared/folder.model';
import { MailboxListModel } from '../shared/mailbox-list.model';
import { MailboxModel } from '../shared/mailbox.model';
import { BrowserService } from '../../core/shared/browser/browser.service';
import { ConfirmService } from '../../core/shared/confirm.service';
import { MailboxListState } from '../shared/mailbox-list.state';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';

@Component({
  selector: 'app-email-serp',
  templateUrl: './email-serp.component.html',
  styleUrls: ['./email-serp.component.scss'],
})
export class EmailSerpComponent implements OnInit, OnDestroy {

  emailList: MailboxListModel;
  state: MailboxListState;
  isLoadingSync: boolean = false;
  isLoadingUnread: boolean = false;
  isLoadingDelete: boolean = false;
  syncInterval: number;
  syncData: any;
  folders: { [name: string]: FolderModel; };
  emailIdSelected: string[] = [];
  emailSelected: MailboxModel[] = [];

  /**
   * Is the component loading ?
   */
  isLoading: boolean;

  /**
   * Is the user editing an email ?
   */
  private isEditing: boolean;

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
    private helperService: HelperService,
    private mailboxConfig: MailboxConfig,
    private browserService: BrowserService,
    private confirmService: ConfirmService,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.isLoading = true;
    this.isEditing = false;
    this.emailList = new MailboxListModel();
    this.state = new MailboxListState();

    // Updated route params
    this.subscriptions.push(
      combineLatest<Observable<Params>, Observable<Params>>([
        this.route.params,
        this.route.queryParams,
      ])
      .subscribe(values => this.onNextRoute(values[0], values[1])),
    );

    // Updated IMAP settings
    this.subscriptions.push(
      this.mailboxStore.imapSettings$.subscribe(imapSettings => this.onNextImapSettings(imapSettings)),
    );

    // Updated email list state
    this.subscriptions.push(
      this.mailboxStore.emailListState$.subscribe(state => this.onNextEmailListState(state)),
    );

    // Activate periodical sync (have to use window to prevent typing error)
    this.sync();
    this.syncInterval = this.browserService.getWindow().setInterval(() => this.sync(), this.mailboxConfig.syncInterval);
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Clear sync interval
    clearInterval(this.syncInterval);

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Clicked a checkbox
   */
  onClickCheckbox(e: MouseEvent): void {

    e.stopPropagation();
  }

  /**
   * Selected an email
   */
  onSelect(email: MailboxModel): void {

    const index = this.emailIdSelected.indexOf(email.id);

    if (index < 0) {

      this.emailIdSelected.push(email.id);
      this.emailSelected.push(email);

    } else {

      this.emailIdSelected.splice(index, 1);
      this.emailSelected.splice(index, 1);
    }
  }

  /**
   * Clicked on the unlink property button
   */
  onClickUnlinkProperty(e: MouseEvent, email: MailboxModel, property: any): void {

    e.stopPropagation();

    email.editMode = false;
    email.properties.splice(email.properties.indexOf(property), 1);

    this.mailboxApiService
      .unlinkProperty(email.id, property.ref ? property.ref : property.id)
      .subscribe();
  }

  /**
   * Clicked on the unlink contact button
   */
  onClickUnlinkContact(e: MouseEvent, email: MailboxModel, contact: any): void {

    e.stopPropagation();

    email.contacts.splice(email.contacts.indexOf(contact), 1);
    email.editMode = false;

    this.mailboxApiService
      .unlinkContact(email.id, contact.contact_id)
      .subscribe(data => this.getContactsConnected());
  }

  /**
   * Clicked on the unlink promotion button
   */
  onClickUnlinkPromotion(e: MouseEvent, email: MailboxModel, promotion: any): void {

    e.stopPropagation();

    email.editMode = false;
    email.promotions.splice(email.promotions.indexOf(promotion), 1);

    const promotions = [];

    promotions.map(prop => {
      promotions.push(prop.data ? prop.data : prop.id);
    });

    this.mailboxApiService
      .unlinkPromotion(email.id, promotion.data ? promotion.data : promotion.id)
      .subscribe();
  }

  /**
   * Clicked on the mark as unread button
   */
  onClickMarkUnread(): void {

    this.isLoadingUnread = true;

    this.mailboxApiService.updateEmailUnseen(this.emailIdSelected).subscribe(data => {

      this.isLoadingUnread = false;
      this.emailIdSelected = [];

      if (!data.success) {

        // Failure notification
        this.runtimeService.notification(NotificationTypeEnum.failure, 'label_email_mark_as_unread_error');

        return;
      }

      // Success notification
      this.runtimeService.notification(NotificationTypeEnum.success, 'label_email_mark_as_unread');

      // Reload email list
      this.loadEmailList();
    });
  }

  /**
   * Clicked on the delete button
   */
  onClickDelete(): void {

    let text = 'label_delete_emails_warning';

    this
      .emailSelected
      .some(email => {

        if (email.contactsConnected.length > 0 || email.properties.length > 0 || email.promotions.length > 0) {

          text = 'label_delete_emails_connected_warning';

          return true;
        }
      });

    if (!text) {

      return;
    }

    // Confirm modal
    this
      .confirmService
      .message(text)
      .subscribe(isValid => {

        if (isValid === false) {
          return;
        }

        this.deleteEmailSelected();
      });
  }

  /**
   * Mouse entered an email row
   */
  onMouseOver(email: MailboxModel): void {

    email.connectMode = true;

    // Active connect mode only to selected email
    this.emailList.emails.forEach(obj => obj.connectMode = obj.id === email.id || obj.editMode);
  }

  /**
   * Mouse left an email row
   */
  onMouseLeave(email: MailboxModel): void {

    if (!email.editMode) {

      email.connectMode = false;
    }
  }

  /**
   * Clicked the link button
   */
  onClickLink(e: MouseEvent, email: MailboxModel): void {

    e.stopPropagation();

    this.isEditing = true;

    email.modalState = 'properties';
    email.editMode = !email.editMode;
  }

  /**
   * Clicked the sync button
   */
  onClickSync(): void {

    this.sync();
  }

  /**
   * Clicked on the settings button
   */
  onClickSettings(): void {

    this.router.navigate(['/mailbox/imap-settings']);
  }

  /**
   * Clicked an email
   */
  onClickEmail(email: MailboxModel): void {

    if (email.editMode || email.isDeleted) {

      return;
    }

    if (!email.isRead) {

      this.setMenuCount(this.emailList.unreadCount - 1);
    }

    // Redirect to email page
    this.router.navigate(['/mailbox/view', email.id]);
  }

  /**
   * Clicked a folder
   */
  onClickFolder(folderId: string): void {

    // Update email list state
    const state = this.state.clone();
    state.page = 1;
    state.searchQuery = '';
    state.folderId = folderId;

    // Update URL will re-use component
    this.router.navigate(['/mailbox/inbox', state.page]);

    this.mailboxStore.setEmailListState(state);
  }

  /**
   * Searched submitted
   */
  onSearch(query: string): void {

    // Update URL will re-use component
    this.router.navigate(['/mailbox/inbox', this.state.page], {
      queryParams: {
        q: query || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Page changed
   */
  onChangePage(page: number): void {

    // Update URL will re-use component
    this.router.navigate(['/mailbox/inbox', page], {
      queryParamsHandling: 'preserve',
    });
  }

  /**
   * Load email list
   */
  private loadEmailList(): void {

    this.mailboxApiService
      .loadEmailList(this.imapSettings.id, this.state.folderId, this.state.page, this.state.searchQuery)
      .subscribe(emailList => {

        this.isLoading = false;
        this.emailList = emailList;

        // Update folders
        this.updateFolders(emailList.folders);

        this.getContactsConnected();
        this.setMenuCount(emailList.unreadCount);
      });
  }

  /**
   * Sync emails with mail server then load email list if sync successful
   */
  private sync(): void {

    // Syncing or editing
    if (this.isLoadingSync || this.isEditing) {

      return;
    }

    this.isLoadingSync = true;

    this.mailboxApiService
      .syncEmails()
      .subscribe(data => {

        this.isLoadingSync = false;

        this.syncData = data;
        this.syncData.time = this.syncData.time.toFixed();

        if (this.syncData.success) {

          // Load emails
          this.loadEmailList();
        }
      });
  }

  /**
   * Delete selected emails
   */
  private deleteEmailSelected(): void {

    this.isLoadingDelete = true;

    this.mailboxApiService
      .deleteEmail(this.emailIdSelected).subscribe(data => {

      this.isLoadingDelete = false;
      this.emailIdSelected = [];

      if (!data.success) {

        // Failure notification
        this.runtimeService.notification(NotificationTypeEnum.failure, 'label_email_deleted_error');

        return;
      }

      // Success notification
      this.runtimeService.notification(NotificationTypeEnum.success, 'label_email_deleted');

      // Reload email list
      this.loadEmailList();
    });
  }

  /**
   * Updates folders if folders added/removed/modified on server
   */
  private updateFolders(folders: FolderModel[]): void {

    // Folder list changed
    if (this.imapSettings.folders.length !== folders.length || this.imapSettings.folders.some((folder, i) => folder.id !== folders[i].id)) {

      // Update IMAP settings
      const imapSettings = this.imapSettings.clone();
      imapSettings.folders = folders.map(folder => folder.clone());

      this.mailboxStore.setImapSettings(imapSettings);
    }

    folders.forEach(item => {

      if (item.name.indexOf('[Gmail]') >= 0) {

        item.name = item.name.split('/')[1];
      }

      if (item.name.toUpperCase() === 'ALL MAIL') {

        item.id = '';
      }
    });

    // We don't have the "All mail" folder yet
    if (folders.every(folder => folder.id !== '')) {

      const folder = new FolderModel();
      folder.id = '';
      folder.name = 'All Mail';

      folders.push(folder);
    }

    folders = folders.sort((a, b) => {

      if (a.name.toUpperCase() === 'INBOX') {

        return -1;

      } else if (b.name.toUpperCase() === 'INBOX') {

        return 1;
      }

      return a.name.localeCompare(b.name);
    });

    this.createFolderHierarchy(folders);
  }

  /**
   * Creates folders and sub folders hierarchy
   */
  private createFolderHierarchy(arr: FolderModel[]): void {

    const flatFoldersData = {};
    const foldersTree = {};
    const folderNames = [];

    arr.forEach(folder => {

      folderNames.push(folder.name);
      let hierarchy = folder.name.split('/');

      // Fix for "/" in name
      const folderPath = [];
      const folderName = [];

      // For each chunk of folder name
      hierarchy.forEach(chunk => {

        // Copy current folder path and add chunk
        const path = folderPath.slice(0);
        path.push(chunk);

        // Parent folder including chunk exists ? Add chunk to folder path ELSE add chunk to folder name
        flatFoldersData[path.join('/')] ? folderPath.push(chunk) : folderName.push(chunk);
      });

      // Generate updated hierarchy with folder name including "/"
      folderPath.push(folderName.join('/'));
      hierarchy = folderPath;

      let parent = foldersTree;
      if (folderNames.indexOf(hierarchy[0]) < 0) {
        hierarchy = [folder.name];
      }
      hierarchy.forEach(level => {
        if (!parent[level]) {
          parent[level] = new FolderModel();
        }
        parent = parent[level];
      });

      // Keep folder in memory
      flatFoldersData[folder.name] = folder;
    });

    this.addValues(foldersTree, flatFoldersData, '');
    this.setChildrenNameToCamelCase(foldersTree);
    this.folders = foldersTree;
  }

  /**
   * Recursive function to set all folders and sub folders name to camel case
   */
  private setChildrenNameToCamelCase(foldersTree: Object): void {

    Object.keys(foldersTree).forEach(key => {

      if (foldersTree[key] && foldersTree[key].name) {
        foldersTree[key].name = this.helperService.toCamelCase(foldersTree[key].name);
      }
      const obj = foldersTree[key];

      Object.keys(obj).forEach(child => {

        if (child && typeof obj[child] === 'object') {

          this.setChildrenNameToCamelCase(obj);
        }
      });
    });
  }

  /**
   * Adds folder model values as per the level of folder
   */
  private addValues(relations: Object, data: Object, indent: string): void {

    Object.keys(relations).forEach(key => {

      if (!key || ['id', 'name', 'type', 'type_id', 'unseen'].indexOf(key) > -1) {

        return;
      }

      relations[key].id = data[indent + key].id;
      relations[key].name = key;
      relations[key].type = data[indent + key].type;
      relations[key].type_id = data[indent + key].type_id;
      relations[key].unseen = data[indent + key].unseen;

      this.addValues(relations[key], data, indent + key + '/');
    });
  }

  /**
   * Set bubble count on menu
   */
  private setMenuCount(count: number): void {
    const tags = document.getElementsByClassName('mail_inbox_count');
    for (let i = 0; i < tags.length; i++) {
      count > 0 ? tags[i].classList.remove('hidden') : tags[i].classList.add('hidden');
      if (tags[i].getElementsByTagName('span') && tags[i].getElementsByTagName('span').length > 1) {
        tags[i].getElementsByTagName('span')[1].innerHTML = count.toString(); // left layout
      } else {
        tags[i].getElementsByTagName('span')[0].innerHTML = count.toString(); // top layout
      }
    }
  }

  /**
   * Set connected contacts from CRM
   */
  private getContactsConnected(): void {
    this.emailList.emails.forEach(email => {
      email.contactsConnected = [];
      if (email.contacts && email.contacts.length > 0) {
        email.contacts.map(contact => {
          if (contact.from_imap !== '1') {
            email.contactsConnected.push(contact);
          }
        });
      }
    });
  }

  /**
   * Next route
   */
  private onNextRoute(params: Params, queryParams: Params): void {

    // No page number
    if (!params.page) {

      // Redirect to first page (in order to optimize component re-use)
      this.router.navigate(['/mailbox/inbox/1']);

      return;
    }

    // Update email list state
    const state = this.state.clone();
    state.page = parseInt(params.page, 10);
    state.searchQuery = queryParams.q || state.searchQuery;
    state.folderId = queryParams.folder || state.folderId;

    this.mailboxStore.setEmailListState(state);
  }

  /**
   * Next IMAP settings
   */
  private onNextImapSettings(imapSettings: ImapSettingsModel): void {

    // Keep new IMAP settings
    this.imapSettings = imapSettings;
  }

  /**
   * Next email list state
   */
  private onNextEmailListState(state: MailboxListState): void {

    // No folder selected but has folders
    if (!state.folderId && this.imapSettings.folders && this.imapSettings.folders.length === 1) {

      // Use first folder from IMAP settings
      state.folderId = this.imapSettings.folders[0].id;
    }

    // Keep new state
    this.state = state;

    // Load emails
    this.loadEmailList();
  }
}
