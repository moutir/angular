import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { KeyValueType } from '../../type/key-value.type';
import { RuntimeFeatureAccountInterface } from '../../interface/runtime-feature-account.interface';
import { PermissionEnum } from '../../enum/permission.enum';
import { AccountModel } from '../../model/account.model';
import { RuntimeFeatureInterface } from '../../interface/runtime-feature.interface';

@Component({
  selector: 'app-shared-account-privileges',
  templateUrl: './account-privileges.component.html',
  styleUrls: ['./account-privileges.component.scss'],
})
export class AccountPrivilegesComponent implements OnChanges {

  /**
   * Permissions (these are current user's permissions as strings Enum, not to be confused with account's privileges that are string IDs)
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Account model
   */
  @Input() model: AccountModel|null = null;

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * Feature account
   */
  @Input() featureAccount: RuntimeFeatureAccountInterface;

  /**
   * Is the privileges list editable ?
   */
  @Input() isEditable: boolean = false;

  /**
   * Is the component loading ?
   */
  @Input() isLoading: boolean = true;

  /**
   * Change privileges event
   */
  @Output() changePrivileges: EventEmitter<string[]> = new EventEmitter<string[]>();

  /**
   * List of modules (property, contact, ...)
   */
  modules: string[] = [];

  /**
   * List of privileges groups (read, write, admin...)
   */
  groups: string[] = [];

  /**
   * Local "checked" state of module/group pairs
   */
  isCheckedMapping: KeyValueType<string, KeyValueType<string, boolean>> = {};

  /**
   * Hash of the privileges input
   */
  private privilegesHash: string = '';

  /**
   * Map module name to feature name
   */
  private moduleFeatureMapping: KeyValueType<string, string> = {
    task: 'task',
    reporting: 'reporting',
    email: 'emailing',
    promotion: 'promotion',
    lead: 'lead',
    matching: 'matchingGlobal',
    contract: 'contract',
  };

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    const privilegesHash: string = !!changes.model ? this.generatePrivilegesHash(this.model.privileges) : this.privilegesHash;

    // Changed feature or feature account or privileges
    if (!!changes.feature || !!changes.featureAccount || privilegesHash !== this.privilegesHash) {

      this.update();
    }
  }

  /**
   * Is the checkbox checked ?
   */
  isChecked(module: string, group: string): boolean {

    return !!this.isCheckedMapping[module] && !!this.isCheckedMapping[module][group];
  }

  /**
   * Is the group available
   */
  isAvailableGroup(module: string, group: string): boolean {

    const mapping = this.featureAccount.privilegeMapping;

    return !!mapping[module] && !!mapping[module][group] && mapping[module][group].length > 0;
  }

  /**
   * Return true if the module/group pair is not made read-only by required privilege
   */
  getPermissionMessageGroup(module: string, group: string): string {

    if (
      this.isEditable &&
      !!this.featureAccount.editableMapping[module] &&
      !!this.featureAccount.editableMapping[module][group] &&
      this.permissions.indexOf(this.featureAccount.editableMapping[module][group].permission) === -1
    ) {

      return this.featureAccount.editableMapping[module][group].message;
    }

    return '';
  }

  /**
   * Is the group editable
   */
  isEditableGroup(module: string, group: string): boolean {

    if (this.isEditable === false || this.isAvailableGroup(module, group) === false) {

      return false;
    }

    return !this.getPermissionMessageGroup(module, group);
  }

  /**
   * Return the tooltip to display for the module/group pair
   */
  getTooltipGroup(module: string, group: string): string {

    // Module/group not available
    if (this.isAvailableGroup(module, group) === false) {

      return '';
    }

    // Required permission missing when editing
    const permissionMessage = this.getPermissionMessageGroup(module, group);

    if (permissionMessage) {

      return permissionMessage;
    }

    // Admin group
    if (group === 'admin') {

      return ['label_privilege_group', group, module].join('_');
    }

    // Default
    return 'label_privilege_group_' + group;
  }

  /**
   * Clicked a module/group pair
   */
  onClickModuleGroup(module: string, group: string): void {

    if (this.isEditableGroup(module, group) === false) {

      return;
    }

    // Reverse module/group's checked state
    const isChecked = !this.isCheckedMapping[module][group];

    // Figure out groups to check/uncheck
    const iFrom = isChecked ? 0 : this.groups.indexOf(group);
    const iTo = isChecked ? this.groups.indexOf(group) : this.groups.length - 1;

    for (let i = iFrom; i <= iTo; i++) {

      this.isCheckedMapping[module][this.groups[i]] = isChecked;
    }

    // Update privileges
    this.updatePrivileges();
  }

  /**
   * Returns privileges hash
   */
  private generatePrivilegesHash(privileges: string[]): string {

    return privileges.slice(0).sort().join(',');
  }

  /**
   * Update privileges list based on modules and groups config
   */
  private updatePrivileges(): void {

    const privileges = [];

    // For each module
    Object
      .keys(this.featureAccount.privilegeMapping)
      .forEach(module => {

        // For each group
        Object
          .keys(this.featureAccount.privilegeMapping[module])
          .forEach(group => {

            const isChecked = this.isChecked(module, group);

            // For each privilege mapped to the module/group pair
            this.featureAccount.privilegeMapping[module][group].forEach(privilege => {

              const index = privileges.indexOf(String(privilege));

              if (isChecked === true && index === -1) {

                // Add privilege
                privileges.push(String(privilege));
              }
            });
          });
      });

    // Number of privileges changed
    if (this.privilegesHash !== this.generatePrivilegesHash(privileges)) {

      // Emit event with new privileges
      this.emitPrivileges(privileges);
    }
  }

  /**
   * Update component
   */
  private update(): void {

    this.modules = [];
    this.groups = [];
    this.isCheckedMapping = {};

    // For each module
    Object
      .keys(this.featureAccount.privilegeMapping)
      .forEach(module => {

        // Module linked to a feature that is deactivated
        if (this.moduleFeatureMapping[module] && !this.feature[this.moduleFeatureMapping[module]]) {

          return;
        }

        if (this.modules.indexOf(module) === -1) {

          this.modules.push(module);
          this.isCheckedMapping[module] = {};
        }

        // For each group
        Object
          .keys(this.featureAccount.privilegeMapping[module])
          .forEach(group => {

            if (this.groups.indexOf(group) === -1) {

              this.groups.push(group);
            }

            this.isCheckedMapping[module][group] = this.featureAccount.privilegeMapping[module][group]
              .some(privilege => this.model.privileges.indexOf(String(privilege)) > -1);
          });
    });

    // Update privileges hash
    this.privilegesHash = this.generatePrivilegesHash(this.model.privileges);

    // Update privileges
    this.updatePrivileges();
  }

  /**
   * Emit event with new privileges
   */
  private emitPrivileges(privileges: string[]): void {

    this.changePrivileges.emit(privileges.sort());
  }
}
