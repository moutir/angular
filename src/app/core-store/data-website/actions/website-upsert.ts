import { FEATURE_NAME } from '../state';
import { WebsiteModel } from '../../../shared/model/website.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class WebsiteUpsert extends UpsertAbstract<WebsiteModel, DataStateInterface<WebsiteModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = WebsiteUpsert.TYPE;
}
