import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { FrequencyEnum } from '../enum/frequency.enum';

@Pipe({
  name: 'frequencyUnit',
})
export class FrequencyUnitPipe implements PipeTransform {

  /**
   * Constructor
   */
  constructor(
    private translateService: TranslateService,
  ) {

  }

  /**
   * Transforms a frequency ID into its string "unit" equivalent.
   */
  transform(frequencyUnit: FrequencyEnum|string): string {

    if (frequencyUnit === FrequencyEnum.weekly) {

      return this.translateService.instant('label_unit_week');
    }

    if (frequencyUnit === FrequencyEnum.monthly) {

      return this.translateService.instant('label_unit_month');
    }

    if (frequencyUnit === FrequencyEnum.trimesterly) {

      return this.translateService.instant('label_unit_trimester');
    }

    if (frequencyUnit === FrequencyEnum.semesterly) {

      return this.translateService.instant('label_unit_semester');
    }

    if (frequencyUnit === FrequencyEnum.yearly) {

      return this.translateService.instant('label_unit_year');
    }

    return '';
  }
}
