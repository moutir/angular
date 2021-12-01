import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LayoutStore {

  /**
   * Observables
   */
  folded$: Observable<boolean>;

  /**
   * Subjects
   */
  private folded: BehaviorSubject<boolean>;

  /**
   * Constructor
   */
  constructor() {

    // Define subjects
    this.folded = new BehaviorSubject<boolean>(false);

    // Define observables
    this.folded$ = this.folded.asObservable();
  }

  /**
   * Set the layout as folded or not
   */
  setFolded(isFolded: boolean): void {

    this.folded.next(isFolded);
  }
}
