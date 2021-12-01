import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-properties',
  templateUrl: 'properties.component.html',
  styleUrls: ['properties.component.scss'],
})
export class PropertiesComponent implements OnInit, OnChanges {

  @Input() data: number;

  propertiesData: any;
  buyers: any = {};
  chart: any[] = [];
  graph: any[] = [];

  // Bar chart
  barData: any[] = [];
  barCategories: any[] = [];
  maxValue = 0;

  // Doughnut chart
  doughnutData: any[] = [];
  buyersAmount = 0;
  seriesName: string;
  labelStars: any;
  labelAmount: any;

  /**
   * Constructor
   */
  constructor(
    private translateService: TranslateService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.seriesName = this.translateService.instant('label_mandates');
    this.labelAmount = this.translateService.instant('label_sell_amount');
    this.labelStars = this.translateService.instant('label_stars');
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data) {

      this.parseData(changes.data.currentValue);
    }
  }

  parseData(res: any) {

    this.buyersAmount = 0;

    this.barData = [{
      data: [],
      color: '#768bff',
      borderColor: '#768bff',
    }];

    this.doughnutData = [
      {stars: '1*', y: 0, color: '#768bff', name: ''},
      {stars: '2*', y: 0, color: '#86ce5e', name: ''},
      {stars: '3*', y: 0, color: '#e654c5', name: ''},
    ];

    this.buyersAmount = null;

    this.propertiesData = res;

    this.graph = res.graph;
    this.chart = res.chart;
    this.buyers = res.buyers;

    // Bar chart
    this.graph.forEach(item => {
      this.barCategories.push(item.name);
      this.barData[0].data.push(item.value);
    });

    this.maxValue = Math.max(...this.barData[0].data);
    // Doughnut chart
    this.chart.forEach(item => {
      this.buyersAmount += (+item.y);
      switch (item.stars.toString()) {
        case '1':
          this.doughnutData[0].y += (+item.y);
          this.doughnutData[0].name = item.stars + '*';
          break;
        case '2':
          this.doughnutData[1].y += (+item.y);
          this.doughnutData[1].name = item.stars + '*';
          break;
        case '3':
          this.doughnutData[2].y += (+item.y);
          this.doughnutData[2].name = item.stars + '*';
          break;
      }
    });
  }
}
