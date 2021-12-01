import { FisherModel } from '../../shared/model/fisher.model';

export const FEATURE_NAME = 'data-fisher';

export interface DataFisherStateInterface {
  fisher: FisherModel;
}

export const initialState: DataFisherStateInterface = {
  fisher: null,
};
