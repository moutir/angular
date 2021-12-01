import { Pipe, PipeTransform } from '@angular/core';

import { AreaUnitEnum } from '../enum/area-unit.enum';

@Pipe({
  name: 'areaUnit',
})
export class AreaUnitPipe implements PipeTransform {

  /**
   * Transforms an area unit ID into its string "unit" equivalent.
   */
  transform(areaUnit: AreaUnitEnum): string {

    if (areaUnit === AreaUnitEnum.sqm) {

      return 'm²';
    }

    if (areaUnit === AreaUnitEnum.sqft) {

      return 'ft²';
    }

    return areaUnit;
  }
}
