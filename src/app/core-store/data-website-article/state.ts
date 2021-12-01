import { WebsiteArticleModel } from '../../shared/model/website-article.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-website-article';

export interface DataWebsiteArticleStateInterface extends DataStateInterface<WebsiteArticleModel> {

}

export const initialState: DataWebsiteArticleStateInterface = {
  models: {},
};
