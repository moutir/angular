import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { DashboardApiService } from '../shared/dashboard-api.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DashboardConfig } from '../dashboard.config';
import { DashboardState } from '../shared/dashboard.state';
import { TokenInputSuggestionInterface } from '../../shared/interface/token-input-suggestion.interface';

@Component({
  selector: 'app-expanding-table',
  templateUrl: './expanding-table.component.html',
  styleUrls: ['./expanding-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ExpandingTableComponent implements OnInit, OnDestroy {

  // Table values
  @Input() rows: Array<any> = [];
  @Input() rowExpandContent: string;
  @Input() expandable = true;
  @Input() showExpandedRow: boolean;
  @Input() expandedRowIndex: number;
  @Input() rowInputs: any = {};
  @Input() totalsRecords: number;
  @Input() previousLabel: any;
  @Input() nextLabel: any;
  @Input() loadingText: any;
  @Input() noMatchFoundText: any;
  @Input() rowsTotal: any;
  @Input() page = 1;

  // Outputs (Events)
  @Output() tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() cellClicked: EventEmitter<any> = new EventEmitter();
  @Output() expanderClicked: EventEmitter<any> = new EventEmitter();
  @Output() scrolledDown: EventEmitter<any> = new EventEmitter();
  @Output() filterData: EventEmitter<any> = new EventEmitter();

  scrollPercentage = 0;
  buyer: any;
  seller: any;
  intermediate: any;
  broker: any;
  transactionType = 'sell';
  popoverCache: any = {};
  popoverDataLoading: any = false;
  popoverData = {};
  observableSource: any;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef,
    private dashboardStore: DashboardStore,
    private dashboardConfig: DashboardConfig,
    private dashboardApiService: DashboardApiService,
  ) {

  }

  private _columns: Array<any> = [];

  get columns(): Array<any> {
    return this._columns;
  }

  @Input()
  set columns(values: Array<any>) {
    values.forEach((value: any) => {
      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }
      const column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      } else {
        this._columns.push(value);
      }
    });
  }

  private _config: any = {};

  get config(): any {
    return this._config;
  }

  @Input()
  set config(conf: any) {
    if (!conf.className) {
      conf.className = 'table-striped table-bordered';
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }
    this._config = conf;
  }

  get configColumns(): any {
    const sortColumns: Array<any> = [];

    this.columns.forEach((column: any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return {columns: sortColumns};
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // TODO[later]: figure out why we need a local function to wrap the call to loadAutocompleteSuggestions
    this.observableSource = (keyword: string): Observable<TokenInputSuggestionInterface[]> =>
      this.dashboardApiService.loadAutocompleteSuggestions(keyword);

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

  onChangeTable(column: any): void {
    this.showExpandedRow = false;
    this.expandedRowIndex = null;
    this._columns.forEach((col: any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    column.column_name = column.name;
    this.tableChanged.emit({sorting: column});
    this.ref.markForCheck();
  }

  setPopoverDisplay(display, id, e) {
    const ele = e.target.parentElement.querySelector('.transaction-popover');
    if (ele.style.display === 'none') {
      if (id) {
        this.popoverData = this.popoverCache[id];
      }
      ele.style.display = 'block';
    }
  }

  hidePopover(e) {
    const els = this.elementRef.nativeElement.querySelectorAll('.transaction-popover');
    for (let x = 0; x < els.length; x++) {
      els[x]['style'].display = 'none';
    }
  }

  toggleRowExpansion(row: any, rowNum: number) {
    if (this.showExpandedRow && (this.expandedRowIndex === rowNum)) {
      this.showExpandedRow = false;
      this.expandedRowIndex = null;
    } else {
      this.showExpandedRow = true;
      this.expandedRowIndex = rowNum;
      this.ref.markForCheck();
      this.popoverDataLoading = true;
      this.dashboardApiService.loadPropertySummary(row.property_id).subscribe(details => {
        const phones = [];
        const emails = [];
        let firstname, lastname, type, price, rooms, bedrooms, area, location, zip, habitable;

        if (details.broker) {
          firstname = details.broker.firstname ? details.broker.firstname + ' ' : '';
          lastname = details.broker.lastname ? details.broker.lastname : '';

        }

        const agency = details.broker.agency_name ? details.broker.agency_name : '';
        if (details.broker.phones) {
          details.broker.phones.map(phone => {
            phones.push(phone);
          });
        }

        if (details.broker.emails) {
          details.broker.emails.map(email => {
            emails.push(email);
          });
        }

        if (details.main_category) {
          type = details.main_category;
        }

        if (details.price) {
          price = details.price;
        }

        if (details.rooms) {
          rooms = details.rooms;
        }

        if (details.bedrooms) {
          bedrooms = details.bedrooms;
        }

        if (details.land) {
          area = details.land;
        }

        if (details.location) {
          location = details.location;
        }

        if (details.zip) {
          zip = details.zip;
        }

        if (details.habitable) {
          habitable = details.habitable;
        }

        this.popoverCache['property_' + row.property_id] = {
          phones: phones,
          emails: emails,
          name: firstname ? firstname + lastname.toUpperCase() : '',
          agency: agency,
          type: type,
          price: price,
          rooms: rooms,
          bedrooms: bedrooms,
          area: area,
          location: location,
          zip: zip,
          habitable: habitable,
        };

      });
      this.popoverDataLoading = false;
    }

    if (row.intermediatesArray.length > 0) {
      row.intermediatesArray.map(intermediate => {
        this.dashboardApiService.loadContactSummary(intermediate.id).subscribe(details => {
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

          if (details.brokers) {
            for (const i in details.brokers) {
              brokers.push(details.brokers[i]);
            }
          }

          this.popoverCache['intermediate_' + intermediate.id] = {
            mobiles: mobiles,
            phones: phones,
            email: email,
            notes: notes,
            name: intermediate.name,
            searches: searches,
            brokers: brokers,
          };
          this.popoverDataLoading = false;
        });
      });
    }
    if (row.brokersArray.length > 0) {
      row.brokersArray.map(broker => {
        this.dashboardApiService.loadContactSummary(broker.id).subscribe(details => {
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

          if (details.brokers) {
            for (const i in details.brokers) {
              brokers.push(details.brokers[i]);
            }
          }

          this.popoverCache['broker_' + broker.id] = {
            phones: phones,
            email: email,
            notes: notes,
            name: broker.name,
            searches: searches,
            brokers: brokers,
          };
          this.popoverDataLoading = false;
        });
      });
    }
  }

  checkScroll(event: any) {
    this.scrollPercentage = (event.target.scrollTop / (event.target.scrollHeight - event.target.clientHeight)) + 5;
    if (this.scrollPercentage > this.config.renderMoreAt) {
      this.scrolledDown.emit(this.scrollPercentage);
    }
  }

  getData(row: any, propertyName: string): string {
    return propertyName.split('.').reduce((prev: any, curr: string) => prev[curr], row);
  }

  cellClick(row: any, column: any): void {
    this.cellClicked.emit({row, column});
  }

  emitFilter(filter) {
    setTimeout(() => {
      this.filterData.emit(filter);
    }, 300);
    this.showExpandedRow = false;
    this.expandedRowIndex = null;
  }

  onChange(event, column) {
    if (!event.data) {
      const filter = {};
      filter[column] = '';
      this.config.filter = filter;
      this.emitFilter(filter);
    }
  }

  /**
   * Changed page number
   */
  onChangePage(pageEvent: PageEvent): void {

    this.page = pageEvent.pageIndex + 1;

    if (!this.config.filter) {

      this.config.filter = {};
    }

    this.config.filter.page = this.page;
    this.emitFilter(this.config.filter);
    this.showExpandedRow = false;
    this.expandedRowIndex = null;
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {

    const calendarClassNames = ['mydpicon', 'icon-mydpcalendar', 'btnpicker', 'btnpickerenabled', 'selbtngroup', 'selection', 'inputnoteditable ', 'selectiongroup', 'mydp'];
    const targetClassNames = event.target.className.split && event.target.className.split(' ') || [];
    const findOne = targetClassNames.some((v) => {
      return calendarClassNames.indexOf(v) >= 0;
    });

    const ele = document.querySelector('.selector');
    if (!findOne) {
      if (ele) {
        (ele as HTMLElement).style.display = 'none';
      }
    } else {
      let toRemove;
      const allEle = document.querySelectorAll('.selector');
      const allEleVisible = [];
      for (let j = 0, max = allEle.length; j < max; j++) {
        if ((allEle[j] as HTMLElement).style.display !== 'none') {
          allEleVisible.push(allEle[j]);
        }
      }
      if (allEleVisible.length > 1) {
        for (let i = 0; i < allEleVisible.length; i++) {
          if (allEleVisible[i] !== event.target.parentElement.parentElement.parentElement.querySelector('.selector')) {
            toRemove = allEleVisible[i];
          }
        }
        if (toRemove) {
          toRemove.style.display = 'none';
        }
      } else if (allEleVisible.length === 0) {
        if (allEle[0]) {
          (allEle[0] as HTMLElement).style.display = '';
        }
      }
    }
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.transactionType = state.transactionTypeId === this.dashboardConfig.sale.transactionTypeId ? 'sell' : 'rental';
  }
}
