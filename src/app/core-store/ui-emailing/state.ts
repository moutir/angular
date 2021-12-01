import { DocumentModel } from '../../shared/model/document.model';
import { EntityEnum } from '../../shared/enum/entity.enum';
import { KeyValueType } from '../../shared/type/key-value.type';
import { RecipientSummaryInterface } from '../../shared/interface/recipient-summary.interface';
import { Dictionary } from '../../shared/class/dictionary';
import { EmailingPreviewInterface } from '../../shared/interface/emailing-preview.interface';

export const FEATURE_NAME = 'ui-emailing';

export interface UiEmailingStateInterface {

  // Email preview
  preview: EmailingPreviewInterface;

  // Summaries of each recipients after send email
  summaries: RecipientSummaryInterface[];

  // Documents per entity
  documents: KeyValueType<EntityEnum, Dictionary<DocumentModel[]>>;
}

export const initialState: UiEmailingStateInterface = {
  preview: {
    isOpen: false,
    data: {},
  },
  summaries: [],
  documents: {
    agency: {},
    property: {},
    promotion: {},
  },
};
