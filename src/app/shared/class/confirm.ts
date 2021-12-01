import { Observable, Subject } from 'rxjs';

export class Confirm {

  /**
   * Message
   */
  message: string = '';

  /**
   * Observables
   */
  private isValid$: Observable<boolean>;

  /**
   * Subject
   */
  private isValid: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor
   */
  constructor() {

    this.isValid$ = this.isValid.asObservable();
  }

  /**
   * Select is valid
   */
  selectIsValid(): Observable<boolean> {

    return this.isValid$;
  }

  /**
   * Answer the confirmation
   */
  answer(isValid: boolean): void {

    this.isValid.next(isValid);
  }
}
