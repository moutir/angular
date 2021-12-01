import { ClonableInterface } from '../../shared/interface/clonable.interface';

export class DateFilterModel implements ClonableInterface {

  /**
   * Selected year
   */
  year: string;

  /**
   * Monthly filter ?
   */
  month: boolean;

  /**
   * @inheritDoc
   */
  clone(): DateFilterModel {

    const clone = new DateFilterModel();

    // Clone values
    Object.assign(clone, this);

    return clone;
  }
}
