import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

import { HelperService } from '../../core/shared/helper.service';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: 'doughnut-chart.component.html',
  styleUrls: ['doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit, OnChanges {

  @Input() allDataChart: any = null;
  @Input() amounts = null;
  @Input() height = 260;
  @Input() width = 260;
  @Input() chartLegendTitleLeft = 'Stars';
  @Input() chartLegendTitleRight = 'Amount';
  @Input() showCartValue = true;
  @Input() chartLegendItemClass: string;
  @Input() seriesName: any;

  chart: any;

  /**
   * Constructor
   */
  constructor(
    private helperService: HelperService,
  ) {

  }

  get isData(): boolean {

    if (!this.allDataChart || !this.allDataChart.length) {
      return false;
    } else {
      return !this.allDataChart.every((item) => {
        return item.y === 0;
      });
    }
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.chart = new Chart({
      chart: {
        type: 'pie',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        margin: [0, 0, 0, 0],
        spacingTop: 0,
        spacingBottom: 0,
        spacingLeft: 0,
        spacingRight: 0,
      },
      title: { text: '' },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      series: [{
        type: 'pie',
        name: this.seriesName,
        data: this.allDataChart,
        size: '100%',
        innerSize: '79%',
        dataLabels: {
          enabled: false,
        },
      }],
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
          },
        },
        series: {
          states: {
            hover: {
              brightness: 0.1,
              enabled: true,
              halo: {
                size: 0,
              },
            },
          },
          animation: {
            duration: 1500,
            easing: (pos: number): number => {

              if ((pos) < (1 / 2.75)) {
                return (7.5625 * pos * pos);
              }
              if (pos < (2 / 2.75)) {
                return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
              }
              if (pos < (2.5 / 2.75)) {
                return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
              }
              return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
            },
          },
        },
      },
      exporting: {
        enabled: false,
      },
    });
    this.amounts = (+this.amounts.toFixed());
    this.roundUpPercent();
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (this.chart && changes.allDataChart) {

      this.updateCharts(changes.allDataChart.currentValue);
    }
  }

  amountFormat(num: number): string {

    return this.helperService.formatNumber(num);
  }

  roundUpPercent(): void {

    let sum = 0;
    let addition = 0;
    let reduced = false;
    let lessThanZero = false;

    if (this.allDataChart) {
      this.allDataChart.map((item) => {
        item.percentage = this.getPercent(item.y);
        sum += Number(item.percentage);

      });
      const max = Math.max.apply(Math, this.allDataChart.map(o => o.percentage)).toString();
      if (sum > 0 && sum !== 100) {

        this.allDataChart.forEach((item) => {
          if (item.percentage !== max) {
            addition += (item.percentage / sum) * 100;
          }
        });

        const toReduce = 100 - addition;

        this.allDataChart.forEach((item) => {
          if (item.percentage === max && !reduced) {
            reduced = true;
            item.percentage = (Number(item.percentage) - (Number(item.percentage) - toReduce)).toFixed();
          }
        });
      } else if (sum === 100) {
        this.allDataChart.forEach((item) => {
          if (item.percentage === 0 && item.y > 0) {
            lessThanZero = true;
            item.percentage = '< 1';
          }
        });
        if (lessThanZero) {
          this.allDataChart.forEach((item) => {
            if (item.percentage === max) {
              item.percentage = item.percentage - 1;
              if (item.percentage === -0) {
                item.percentage = 0;
              }
            }
          });
        }
        this.allDataChart.forEach((item) => {
          if (item.percentage === -0) {
            item.percentage = 0;
          }
        });
      }

    }
  }

  getPercent(y: number): string {

    y = (+y);
    return (y * 100 / (+this.amounts)).toFixed();
  }

  /**
   * Update charts data
   */
  updateCharts(series: SeriesOptionsType[]): void {

    this.chart.addSeries(series);
  }
}
