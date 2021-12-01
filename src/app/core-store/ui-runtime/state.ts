import { NotificationInterface } from '../../shared/interface/notification.interface';
import { ContextualInterface } from '../../shared/interface/contextual.interface';
import { PreviewImageInterface } from '../../shared/interface/preview-image.interface';

export const FEATURE_NAME = 'ui-runtime';

export interface UiRuntimeStateInterface {

  // Last notification
  notification: NotificationInterface|null;

  // Contextual content
  contextual: ContextualInterface;

  // Preview image
  previewImage: PreviewImageInterface;
}

export const initialState: UiRuntimeStateInterface = {
  notification: null,
  contextual: {
    uid: '',
    position: {
      x: 0,
      y: 0,
    },
  },
  previewImage: {
    url: '',
    position: {
      x: 0,
      y: 0,
    },
  },
};
