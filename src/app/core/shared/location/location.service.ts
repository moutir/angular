import { Injectable } from '@angular/core';

import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { LocationModel } from '../../../shared/model/location.model';

@Injectable()
export class LocationService extends ModelServiceAbstract<LocationModel> {

  /**
   * @inheritDoc
   */
  factory(): LocationModel {

    return new LocationModel();
  }
}
