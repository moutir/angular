import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocationModel } from '../model/location.model';
import { KeyValueType } from '../type/key-value.type';

@Pipe({
  name: 'location',
})
export class LocationPipe implements PipeTransform {

  /**
   * Type mapping
   */
  private typeMapping: KeyValueType<string, string> = {
    country: 'label_country',
    co: 'label_country',
    canton: 'label_canton',
    ca: 'label_canton',
    district: 'label_district',
    d: 'label_district',
    zone: 'label_zone',
    z: 'label_zone',
    city: 'label_city',
    ci: 'label_city',
    quarter: 'label_quarter',
    q: 'label_quarter',
  };

  /**
   * Constructor
   */
  constructor(
    protected translateService: TranslateService,
  ) {

  }

  /**
   * Transforms a location into a location name with the type in parenthesis
   */
  transform(location: LocationModel): string {

    const id = location.id.split(/[-_]/);

    if (!id[0] || !this.typeMapping[id[0]]) {

      return location.name;
    }

    return [location.name, ' (', this.translateService.instant(this.typeMapping[id[0]]), ')'].join('');
  }
}
