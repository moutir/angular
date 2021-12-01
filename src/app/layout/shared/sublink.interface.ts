import { Params } from '@angular/router';

export class SublinkInterface {

  /**
   * Label to display
   */
  label: string;

  /**
   * Is the navigation item active ?
   */
  isActive: boolean;

  /**
   * Link icon
   */
  icon: string;

  /**
   * Count to display
   */
  count?: number;

  /**
   * Standard HREF link TODO[legacy] Remove once CRM is on Angular only
   */
  href?: string;

  /**
   * Angular route link
   */
  route?: string[];

  /**
   * Angular route params
   */
  routeParams?: Params;
}
