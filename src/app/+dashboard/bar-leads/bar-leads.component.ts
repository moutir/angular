import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { SeriesOptionsType } from 'highcharts';

@Component({
  selector: 'app-bar-leads',
  templateUrl: './bar-leads.component.html',
  styleUrls: ['bar-leads.component.scss'],
})
export class BarLeadsComponent implements OnInit, OnChanges {

  chart: any;

  @Input() categories: any[] = [];
  @Input() data: any[];
  @Input() max: number = 50;
  @Input() width: number;
  @Input() height: number;
  @Input() yaxisText: any;
  @Input() legend: any;

  constructor() {

  }

  get isData(): boolean {

    if (this.data) {
      const allDataArr = this.data.reduce((a, b) => {
        return a.concat(b.data);
      }, []);
      return !(allDataArr.length === 0 || Math.max(...allDataArr) === 0);
    } else {
      return false;
    }
  }

  ngOnInit(): void {

    const legend = this.legend;
    this.chart = new Chart({
      title: {
        text: '',
      },
      chart: {
        type: 'bar',
        inverted: true,
        backgroundColor: '#f3f5f9',
        borderWidth: 3,
        borderColor: '#f3f5f9',
      },
      series: this.formatData(this.data),
      legend: {
        enabled: legend ? legend : false,
      },
      xAxis: {
        title: {
          text: this.yaxisText ? this.yaxisText : null,
        },
        categories: this.categories,
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        labels: {
          style: {
            color: '#323641',
            fontSize: '14px',
            align: 'left',
          },
        },
        minorTickLength: 0,
        tickLength: 0,
      },
      yAxis: {
        title: {
          text: null,
        },
        min: 0,
        labels: {
          style: {
            fontSize: '14px',
          },
        },
      },
      plotOptions: {
        series: {
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
        column: {
          stacking: 'percent',
          shadow: true,
        },
      },
      tooltip: {
        // tslint:disable-next-line: typedef
        formatter: function() {

          let tooltip = legend ? `${this.series.name} <br>` : '';
          tooltip += `${this.x} <br>
                            <strong>${this.y}</strong>`;
          return tooltip;
        },
        followPointer: true,
        followTouchMove: true,
      },
      exporting: {
        enabled: false,
      },
    });
  }

  /**
   * Formate series data
   */
  private formatData(series: SeriesOptionsType[]): SeriesOptionsType[] {

    return series.map((serie) => ({
      ...serie,
      pointWidth: 7,
      borderRadius: 3,
      pointPadding: 0.3,
      groupPadding: 0.25,
    } as SeriesOptionsType));
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (this.chart && changes.data) {

      this.updateCharts(this.formatData(changes.data.currentValue));
    }
  }

  /**
   * Update charts data
   */
  private updateCharts(series: SeriesOptionsType[]): void {

    this.chart.addSeries(series);
  }
}
