import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

/**
 * @deprecated TODO[later] remove this pipe and use SmartDatePipe instead
 */
@Pipe({
  name: 'smartTimestamp',
})
export class SmartTimestampPipe implements PipeTransform {

  /**
   * Constructor
   */
  constructor(
    private datePipe: DatePipe,
    private translateService: TranslateService,
  ) {

  }

  /**
   * Transforms a timestamp (seconds or milliseconds) into a formatted date
   */
  transform(timestamp: number | string): string {

    // Convert string to number and convert seconds to milliseconds if needed
    timestamp = parseInt(<string>timestamp, 10) * (String(timestamp).length === 10 ? 1000 : 1);

    const currentDate = new Date();
    const transformDate = new Date(timestamp);
    const monthNames = this.translateService.instant('label_months').split(',');

    // Same day
    if (transformDate.setHours(0, 0, 0, 0) === currentDate.setHours(0, 0, 0, 0)) {

      return this.datePipe.transform(timestamp, 'HH:mm');

      // Same year
    } else if (transformDate.getFullYear() === currentDate.getFullYear()) {

      return monthNames[transformDate.getMonth()] + ' ' + transformDate.getDate();
    }

    // Different year
    return this.datePipe.transform(timestamp, 'yyyy/MM/dd');
  }
}
