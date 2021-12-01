import { Component, Input } from '@angular/core';

import { CountState } from '../../layout/shared/count.state';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeAuthenticationInterface } from '../../shared/interface/runtime-authentication.interface';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';

@Component({
  selector: 'app-dashboard-widget-todolist',
  templateUrl: './dashboard-widget-todolist.component.html',
  styleUrls: ['./dashboard-widget-todolist.component.scss'],
})
export class DashboardWidgetTodolistComponent {

  /**
   * Constants
   */
  readonly MATCHING_READ: PermissionEnum = PermissionEnum.matchingRead;
  readonly LEAD_READ: PermissionEnum = PermissionEnum.leadRead;
  readonly CONTACT_READ: PermissionEnum = PermissionEnum.contactRead;
  readonly REPORTING_READ: PermissionEnum = PermissionEnum.reportingRead;

  /**
   * Authentication
   */
  @Input() authentication: RuntimeAuthenticationInterface;

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[];

  /**
   * Count state
   */
  @Input() countState: CountState|null;

  /**
   * Count state
   */
  @Input() feature: RuntimeFeatureInterface;

}
