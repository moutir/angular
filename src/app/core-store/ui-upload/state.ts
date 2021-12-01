export const FEATURE_NAME = 'ui-upload';

export interface UiUploadStateInterface {

  /**
   * Is upload status bar folded?
   */
  isFoldedStatusBar: boolean;
}

export const initialState: UiUploadStateInterface = {
  isFoldedStatusBar: false,
};
