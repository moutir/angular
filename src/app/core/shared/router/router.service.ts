import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable()
export class RouterService {

  /**
   * Previous URL
   */
  private previousUrl: string = '';

  /**
   * Current URL
   */
  private currentUrl: string = '';

  /**
   * Constructor
   */
  constructor(
    private router: Router,
  ) {

    this.router.events
      .pipe(filter(evt => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: [RoutesRecognized, RoutesRecognized]) => this.onEventRouter(events));
  }

  /**
   * Returns previous URL
   */
  getPreviousUrl(): string {

    return this.previousUrl;
  }

  /**
   * Returns current URL
   */
  getCurrentUrl(): string {

    return this.currentUrl;
  }

  /**
   * Router emitted events
   */
  private onEventRouter(events: [RoutesRecognized, RoutesRecognized]): void {

    this.previousUrl = events[0].urlAfterRedirects;
    this.currentUrl = events[1].urlAfterRedirects;
  }
}
