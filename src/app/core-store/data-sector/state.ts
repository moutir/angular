import { SectorModel } from '../../shared/model/sector.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-sector';

export interface DataSectorStateInterface extends DataStateInterface<SectorModel> {

}

export const initialState: DataSectorStateInterface = {
  models: {},
};
