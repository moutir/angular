import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { DashboardConfig } from '../dashboard.config';
import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { ClientModel } from '../shared/client.model';
import { DashboardState } from '../shared/dashboard.state';
import { PipelineListResponseInterface } from '../../api/shared/dashboard/pipeline-list-response.interface';

@Component({
  selector: 'app-pipeline',
  templateUrl: 'pipeline.component.html',
  styleUrls: ['pipeline.component.scss'],
})

export class PipelineComponent implements OnInit, OnDestroy {

  pipeLineShow: boolean = false;
  readonly: boolean = false;
  contacts: ClientModel[] = [];
  // TODO: interface/class
  pipeLineCol: Array<{ id: number; name: string; }> = [{'id': 1, 'name': 'title_add_new_lead'},
    {'id': 2, 'name': 'label_prospect_qualified'},
    {'id': 3, 'name': 'label_properties_proposed'},
    {'id': 4, 'name': 'label_viewing_in_progress'},
    {'id': 5, 'name': 'label_offer_sent'},
    {'id': 6, 'name': 'label_offer_accepted'},
    {'id': 7, 'name': 'label_signature_in_progress'}];
  pipesCount: number = 0;
  shouldToggle: boolean = false;
  popoverData: any = {};
  popoverCache: any = {};
  popoverDataLoading: boolean = false;

  private loadSubscriptionIndex: number;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private dashboardApiService: DashboardApiService,
    private translate: TranslateService,
    private ref: ElementRef,
    private dashboardStore: DashboardStore,
    private dashboardConfig: DashboardConfig,
  ) {

    this.readonly = !this.dashboardConfig.canDrag;
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.pipeLineShow = true;

    // Updated dashboard state
    this.subscriptions.push(
      this.dashboardStore.dashboardState$.subscribe(state => this.onNextDashboardState(state)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getDayStatus(days: string): string {

    if (+days > 10) {
      return 'badge--danger';
    } else if (+days > 5) {
      return 'badge--alert';
    } else {
      return 'badge--success';
    }
  }

  showPopover(item, e): void {

    const ele = e.target.closest('div').querySelector('.contact-popover');
    if (ele.style.display === 'none') {
      const id = item.id;
      if (!this.popoverCache['contact_' + id]) {
        this.popoverDataLoading = true;
        this.dashboardApiService.loadContactSummary(id).subscribe(details => {
          const mobiles = [];
          const phones = [];
          const searches = [];
          const brokers = [];

          if (details.phones) {
            details.phones.map(phone => {
              phones.push(phone);
            });
          }

          const email = details.email ? details.email : '';
          const notes = details.notes && details.notes.trim() !== '' ? details.notes : '';
          if (details.searches) {
            details.searches.map(search => {
              searches.push(search);
            });
          }

          if (Array.isArray(details.brokers)) {

            details.brokers.forEach(broker => brokers.push(broker));
          }

          this.popoverCache['contact_' + id] = {
            mobiles: mobiles,
            phones: phones,
            email: email,
            notes: notes,
            name: item.client_name,
            searches: searches,
            brokers: brokers,
          };
          this.popoverData = this.popoverCache['contact_' + id];
          this.popoverDataLoading = false;
        });
      }
      this.popoverData = this.popoverCache['contact_' + id];
      const bounds = e.target.getBoundingClientRect();
      const y = e.clientY - bounds.top;
      ele.style.top = (y + 30) + 'px';
      ele.style.display = 'block';
    }
  }

  hidePopover(): void {

    const els = this.ref.nativeElement.querySelectorAll('.contact-popover');
    for (let x = 0; x < els.length; x++) {
      els[x]['style'].display = 'none';
    }
  }

  togglePipeLine(): void {

    this.shouldToggle = !this.shouldToggle;
  }

  openContactDetails(id: number): void {

    // TODO[later] Use BrowserService to load none-angular route
    window.open('/contact/active/contact?contact_id=' + id, '_blank');
  }

  /**
   * Clicked the close button
   */
  onClickClose(contactId: number): void {

    this.contacts = this.contacts.filter(contact => {

      if (contact.id === contactId) {

        this.update(contact.id, null);
        this.pipesCount = this.pipesCount - 1;
      }

      return contact.id !== contactId;
    });
  }

  /**
   * Load data
   */
  private load(state: DashboardState): void {

    if (this.subscriptions[this.loadSubscriptionIndex]) {

      this.subscriptions[this.loadSubscriptionIndex].unsubscribe();
    }

    this.subscriptions.push(this.dashboardApiService
      .loadPipeline(state)
      .subscribe((response: PipelineListResponseInterface) => {

        // Filter displayed contacts
        this.contacts = response.contacts.filter(contact => this.isDisplayed(contact, state.transactionTypeId, state.brokerIds));

        this.pipesCount = this.contacts.length;
      }),
    );

    // Set new index
    this.loadSubscriptionIndex = this.subscriptions.length - 1;
  }

  /**
   * Update pipeline contact
   */
  private update(contactId: number, stage: number): void {

    this.dashboardApiService.updatePipeline(String(contactId), String(stage)).subscribe(response => null);

    this.contacts = this.contacts.map(contact => {

      if (contact.id === contactId) {

        contact.stage = stage || contact.stage;
        contact.days = 0;
      }

      return contact;
    });
  }

  /**
   * Is the contact displayed ?
   */
  private isDisplayed(contact: ClientModel, transactionTypeId: string, brokerIds: string[]): boolean {

    const isRent = transactionTypeId === '1' && contact.contact_type.tenant;
    const isSale = transactionTypeId === '2' && contact.contact_type.buyer;
    const isMainBroker = brokerIds.indexOf(String(contact.main_broker_id)) >= 0;
    const isRentalBroker = brokerIds.indexOf(String(contact.rental_broker_id)) >= 0;
    const isSaleBroker = brokerIds.indexOf(String(contact.sale_broker_id)) >= 0;

    return (isRent && (isMainBroker || isRentalBroker)) || (isSale && (isMainBroker || isSaleBroker));
  }

  /**
   * Dropped item
   */
  onDrop(event: CdkDragDrop<any>): void {

    if (event.container === event.previousContainer) {

      return;
    }

    const contact = event.item.data;
    const stage = event.container.data.id;

    this.update(contact.id, stage);
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.load(state);
  }
}
