import { EntityEnum } from '../../shared/enum/entity.enum';

export const FEATURE_NAME = 'ui-entity';

export interface UiEntityStateInterface {

  // Entity IDs involved in an operation
  operationIds: {
    [entity in EntityEnum]?: string[];
  };
}

export const initialState: UiEntityStateInterface = {
  operationIds: {},
};
