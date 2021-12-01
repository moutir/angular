import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { DashboardStore } from '../shared/dashboard.store';
import { DashboardState } from '../shared/dashboard.state';

@Component({
  selector: 'app-buyers',
  templateUrl: 'buyers.component.html',
  styleUrls: ['buyers.component.scss'],
})
export class BuyersComponent implements OnInit, OnDestroy, OnChanges {

  @Input() data: any;

  doughnutDataBuyers: any[];
  buyers: any = null;
  buyersFive30 = 0;
  buyersFive60 = 0;
  buyersFive15 = 0;
  buyersFive10 = 0;
  buyersAmount = 0;
  transactionTypeId: string;
  seriesNameBuyers: string;
  seriesNameTenants: string;
  labelStars: string;
  labelAmount: string;

  /**
   * Observable subscriptions
   */
  private subscriptions: Subscription[] = [];

  /**
   * Constructor
   */
  constructor(
    private translateService: TranslateService,
    private dashboardStore: DashboardStore,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Updated dashboard state
    this.subscriptions.push(
      this.dashboardStore.dashboardState$.subscribe(state => this.onNextDashboardState(state)),
    );

    this.seriesNameBuyers = this.translateService.instant('label_buyers');
    this.seriesNameTenants = this.translateService.instant('label_tenants');
    this.labelAmount = this.translateService.instant('label_sell_amount');
    this.labelStars = this.translateService.instant('label_stars');
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data) {

      this.parseBuyersData(changes.data.currentValue);
    }
  }

  /**
   * Destroyed component
   */
  ngOnDestroy(): void {

    // Unsubscribe from observables
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  parseBuyersData(data) {
    this.buyersAmount = 0;
    this.buyers = data.buyers;
    this.buyersFive60 = data.buyers.buyers_five_60;
    this.buyersFive30 = data.buyers.buyers_five_30;
    this.buyersFive15 = data.buyers.buyers_five_15;
    this.buyersFive10 = data.buyers.buyers_five_10;

    this.doughnutDataBuyers = [
      {stars: 1, y: 0, color: '#768bff', name: ''},
      {stars: 2, y: 0, color: '#86ce5e', name: ''},
      {stars: 3, y: 0, color: '#e654c5', name: ''},
    ];

    data.chart.forEach(item => {
      this.buyersAmount += (+item.y);
      switch (item.stars.toString()) {
        case '1':
          this.doughnutDataBuyers[0].y += (+item.y);
          this.doughnutDataBuyers[0].name = item.stars + '*';
          break;
        case '2':
          this.doughnutDataBuyers[1].y += (+item.y);
          this.doughnutDataBuyers[1].name = item.stars + '*';
          break;
        case '3':
          this.doughnutDataBuyers[2].y += (+item.y);
          this.doughnutDataBuyers[2].name = item.stars + '*';
          break;
      }
    });
  }

  /**
   * Next dashboard state
   */
  private onNextDashboardState(state: DashboardState): void {

    this.transactionTypeId = state.transactionTypeId;
  }
}
