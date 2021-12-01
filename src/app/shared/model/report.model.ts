import { ModelAbstract } from '../class/model.abstract';
import { ContactModel } from './contact.model';
import { PropertyModel } from './property.model';
import { PromotionModel } from './promotion.model';
import { ReportGenerationModel } from './report-generation.model';

export class ReportModel extends ModelAbstract {

  /**
   * @inheritDoc
   */
  readonly MODEL_ATTRIBUTES: string[] = [
    'property',
    'promotion',
    'brokers',
    'contact',
    'generation',
  ];

  id: string = '';
  property: PropertyModel = new PropertyModel();
  promotion: PromotionModel = new PromotionModel();
  brokers: ContactModel[] = [];
  contact: ContactModel = new ContactModel();
  propositionCount: number = 0;
  visitPlannedCount: number = 0;
  visitDoneCount: number = 0;
  generation: ReportGenerationModel = new ReportGenerationModel();
  clientBrokerId: string = '';
  hasEmail: boolean = false;
}
