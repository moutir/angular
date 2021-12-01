import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { DeviceSearchModel } from '../../shared/model/device-search.model';
import { DeviceSearchOptionsInterface } from '../../shared/interface/device-search-options.interface';
import { DeviceTypeEnum } from '../../shared/enum/device-type.enum';
import { FormModelAdapterStrategy } from '../../core/shared/form/form-model-adapter.strategy';

@Component({
  selector: 'app-device-form-search',
  templateUrl: './device-form-search.component.html',
  styleUrls: ['./device-form-search.component.scss'],
})
export class DeviceFormSearchComponent extends FormComponentAbstract<
  DeviceSearchModel,
  DeviceSearchOptionsInterface
> {

  /**
   * Device type
   */
  @Input() deviceType: DeviceTypeEnum;

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected formAdapterStrategy: FormModelAdapterStrategy<DeviceSearchModel>,
  ) {

    super(formBuilder, formAdapterStrategy);
  }

  /**
   * Whether current form represents search controls for blacklisted devices
   */
  isBlacklistForm(): boolean {

    return this.deviceType === DeviceTypeEnum.BLACKLISTED;
  }
}
