import { DateAdapterStrategyAbstract } from '../date-adapter-strategy.abstract';

export class SwitzerlandStrategy extends DateAdapterStrategyAbstract {

  /**
   * @inheritDoc
   */
  format(date: Date, displayFormat: Object): string {

    if (displayFormat['year'] === 'numeric' && displayFormat['month'] === 'numeric' && displayFormat['day'] === 'numeric') {

      // Force Swiss format regardless of the locale
      return ('DD.MM.YYYY')
        .replace('DD', this.to2digit(date.getDate()))
        .replace('MM', this.to2digit(date.getMonth() + 1))
        .replace('YYYY', String(date.getFullYear()));
    }

    if (displayFormat === 'MM.YYYY') {

      // Force Swiss format regardless of the locale
      return ('MM.YYYY')
        .replace('MM', this.to2digit(date.getMonth() + 1))
        .replace('YYYY', String(date.getFullYear()));
    }

    if (displayFormat === 'YYYY') {

      // Force Swiss format regardless of the locale
      return ('YYYY').replace('YYYY', String(date.getFullYear()));
    }

    return super.format(date, displayFormat);
  }

  /**
   * @inheritDoc
   */
  parse(value: string): Date|null {

    // Split string on anything not a number
    const date: string[] = typeof value === 'string' ? value.split(/[^0-9]/) : [];

    // Invalid date format
    if (date.length !== 3) {

      return null;
    }

    const isDDMMYYYY: boolean = date[0].length === 2 && date[1].length === 2 && date[2].length === 4;
    const isYYYYMMDD: boolean = date[0].length === 4 && date[1].length === 2 && date[2].length === 2;

    if (isDDMMYYYY === true) {

      return this.createDate(
        parseInt(date[2], 10),
        parseInt(date[1], 10) - 1,
        parseInt(date[0], 10),
      );
    }

    if (isYYYYMMDD === true) {

      return this.createDate(
        parseInt(date[0], 10),
        parseInt(date[1], 10) - 1,
        parseInt(date[2], 10),
      );
    }

    return null;
  }

  /**
   * @inheritDoc
   */
  createDate(year: number, month: number, date: number): Date {

    return new Date(Date.UTC(year, month, date));
  }

  /**
   * @inheritDoc
   */
  private to2digit(value: number): string {

    return ('00' + value).slice(-2);
  }
}
