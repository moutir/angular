import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { CountState } from './count.state';

@Injectable()
export class CountStore {

  /**
   * Observables
   */
  countState$: Observable<CountState>;

  /**
   * Subjects
   */
  private countState: ReplaySubject<CountState>;

  /**
   * Constructor
   */
  constructor() {

    // Define subjects
    this.countState = new ReplaySubject<CountState>(1);

    // Define observables
    this.countState$ = this.countState.asObservable();
  }

  /**
   * Set counts
   */
  setCountState(state: CountState): void {

    this.countState.next(state);
  }
}
