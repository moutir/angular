import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';
import { DashboardTransactionFilterInterface } from '../../shared/interface/dashboard-transaction-filter.interface';
import { FormatNumberPipe } from '../../number/shared/format-number.pipe';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';

@Component({
  selector: 'app-tab-transactions',
  templateUrl: './tab-transactions.component.html',
  styleUrls: ['./tab-transactions.component.scss'],
})
export class TabTransactionsComponent implements OnInit, OnDestroy {

  /**
   * Is the contract MVP in use ?
   */
  @Input() isContractMvp: boolean;

  /**
   * List of options
   */
  @Input() options: RuntimeOptionsInterface;

  transactions = [];
  transactionsData = [];
  rows: Array<any> = [];
  page = 1;
  totalRecords: number;
  columns: Array<any> = [];
  itemsPerPage = 10;
  length = 0;
  rowsToRender = 35;
  filter: DashboardTransactionFilterInterface = {
    date_from: '01/01/' + (new Date()).getFullYear(),
    date_to: '',
    contact_id: [],
    property_id: [],
    steps: [],
    page: this.page.toString(),
  };
  rowInputs: any;
  rowComponent: any = '';
  actions: any = [];
  previousLabel: any;
  nextLabel: any;
  loadingText: any;
  noMatchFoundText: any;
  placeHolderToDate: any;
  placeHolderFromDate: any;
  searchContactText: any;
  searchPropertyText: any;
  rowsTotal: any;
  loadingCount: number;

  config: any = { // TODO[later]: interface
    paging: false,
    sorting: {columns: this.columns},
    filtering: {filterString: ''},
    className: ['table-striped', 'table-condensed', 'dataTable', 'table-transactions'],
    height: '50vh',
    renderMoreAt: 0.85,
    infiniteScroll: true,
    filter: this.filter,
  };

  private data: Array<any> = [];

  /**
   * Dashboard state
   */
  private dashboardState: DashboardState;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private dashboardApiService: DashboardApiService,
    private translation: TranslateService,
    private formatNumberPipe: FormatNumberPipe,
    private sanitizer: DomSanitizer,
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    if (this.isContractMvp) {

      // Property contract steps (Except the step: 'canceled')
      this.filter.steps = this.options.propertyContractStep
        .filter(option => option.value !== 'canceled')
        .map(option => option.value);
    }

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

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  onChangeTable(config: any): any {

    const sorting = config.sorting;

    Object
      .keys(sorting)
      .forEach(key => this.filter[key] = sorting[key] ? sorting[key].toString() : '');

    this.load(this.dashboardState);
  }

  onScrollDown() {
    this.rowsToRender += 25;
    this.onChangeTable(this.config);
  }

  editRow(changeData: any) {
    for (const change of changeData) {
      if (change.newValue !== '') {
        this.rows[change.rowIndex][change.columnChanged] = change.newValue;
      }
    }
  }

  filterData(config) {
    if (config.contacts) {
      if (config.contacts.length === 0) {
        this.filter.contact_id = [];
      } else {
        config.contacts.map(contact => {
          this.filter.contact_id.push(contact.data);
        });
      }
    }
    if (config.properties) {
      if (config.properties.length === 0) {
        this.filter.property_id = [];
      } else {
        config.properties.map(prop => {
          this.filter.property_id.push(prop.ref);
        });
      }
    }
    this.filter.date_from = config.date_from ? config.date_from : '';
    this.filter.date_to = config.date_to ? config.date_to : '';
    this.filter.page = config.page ? config.page.toString() : this.page.toString();
    this.page = config.page ? config.page.toString() : this.page.toString();
    this.config.filter = this.filter;
    this.load(this.dashboardState);
  }

  /**
   * Load data
   */
  private load(state: DashboardState): void {

    if (this.loadingCount > 0) {

      return;
    }

    this.loadingCount = 0;
    this.loadPropertyTransactionList(state);
    this.loadPropertyTransactionSummary(state);
  }

