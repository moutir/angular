import { Component, Input } from '@angular/core';
import { SidenavComponentAbstract } from '../sidenav/sidenav-component.abstract';
import { PermissionEnum } from '../../shared/enum/permission.enum';

@Component({
  selector: 'app-layout-sidenav-user-switch',
  templateUrl: './sidenav-user-switch.component.html',
  styleUrls: ['./sidenav-user-switch.component.scss'],
})
export class SidenavUserSwitchComponent extends SidenavComponentAbstract {

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

}
