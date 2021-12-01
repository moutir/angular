import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material';

@Injectable()
export abstract class DateAdapterStrategyAbstract extends NativeDateAdapter {

  /**
   * @inheritDoc
   */
  format(date: Date, displayFormat: Object): string {

    return super.format(date, displayFormat);
  }

  /**
   * @inheritDoc
   */
  abstract parse(value: string): Date|null;

  /**
   * @inheritDoc
   */
  abstract createDate(year: number, month: number, date: number): Date;
}
