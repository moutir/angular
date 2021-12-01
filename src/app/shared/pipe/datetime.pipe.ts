import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'datetime',
})
export class DatetimePipe implements PipeTransform {

  /**
   * Constructor
   */
  constructor(
    protected translateService: TranslateService,
  ) {

  }

  /**
   * Transforms a date into a date time string
   */
  transform(date: Date, format?: string): string {

    if (!date) {

      return null;
    }

    if (format === 'date') {

      return this.getDayMonthYear(date);
    }

    return this.getDayMonthYearHourMinute(date);
  }

  /**
   * Return the month's label
   */
  protected getMonthLabel(date: Date): string {

    const month: string[] = this.translateService.instant('label_months').split(',').map(name => name.trim());

    return month[date.getMonth()];
  }

  /**
   * Return the day's label
   */
  protected getDayLabel(date: Date): string {

    const day = date.getDate();
    let key = 'label_number_nth';

    if (day === 1) {

      key = 'label_number_first';
    }

    if (day === 2) {

      key = 'label_number_second';
    }

    if (day === 3) {

      key = 'label_number_third';
    }

    if (day === 21) {

      key = 'label_number_twenty_first';
    }

    if (day === 22) {

      key = 'label_number_twenty_second';
    }

    if (day === 23) {

      key = 'label_number_twenty_third';
    }

    if (day === 31) {

      key = 'label_number_thirty_first';
    }

    return key;
  }

  /**
   * Return a date format "15th May 2019"
   */
  protected getDayMonthYear(date: Date): string {

    return this.translateService.instant('label_day_month_year', {
      day: this.translateService.instant(this.getDayLabel(date), { number: date.getDate() }),
      month: this.getMonthLabel(date),
      year: date.getFullYear(),
    });
  }

  /**
   * Return a date format "15th May 2019 at 13h37"
   */
  protected getDayMonthYearHourMinute(date: Date): string {

    const hours = date.getHours();
    const minutes = date.getMinutes();

    return this.translateService.instant('label_datetime', {
      day: this.translateService.instant(this.getDayLabel(date), { number: date.getDate() }),
      month: this.getMonthLabel(date),
      year: date.getFullYear(),
      hour: hours < 10 ? '0' + hours : hours,
      minute: minutes < 10 ? '0' + minutes : minutes,
    });
  }
}
