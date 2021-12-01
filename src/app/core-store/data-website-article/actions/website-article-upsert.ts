import { FEATURE_NAME } from '../state';
import { WebsiteArticleModel } from '../../../shared/model/website-article.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class WebsiteArticleUpsert extends UpsertAbstract<WebsiteArticleModel, DataStateInterface<WebsiteArticleModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = WebsiteArticleUpsert.TYPE;
}
