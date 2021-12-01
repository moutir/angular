import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { HelperService } from '../../core/shared/helper.service';
import { DashboardStore } from '../shared/dashboard.store';
import { DateFilterModel } from '../shared/date-filter.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-total-table',
  templateUrl: 'total-table.component.html',
  styleUrls: ['total-table.component.scss'],
})
export class TotalTableComponent implements OnInit, OnDestroy {

  @Input() dataTable: any[] = [];
  @Input() customClass = '';
  @Input() typeTable: string;

  monthly = false;
  totalTarget: any;
  totalProd: any;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private helperService: HelperService,
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Updated date filter
    this.subscriptions.push(
      this.dashboardStore.dateFilter$.subscribe(date => this.onNextDateFilter(date)),
    );
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  amountFormat(num) {
    if (num === '') {
      return '0';
    }
    var value = parseFloat(parseFloat(num.toString().replace(/[^0-9\-.]/g,'')).toFixed(2).toString().replace('.00', '.-'));
    var str = value.toString();
    if (value !== 0 && value % 1 === 0) {
      str = str + ".-";
    }
    return this.helperService.formatNumber(str);
  }

  getTotal(rowData, index) {
    let total = 0;
    rowData.forEach(item => {
      if (item.val.toString() === '') {
        return;
      }
      total += (+parseFloat(item.val.toString().replace(/[^0-9\-.]/g, '')));
    });
    if (index === 1) {
      this.totalProd = total.toFixed();
    } else if (index === 2) {
      this.totalTarget = total.toFixed();
    }

    const totalString = this.typeTable === 'efforts' ? total : this.amountFormat(total);
    return isNaN(total) ? 'N/a' : totalString;
  }

  getTotalPercent(rowData) {
    return Number(this.totalTarget) > 0 ? ((Number(this.totalProd) / Number(this.totalTarget)) * 100).toFixed() : 0;
  }

  getTarget(rowData) {
    this.totalTarget = Math.max.apply(Math, rowData.map(o => o.val.toString() === '' ? 0 : Number(o.val.toString().replace(/[^0-9\-.]/g, '')))).toString();
    return this.amountFormat(this.totalTarget);
  }

  isPercentRow(row) {
    return row.type === 'percent';
  }

  moreThanHundred(val) {
    return (+val) >= 100;
  }

  /**
   * Next date filter
   */
  private onNextDateFilter(dateFilter: DateFilterModel): void {

    this.monthly = dateFilter.month;
  }
}
