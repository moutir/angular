import { ModelAbstract } from '../../shared/class/model.abstract';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { PageTypeEnum } from '../../shared/enum/page-type.enum';
import { PageActionEnum } from '../../shared/enum/page-action.enum';
import { PageTabEnum } from '../../shared/enum/page-tab.enum';

export const FEATURE_NAME = 'ui-page';

export interface UiPageStateInterface {
  entity: EntityEnum;
  id: string;
  icon: string;
  type: PageTypeEnum;
  model: ModelAbstract|null;
  tabUid: PageTabEnum|null;
  action: PageActionEnum;
  canDeactivate: boolean;
}

export const initialState: UiPageStateInterface = {
  entity: EntityEnum.loading,
  id: '',
  icon: 'more_horiz',
  type: PageTypeEnum.loading,
  model: null,
  tabUid: null,
  action: PageActionEnum.loading,
  canDeactivate: true,
};
