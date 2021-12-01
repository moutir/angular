import { Injectable } from '@angular/core';

import { FormModelAdapterStrategy } from '../form/form-model-adapter.strategy';
import { EmailTemplateModel } from '../../../shared/model/email-template.model';

@Injectable()
export class EmailTemplateModelRequiredAdapterStrategy extends FormModelAdapterStrategy<EmailTemplateModel> {

}
