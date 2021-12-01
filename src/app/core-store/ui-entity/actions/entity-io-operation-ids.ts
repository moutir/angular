import { FEATURE_NAME, UiEntityStateInterface } from '../state';
import { ActionUpdateInterface } from '../../action-update.interface';
import { EntityEnum } from '../../../shared/enum/entity.enum';

export class EntityIoOperationIds implements ActionUpdateInterface<UiEntityStateInterface> {

  static readonly TYPE: string = FEATURE_NAME + ': IO operation IDs';
  readonly type: string = EntityIoOperationIds.TYPE;

  /**
   * Constructor
   */
  constructor(public payload: {
    entity: EntityEnum;
    in?: string[];
    out?: string[];
  }) {

  }

  /**
   * @inheritDoc
   */
  reduce(state: UiEntityStateInterface): UiEntityStateInterface {

    const newState = {
      ...state,
      operationIds: {
        ...state.operationIds,
      },
    };

    // IDs
    const ids = state.operationIds[this.payload.entity] ? state.operationIds[this.payload.entity].slice(0) : [];

    // Add IDs (allow duplicates)
    if (this.payload.in) {

      this.payload.in.forEach(id => ids.push(id));
    }

    // Remove IDs (keep duplicated value if any)
    if (this.payload.out) {

      this.payload.out.forEach(id => {

        const index = ids.indexOf(id);

        if (index === -1) {

          return;
        }

        ids.splice(index, 1);
      });
    }

    newState.operationIds[this.payload.entity] = ids;

    return newState;
  }
}
