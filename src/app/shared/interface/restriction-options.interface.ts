import { OptionInterface } from './option.interface';
import { OptionGroupInterface } from './option-group.interface';
import { KeyValueType } from '../type/key-value.type';

export interface RestrictionOptionsInterface {
  module: OptionInterface[];
  attribute: KeyValueType<string, OptionInterface[]>; // Per module
  operator: KeyValueType<string, KeyValueType<string, OptionInterface[]>>; // Per module, per attribute
  input: KeyValueType<string, KeyValueType<string, OptionInterface>>; // Per module, per attribute
  brokerTargets: OptionInterface[];
  brokerByAgencyTargets: OptionGroupInterface[];
  agencyTargets: OptionInterface[];
  groupTargets: OptionInterface[];
  categoryIds: OptionInterface[];
  transactionTypeIds: OptionInterface[];
  contactSearchTransactionTypeIds: OptionInterface[];
  sectorIds: OptionInterface[];
  customAttributeIds: OptionGroupInterface[];
}
