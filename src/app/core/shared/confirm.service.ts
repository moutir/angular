import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Confirm } from '../../shared/class/confirm';

@Injectable()
export class ConfirmService {

  /**
   * Observables
   */
  private confirm$: Observable<Confirm>;

  /**
   * Subjects
   */
  private confirm: Subject<Confirm> = new Subject<Confirm>();

  /**
   * Constructor
   */
  constructor() {

    // Define observables
    this.confirm$ = this.confirm.asObservable();
  }

  /**
   * Select confirm
   */
  selectConfirm(): Observable<Confirm> {

    return this.confirm$;
  }

  /**
   * Open confirm modal
   */
  message(message: string): Observable<boolean> {

    const confirm = new Confirm();
    confirm.message = message;

    this.confirm.next(confirm);

    return confirm.selectIsValid();
  }
}
