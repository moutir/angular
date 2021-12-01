import { ModelAbstract } from '../../../shared/class/model.abstract';

export class FisherModel extends ModelAbstract {
  leadId: string;
  contactId: string;
  confidence: string;
  currency: string;
  valueRangeLower: number;
  valueRangeUpper: number;
}
