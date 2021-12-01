import { RoleEnum } from '../../shared/enum/role.enum';
import { ClonableInterface } from '../../shared/interface/clonable.interface';

export class DashboardState implements ClonableInterface {

  /**
   * User role
   */
  roleId: RoleEnum;

  /**
   * List of broker IDs
   */
  brokerIds: string[];

  /**
   * Transaction type ID
   */
  transactionTypeId: string;

  /**
   * Contact type ID // TODO[later] figure out usage, why is it a module setting ?
   */
  contactTypeId: string;

  /**
   * Broker type ID // TODO[later] figure out usage, why is it a module setting ?
   */
  brokerTypeId: string;

  /**
   * Constructor
   */
  constructor() {

    // Default values
    this.roleId = RoleEnum.agent;
    this.brokerIds = [];
    this.transactionTypeId = '';
    this.contactTypeId = '';
    this.brokerTypeId = '';
  }

  /**
   * @inheritDoc
   */
  clone(): DashboardState {

    const clone = new DashboardState();

    // Clone values
    Object.assign(clone, this);

    // Clone references
    clone.brokerIds = this.brokerIds.slice(0);

    return clone;
  }
}
