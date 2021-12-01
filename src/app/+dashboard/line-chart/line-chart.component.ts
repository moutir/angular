import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.scss'],
})
export class LineChartComponent implements OnInit, OnChanges {

  @Input() data: any = [];
  @Input() height: number;
  @Input() width: number;

  chart: any;
  colors: string[] = ['#768bff', '#86ce5e', '#5e6fd3', '#eb535d'];

  /**
   * Initialized component
   */
  ngOnInit(): void {

    this.chart = new Chart({
      title: { text: '' },
      chart: {
        height: this.height,
        width: this.width,
        type: 'line',
      },
      legend: {
        enabled: false,
      },
      colors: this.colors,
      xAxis: {
        title: {
          text: null,
        },
        categories: this.data.categories,
      },
      yAxis: {
        title: {
          text: null,
        },
      },
      series: this.data.series,
      exporting: {
        enabled: false,
      },
    });
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (this.chart && changes.data) {

      this.updateCharts(changes.data.currentValue.series, changes.data.currentValue.categories);
    }
  }

  /**
   * Update charts data
   */
  updateCharts(series: SeriesOptionsType[], categories: string[]): void {

    this.chart.update({
      xAxis: {
        categories: categories,
      },
      series: series,
    });
  }
}
