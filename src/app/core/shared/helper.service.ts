import { Injectable } from '@angular/core';
import { DateFormatEnum } from '../../shared/enum/date-format.enum';

/**
 * TODO[later] Remove this service in favour of specialized formatters services
 */
@Injectable()
export class HelperService {

  /**
   * Format a number, ex: 1000000 returns 1'000'000
   */
  formatNumber(value: number | string): string {

    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\'');
  }

  /**
   * Return true if the value is a numeric, else returns false
   */
  isNumeric(value: string): boolean {

    return String(parseInt(value, 10)) === value;
  }

  /**
   * Converts the value to a camel case string
   */
  toCamelCase(value: string): string {

    if (value && value.indexOf(' ') < 0) {

      return value.toLowerCase().replace(/(?:(^.)|(\s+.))/g, match => match.charAt(match.length - 1).toUpperCase());
    }

    return value;
  }

  /**
   * Converts a MySQL date/datetime string into a JS Date
   */
  stringToDate(str: string, toUTC: boolean = true): Date {

    // No string value
    if (!str) {

      return null;
    }

    const isDatetime = str.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/) !== null;
    const isDate = str.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) !== null;

    // Invalid datetime & date format
    if (isDatetime === false && isDate === false) {

      return null;
    }

    // Split into [ Y, M, D, h, m, s ]
    const t = str.split(/[- :]/).map(val => parseInt(val, 10));

    if (toUTC === false) {

      return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);
    }

    // Returns date after the conversion to UTC
    return new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0));
  }

  /**
   * Converts a date string to DD.MM.YYYY format
   */
  dateToString(date: Date, format: DateFormatEnum = DateFormatEnum.api): string {

    if (!date) {

      return '';
    }

    const year = String(date.getFullYear());
    let month = String(date.getMonth() + 1);
    let day = String(date.getDate());

    if (month.length === 1) {

      month = '0' + month;
    }

    if (day.length === 1) {

      day = '0' + day;
    }

    if (format === DateFormatEnum.iso) {

      return date.toISOString().split('.')[0] + '+00:00';
    }

    if (format === DateFormatEnum.api) {

      return [day, month, year].join('/');
    }

    if (format === DateFormatEnum.switzerland) {

      return [day, month, year].join('.');
    }

    if (format === DateFormatEnum.france) {

      return [day, month, year].join('/');
    }

    if (format === DateFormatEnum.mysql) {

      return [year, month, day].join('-');
    }

    // Fall back to YYYY-MM-DD
    return day + '.' + month + '.' + year;
  }

  /**
   * Converts a MySQL date string to JS date
   *
   * @deprecated TODO[later] Replace deprecated function
   */
  dateStringToDate(date: string = ''): Date {

    if (!date) {

      return null;
    }

    // Split into [ DD, MM, YYYY]
    const d = date.split('/').map(val => parseInt(val, 10));

    return new Date(Date.UTC(d[2], d[1] - 1, d[0]));
  }

  /**
   * Converts a MySQL date string to JS date and time
   */
  dateStringToDateTime(date: string = ''): Date {

    if (!date) {

      return null;
    }

    // Split into [ D, M, Y, h, m, s ]
    const t = date.split(/[/ :]/).map(val => parseInt(val, 10));

    // Apply each element to the Date function
    return new Date(Date.UTC(t[2], t[1] - 1, t[0], t[3] || 0, t[4] || 0, t[5] || 0));
  }

  /**
   * Returns duration between two dates (hh:mm:ss format)
   */
  duration(startDate: Date, endDate: Date): string {

    // Calculate the difference in milliseconds
    let diffMs = endDate.getTime() - startDate.getTime();

    diffMs = diffMs / 1000;

    // Seconds
    const seconds = Math.floor(diffMs % 60);

    diffMs = diffMs / 60;

    // Minutes
    const minutes = Math.floor(diffMs % 60);

    diffMs = diffMs / 60;

    // Hours
    const hours = Math.floor(diffMs);

    return [hours, minutes, seconds].join(':');
  }

  /**
   * Returns time in hh:mm format
   */
  getTimeString(date: Date, isShownSeconds?: boolean): string {

    if (!date) {

      return '';
    }

    const hour =  (date.getHours() < 10 ? '0' : '') + date.getHours();
    const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    const second = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();

    if (isShownSeconds) {

      return [hour, min, second].join(':');
    }

    return [hour, min].join(':');
  }

}
