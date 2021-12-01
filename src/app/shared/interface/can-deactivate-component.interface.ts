import { Observable } from 'rxjs';

export interface CanDeactivateComponentInterface {

  /**
   * Can deactivate component?
   */
  canDeactivate(): Observable<boolean>;
}
