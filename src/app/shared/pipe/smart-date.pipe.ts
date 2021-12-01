import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DatetimePipe } from './datetime.pipe';

@Pipe({
  name: 'smartDate',
})
export class SmartDatePipe extends DatetimePipe implements PipeTransform {

  /**
   * Constructor
   */
  constructor(
    protected translateService: TranslateService,
  ) {

    super(translateService);
  }

  /**
   * Transforms a date into a smart string (Today 15:30, Yesterday 15:30, Monday 15:30, 25th December, August 2018)
   */
  transform(date: Date|null): string {

    if (!date) {

      return '';
    }

    if (date === null) {

      return;
    }

    const month: string[] = this.translateService.instant('label_months').split(',').map(name => name.trim());
    const weekday: string[] = this.translateService.instant('label_weekdays').split(',').map(name => name.trim());
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Date right now
    const nowDate: Date = new Date(Date.now());

    // Seconds difference
    const secondDiff = Math.floor((nowDate.getTime() - date.getTime()) / 1000);

    // Date is in the future
    if (secondDiff < 0) {

      return this.getDayMonthYear(date);
    }

    // Last 60 seconds
    if (secondDiff < 60) {

      return this.translateService.instant('label_second_ago', { count: secondDiff });
    }

    // Last 60 minutes
    if (secondDiff < 3600) {

      return this.translateService.instant('label_minute_ago', { count: Math.floor(secondDiff / 60) });
    }

    // Last 24 hours but still today
    if (secondDiff < 86400 && date.getDate() === nowDate.getDate()) {

      return this.translateService.instant('label_today_hour_ago', { count: Math.floor(secondDiff / 3600) });
    }

    // Last 48 hours but still yesterday
    if (secondDiff < 172800 && date.getDate() === (new Date(nowDate.getTime() - 86400000)).getDate()) {

      return this.translateService.instant('label_yesterday_time', {
        hour: hours < 10 ? '0' + hours : hours,
        minute: minutes < 10 ? '0' + minutes : minutes,
      });
    }

    // This week
    if (secondDiff < 604800) {

      return this.translateService.instant('label_last_weekday', { weekday: weekday[date.getDay()] });
    }

    // This year
    if (date.getFullYear() === nowDate.getFullYear()) {

      return this.getDayMonthYear(date);
    }

    // Default
    return this.getDayMonthYear(date);
  }
}
