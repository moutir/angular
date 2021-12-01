export const FEATURE_NAME = 'ui-restriction';

export interface UiRestrictionStateInterface {

  // Preview by ID
  previewRestrictionId: string;
}

export const initialState: UiRestrictionStateInterface = {
  previewRestrictionId: '',
};
