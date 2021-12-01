import { JsonapiHydratorInterface } from '../jsonapi-hydrator.interface';
import { JsonapiAgencyInterface } from './jsonapi-agency.interface';
import { AgencyModel } from '../../../../shared/model/agency.model';
import { JsonapiModelStore } from '../jsonapi-model-store';

export class JsonapiAgencyHydrator implements JsonapiHydratorInterface<JsonapiAgencyInterface, AgencyModel> {

  /**
   * @inheritDoc
   */
  factory(): AgencyModel {

    return new AgencyModel();
  }

  /**
   * @inheritDoc
   */
  hydrate(
    model: AgencyModel,
    data: JsonapiAgencyInterface,
    modelStore: JsonapiModelStore,
  ): void {

    // Nothing yet!
  }
}
