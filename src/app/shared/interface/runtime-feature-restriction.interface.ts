import { RestrictionFormatterType } from '../type/restriction-formatter.type';
import { RestrictionOperatorType } from '../type/restriction-operator.type';

export interface RuntimeFeatureRestrictionInterface {
  rules: {
    [module: string]: {
      [attribute: string]: {
        formatter: RestrictionFormatterType;
        operators: RestrictionOperatorType[];
      };
    };
  };
}
