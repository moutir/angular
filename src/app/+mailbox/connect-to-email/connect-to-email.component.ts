import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { MailboxApiService } from '../shared/mailbox-api.service';
import { PropertySearchResponseInterface } from '../../api/shared/mailbox/property-search-response.interface';
import { ContactSearchResponseInterface } from '../../api/shared/mailbox/contact-search-response.interface';

@Component({
  selector: 'app-connect-to-email',
  templateUrl: './connect-to-email.component.html',
  styleUrls: ['./connect-to-email.component.scss'],
})
export class ConnectToEmailComponent implements OnInit, AfterViewInit {

  @Input() currentEmailId: string;
  @Input() email;
  @Input() connected;
  @Output() notify: EventEmitter<any> = new EventEmitter();

  properties: PropertySearchResponseInterface = [];
  promotions = [];
  contacts: ContactSearchResponseInterface = [];
  isLoading: boolean = false;
  isOpenDropdown: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private mailboxApiService: MailboxApiService,
    private ref: ElementRef,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.isOpenDropdown = false;
  }

  ngAfterViewInit() {
    this.ref.nativeElement.querySelector('input').focus();
  }

  onClickProperty(event, item) {

    event.stopPropagation();

    this.email.editMode = false;
    this.email.connectMode = false;
    this.properties = this.properties.filter(prop => {
      return prop.ref !== item.ref;
    });
    this.isLoading = false;
    const checkIfExists = this.email.properties.filter(prop => {
      return prop.reference === item.reference;
    });
    if (checkIfExists.length === 0) {
      this.linkProperty(item);
    }
  }

  onClickPromotion(event, item) {

    event.stopPropagation();

    this.email.editMode = false;
    this.email.connectMode = false;
    this.promotions = this.promotions.filter(prop => {
      return prop.data !== item.data;
    });
    this.isLoading = false;
    const checkIfExists = this.email.promotions.filter(promo => {
      return promo.id === item.data;
    });
    if (checkIfExists.length === 0) {
      this.email.promotions.push(item);
      this.linkPromotion(item);
    }
  }

  onClickContact(event, item) {

    event.stopPropagation();

    this.email.editMode = false;
    this.email.connectMode = false;
    this.contacts = this.contacts.filter(prop => {
      return prop.contact_id !== item.contact_id;
    });
    this.isLoading = false;
    const checkIfExists = this.email.contacts.filter(contact => {
      return contact.contact_id === item.contact_id;
    });
    if (checkIfExists.length === 0) {
      const contact = {
        'contact_id': item.contact_id,
        'contact_firstname': item.firstname,
        'contact_lastname': item.lastname,
        'name': null,
        'email': null,
        'recipient_type': 'to',
        'from_imap': '0',
      };
      this.email.contacts.push(contact);
      this.connected.push(contact);
      this.linkContact(item);
    }
  }

  onInputProperty(searchValue: string) {

    this.isLoading = searchValue !== '';

    this
      .mailboxApiService
      .loadProperties(searchValue)
      .subscribe(response => {

          this.properties = response;
          this.isLoading = false;
          this.properties = this.properties.filter(item => {
            for (let i = 0, len = this.email.properties.length; i < len; i++) {
              if (this.email.properties[i].reference === item.reference) {
                return false;
              }
            }
            return true;
          });
        },
      );
  }

  onInputPromotion(searchValue: string) {

    this.isLoading = searchValue !== '';

    this
      .mailboxApiService
      .loadPromotions(searchValue)
      .subscribe(response => {

          this.isLoading = false;

          const promotions = response && response.suggestions && response.suggestions.length > 0 ? response.suggestions : [];

          this.promotions = promotions.filter(item => {
            for (let i = 0, len = this.email.promotions.length; i < len; i++) {
              const id = this.email.promotions[i].id ? this.email.promotions[i].id : this.email.promotions[i].data;
              if (id === item.data) {
                return false;
              }
            }
            return true;
          });
        },
      );
  }

  onInputContact(searchValue: string) {

    this.isLoading = searchValue !== '';

    if (searchValue && searchValue !== '') {

      this
        .mailboxApiService
        .loadContacts(searchValue)
        .subscribe(response => {

            this.contacts = response;
            this.isLoading = false;
            this.contacts = this.contacts.filter(item => {
              for (let i = 0, len = this.connected.length; i < len; i++) {
                if (this.connected[i].contact_id === item.contact_id) {
                  return false;
                }
              }
              return true;
            });
          },
        );
    } else {
      this.contacts = [];
    }
  }

  onClickOptionProperty(event, email) {

    event.preventDefault();
    event.currentTarget.parentElement.parentElement.classList.remove('open');
    email.modalState = 'properties';
    this.isLoading = false;
    this.isOpenDropdown = false;
  }

  onClickOptionPromotion(event, email) {

    event.preventDefault();
    event.currentTarget.parentElement.parentElement.classList.remove('open');
    email.modalState = 'promotions';
    this.isLoading = false;
    this.isOpenDropdown = false;
  }

  onClickOptionContact(event, email) {

    event.preventDefault();
    event.currentTarget.parentElement.parentElement.classList.remove('open');
    email.modalState = 'contacts';
    this.isLoading = false;
    this.isOpenDropdown = false;
  }

  onFocusOut(input) {

    this.isLoading = false;
    input.value = '';
    this.properties = [];
    this.promotions = [];
    this.contacts = [];
  }

  onFocus(input) {

    if (input.parentElement.parentElement.querySelector('.open')) {
      input.parentElement.parentElement.querySelector('.open').classList.remove('open');
    }
  }

  /**
   * Clicked the dropdown
   */
  onClickDropdown(): void {

    this.isOpenDropdown = !this.isOpenDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {

    if (!this.ref.nativeElement.contains(event.target) && !event.target.classList.contains('open-edit')) {
      this.email.editMode = false;
      this.isOpenDropdown = false;
    }
  }

  private linkProperty(item) {

    this.email.properties.push(item);

    this.mailboxApiService
      .linkProperty(this.currentEmailId, item.ref ? item.ref : item.id)
      .subscribe();
    this.notify.emit(item);
  }

  private linkPromotion(item) {
    const promotions = [];
    this.email.promotions.map(prop => {
      promotions.push(prop.data ? prop.data : prop.id);
    });
    this.mailboxApiService
      .linkPromotion(this.currentEmailId, item.data ? item.data : item.id)
      .subscribe();
    this.notify.emit(item);
  }

  private linkContact(item) {
    this.mailboxApiService
      .linkContact(this.currentEmailId, item.contact_id)
      .subscribe();
    this.notify.emit(item);
  }
}
