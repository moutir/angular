import { ViewportAutofitType } from '../type/viewport-autofit.type';

export interface PolygonSettingsInterface {

  // Maximum number of polygons in a map
  maxCount: number;

  // Maximum number of vertices per polygon in a map
  verticesMaxCount: number;

  // Polygons colors
  colors: string[];

  // How often does the viewport automatically fit the polygons ?
  viewportAutofit: ViewportAutofitType;

  // Are polygons editable ?
  isEditable: boolean;

  // Are polygons edit buttons disabled ?
  isDisabled: boolean;

  // Ask user to confirm polygon delete ?
  isConfirmDelete: boolean;
}
