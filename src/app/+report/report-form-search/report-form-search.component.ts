import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EntityEnum } from '../../shared/enum/entity.enum';
import { AutocompleteSelectionInterface } from '../../shared/interface/autocomplete-selection.interface';
import { ReportSearchOptionsInterface } from '../../shared/interface/report-search-options.interface';
import { ReportSearchModel } from '../../shared/model/report-search.model';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { ContactTypeEnum } from '../../shared/enum/contact-type.enum';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';
import { KeyValueType } from '../../shared/type/key-value.type';

@Component({
  selector: 'app-report-form-search',
  templateUrl: './report-form-search.component.html',
  styleUrls: ['./report-form-search.component.scss'],
})
export class ReportFormSearchComponent extends FormComponentAbstract<
  ReportSearchModel,
  ReportSearchOptionsInterface
> {

  /**
   * Constants
   */
  readonly AUTOCOMPLETE_ENTITIES_PROPERTY: EntityEnum[] = [EntityEnum.property];
  readonly AUTOCOMPLETE_ENTITIES_CLIENT: EntityEnum[] = [EntityEnum.reportContact];
  readonly AUTOCOMPLETE_ENTITIES_BROKER: EntityEnum[] = [EntityEnum.broker];
  readonly AUTOCOMPLETE_TYPE_MAPPING: KeyValueType<string, ContactTypeEnum> = {
    owner: ContactTypeEnum.owner,
    buyer: ContactTypeEnum.buyer,
    tenant: ContactTypeEnum.tenant,
    intermediary: ContactTypeEnum.intermediary,
    developer: ContactTypeEnum.developer,
  };

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: FormModelAdapterStrategy<ReportSearchModel>,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * Changed autocomplete report-contact selection
   */
  onChangeSelectionClient(selection: AutocompleteSelectionInterface): void {

    const value = this.model.clientIds.slice(0);
    value.push(selection.id);

    return this.setValue('clientIds', value);
  }

  /**
   * Changed autocomplete property selection
   */
  onChangeSelectionProperty(selection: AutocompleteSelectionInterface): void {

    const value = this.model.propertyIds.slice(0);
    value.push(selection.id);

    return this.setValue('propertyIds', value);
  }

  /**
   * Changed autocomplete broker selection
   */
  onChangeSelectionBroker(selection: AutocompleteSelectionInterface): void {

    const value = this.model.brokerIds.slice(0);
    value.push(selection.id);

    return this.setValue('brokerIds', value);
  }
}