  /**
   * Load property transaction list // TODO[later] rewrite the garbage code from this function
   */
  private loadPropertyTransactionList(state: DashboardState): void {

    this.loadingCount++;

    this.dashboardApiService
      .loadPropertyTransactionList(state, this.filter, this.isContractMvp)
      .subscribe(response => {

        this.loadingText = this.translation.instant('label_search_hint_text');
        this.noMatchFoundText = this.translation.instant('label_noResults_hint_text');
        this.placeHolderFromDate = this.translation.instant('label_from');
        this.placeHolderToDate = this.translation.instant('label_to');
        this.previousLabel = this.translation.instant('label_previous');
        this.nextLabel = this.translation.instant('label_next');
        this.searchContactText = this.translation.instant('label_search_contacts');
        this.searchPropertyText = this.translation.instant('label_search_properties');
        this.columns = [
          {
            title: this.translation.instant('label_date') + '<br>' + this.translation.instant('label_invoice_nb'),
            name: 'signature_date_and_invoice',
            filtering: {
              filterString: '',
              placeholder: [this.translation.instant('label_from'), this.translation.instant('label_to')],
              type: 'date',
              search: ['date_from', 'date_to'],
            },
          },
          {
            title: this.translation.instant('label_address'),
            name: 'address',
            filtering: {filterString: '', placeholder: '', type: 'text', search: 'address'},
          },
          {
            title: this.translation.instant('label_seller') + '<br>' + this.translation.instant('label_buyer_header'),
            name: 'seller_and_buyer',
            filtering: {filterString: '', placeholder: '', type: 'seller', search: 'seller_id'},
          },
          {
            title: this.translation.instant('label_sales_price'),
            name: 'sell_price',
            total: 'sell_price_total',
            filtering: {
              filterString: '',
              placeholder: [this.translation.instant('label_from'), this.translation.instant('label_to')],
              type: 'price',
              search: ['sell_price_min', 'sell_price_max'],
            },
          },
          {
            title: this.translation.instant('label_commission'),
            name: 'global_commission',
            total: 'global_commission_total',
            filtering: {
              filterString: '',
              placeholder: [this.translation.instant('label_from'), this.translation.instant('label_to')],
              type: 'price',
              search: ['global_commission_min', 'global_commission_max'],
            },
          },
          {
            title: this.translation.instant('label_interm_com'),
            name: 'intermediates_and_com',
            filtering: {filterString: '', placeholder: '', type: 'intermediate', search: 'intermediate_id'},
          },
          {
            title: this.translation.instant('label_agency_com'),
            name: 'agency_commission',
            total: 'agency_commission_total',
            filtering: {
              filterString: '',
              placeholder: [this.translation.instant('label_from'), this.translation.instant('label_to')],
              type: 'price',
              search: ['agency_commission_min', 'agency_commission_max'],
            },
          },
          {
            title: this.translation.instant('label_broker_prod'),
            name: 'brokers_prod',
            total: 'broker_production_total',
            filtering: {
              filterString: '',
              placeholder: [this.translation.instant('label_from'), this.translation.instant('label_to')],
              type: 'price',
              search: ['broker_production_min', 'broker_production_max'],
            },
          },
          {
            title: this.translation.instant('label_broker_prod'),
            name: 'brokers_prod',
            total: 'broker_production_total',
            filtering: {
              filterString: '',
              placeholder: [this.translation.instant('label_from'), this.translation.instant('label_to')],
              type: 'price',
              search: ['broker_production_min', 'broker_production_max'],
            },
          },
          {
            title: this.translation.instant('label_broker_com'),
            name: 'brokers_and_com',
            filtering: {filterString: '', placeholder: '', type: 'broker', search: 'broker_id'},
          },
          {
            title: this.translation.instant('label_agency_net_com'),
            name: 'net_commission',
            total: 'new_commission_total',
            sort: false,
            filtering: {type: 'price'},
          },
        ];

        this.transactionsData = response.data;
        this.totalRecords = response.total_records;
        this.transactions = [];
        this.data = [];

        this.transactionsData.map(d => {
          d.intermediatesArray = d.intermediates;
          d.brokersArray = d.brokers;
          if (!d.intermediates) {
            d.intermediates = [{name: ''}];
          }
          if (!d.brokers) {
            d.intermediates = [{name: ''}];
          }
          let date_and_invoice = d.signature_date ? d.signature_date : '';
          date_and_invoice += '<br><span style=\'color: grey\'>';
          date_and_invoice += d.property_invoice_number ? d.property_invoice_number : '';
          date_and_invoice += '</span>';

          let seller_and_buyer = '';
          if (d.seller && d.seller.length > 0) {
            d.seller.map(seller => {
              seller_and_buyer += this.translation.instant('label_seller').charAt(0) + ': ' + seller.name + '<br>';
            });
          }

          if (d.buyer && d.buyer.length > 0) {
            d.buyer.map(buyer => {
              seller_and_buyer += this.translation.instant('label_buyer_header').charAt(0) + ': ' + buyer.name + '<br>';
            });
          }

          let intermediates_and_com = d.intermediates && d.intermediates.length > 1 ? this.translation.instant('label_multiple') : d.intermediates.length > 0 ? d.intermediates[0].name : '';
          intermediates_and_com += '<br><span style=\'color: grey\'>';
          // TODO[later] WTF LOL this line's length... could we put the whole class on one line maybe ?
          intermediates_and_com +=  d.intermediates && d.intermediates.length > 0 && d.intermediates[0].commission ? this.formatNumberPipe.transform(d.intermediates.map(item => parseFloat(item.commission.toString().split("'").join(""))).reduce((prev, next) => prev + next).toFixed(2).toString().replace('.00', '.-')) : "";
          intermediates_and_com += '</span>';

          let brokers_and_com = d.brokers && d.brokers.length > 1 ? this.translation.instant('label_multiple') : d.brokers.length > 0 ? d.brokers[0].name : '';
          brokers_and_com += '<br><span style=\'color: grey\'>';
          brokers_and_com +=  d.brokers && d.brokers.length > 0 && d.brokers[0].commission ? this.formatNumberPipe.transform(d.brokers.map(item => parseFloat(item.commission.toString().split("'").join(""))).reduce((prev, next) => prev + next).toFixed(2).toString().replace('.00', '.-')) : "";
          brokers_and_com += '</span>';

          this.transactions.push({
            signature_date: d.signature_date ? d.signature_date : '',
            signature_date_and_invoice: date_and_invoice,
            address: d.address ? d.address.toString() : '',
            seller_and_buyer: seller_and_buyer,
            sell_price: d.sell_price ? this.formatNumberPipe.transform(d.sell_price) : '',
            global_commission: d.global_commission ? this.formatNumberPipe.transform(d.global_commission.toString()) : '',
            intermediates_and_com: intermediates_and_com,
            intermediatesArray: d.intermediatesArray ? d.intermediatesArray : [],
            agency_commission: d.agency_commission ? this.formatNumberPipe.transform(d.agency_commission.toString()) : '',
            brokers_and_com: brokers_and_com,
            brokersArray: d.brokersArray ? d.brokersArray : [],
            brokers_prod: d.brokers && d.brokers.length > 0 && d.brokers[0].production ? this.formatNumberPipe.transform(d.brokers.map(item => parseFloat(item.production.toString().split("'").join(""))).reduce((prev, next) => prev + next).toFixed(2).toString().replace('.00', '.-')) : "",
            net_commission: d.net_commission ? this.formatNumberPipe.transform(d.net_commission.toString()) : '',
            photo: d.photo ? d.photo : '',
            reference: d.reference ? d.reference : '',
            sale_date: d.sale_date ? d.sale_date : '',
            property_id: d.property_id,
            property_archive: d.property_archive === 0 ? 'active' : 'archive',
          });
        });

        this.data = this.transactions;
        this.length = this.data.length;

        this.loadingCount--;
      });
  }

  /**
   * Load property transaction summary
   */
  private loadPropertyTransactionSummary(state: DashboardState): void {

    this.loadingCount++;

    this.dashboardApiService
      .loadPropertyTransactionSummary(state, this.filter, this.isContractMvp)
      .subscribe(response => {

        this.rowsTotal = [
          { name: this.translation.instant('label_total_sales'), value: response.sell_price_total },
          { name: this.translation.instant('label_global_commission'), value: response.global_commission_total },
          { name: this.translation.instant('label_agency_commission'), value: response.agency_commission_total },
          { name: this.translation.instant('label_broker_commission'), value: response.broker_commission_total },
          { name: this.translation.instant('label_agency_net_com'), value: response.new_commission_total },
        ];

        this.loadingCount--;
      });
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.dashboardState = state;

    this.load(state);
  }
}
