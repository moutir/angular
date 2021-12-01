import { KeyValueType } from '../type/key-value.type';
import { PermissionEnum } from '../enum/permission.enum';

export interface RuntimeFeatureAccountInterface {

  accountTypeMapping: KeyValueType<number, {
    contactTypeId: number[];
    privilege: KeyValueType<string, string[]>;
  }>;

  // Privileges "per module" => "per group" => "privileges"
  privilegeMapping: KeyValueType<string, KeyValueType<string, number[]>>;

  // Privileges required to edit "per module" => "per group" => "privilege/permission/message"
  editableMapping: KeyValueType<string, KeyValueType<string, {
    permission: PermissionEnum;
    privilege: number;
    message: string;
  }>>;
}
