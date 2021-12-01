import { Injectable, NgZone } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Location } from '@angular/common';
import { Dictionary } from 'app/shared/class/dictionary';

import { SearchlistServiceAbstract } from '../../../shared/service/searchlist.service.abstract';
import { StateInterface } from '../../../core-store/state.interface';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { selectUiForm, selectUiKeywords } from '../../../core-store/ui-searchlist/selectors';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';
import { KeywordInterface } from '../../../shared/interface/keyword.interface';
import { selectDataAutocompleteOptions } from '../../../core-store/data-autocomplete/selectors';
import { AutocompleteOptionsInterface } from '../../../shared/interface/autocomplete-options.interface';
import { selectDataDevices } from '../../../core-store/data-device/selectors';
import { OrderEnum } from '../../../shared/enum/order.enum';
import { TrackerService } from '../tracker/tracker.service';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { DeviceConfig } from './device.config';
import { DeviceModel } from '../../../shared/model/device.model';
import { DeviceSearchModel } from '../../../shared/model/device-search.model';
import { DeviceTypeEnum } from '../../../shared/enum/device-type.enum';
import { DeviceSearchOptionsInterface } from '../../../shared/interface/device-search-options.interface';

@Injectable()
export class DeviceSearchlistService extends SearchlistServiceAbstract<
  DeviceModel,
  DeviceSearchModel,
  DeviceSearchOptionsInterface
> {

  /**
   * Constructor
   */
  constructor(
    protected moduleConfig: DeviceConfig,
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected trackerService: TrackerService,
    protected location: Location,
    protected ngZone: NgZone,
  ) {

    super(moduleConfig, store$, runtimeService, trackerService, location, ngZone);
  }

  /**
   * @inheritDoc
   */
  getEmptyFilters(): DeviceSearchModel {

    return new DeviceSearchModel();
  }

  /**
   * Select the type tab index
   */
  selectTypeTabIndex(uid: string): Observable<number> {

    return this.store$.select(
      createSelector(
        selectUiForm(uid),
        this.getSelectorFormOptions(uid),
        (
          form: DeviceSearchModel,
          formOptions: DeviceSearchOptionsInterface,
        ): number => {

          const index = formOptions.deviceType
            .map(option => option.value)
            .indexOf(form.deviceType);

          return index === -1 ? 0 : index;
        },
      ),
    );
  }

  /**
   * Select current device type
   */
  selectDeviceType(uid: string): Observable<DeviceTypeEnum> {

    return this.store$.select(
      createSelector(
        selectUiForm(uid),
        (form: DeviceSearchModel): DeviceTypeEnum => form.deviceType,
      ),
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorFormOptions(uid: string): MemoizedSelector<StateInterface, DeviceSearchOptionsInterface> {

    return createSelector(
      selectUiForm(uid),
      selectDataOptions,
      (
        form: DeviceSearchModel,
        options: RuntimeOptionsInterface,
      ): DeviceSearchOptionsInterface => {

        return {
          deviceType: options.deviceType,
          userId: options.agencyUsers,
        };
      },
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorKeywords(uid: string): MemoizedSelector<StateInterface, KeywordInterface[]> {

    return createSelector(
      selectUiKeywords(uid),
      this.getSelectorFormOptions(uid),
      selectDataAutocompleteOptions,
      (
        keywords: KeywordInterface[],
        formOptions: DeviceSearchOptionsInterface,
        autocompleteOptions: AutocompleteOptionsInterface,
      ): KeywordInterface[] => {

        // Map a keyword name to a translation key and an option name
        const keywordOptionMapping: {
          [name: string]: {
            translation: string;
            option: keyof DeviceSearchOptionsInterface;
            isRemovable: boolean;
          };
        } = {
        };

        return keywords.map(keyword => {

          const updatedKeyword = {
            ...keyword,
          };

          if (keyword.name === 'deviceType') {
            const option = formOptions.deviceType.find(typeOption => typeOption.value === keyword.value);
            updatedKeyword.translation = option ? option.text : keyword.label;
            updatedKeyword.isRemovable = false;

            return updatedKeyword;
          }

          if (keyword.name === 'userId') {
            const option = formOptions.userId.find(typeOption => typeOption.value === keyword.value);
            updatedKeyword.translation = option ? option.text : keyword.label;
            updatedKeyword.isRemovable = true;

            return updatedKeyword;
          }

          return null;
        })
        .filter(keyword => keyword !== null)
        .sort((a, b) => {

          const aScore = (a.isRemovable ? 1 : 0);
          const bScore = (b.isRemovable ? 1 : 0);

          return aScore !== bScore ? aScore - bScore : a.name.localeCompare(b.name);
        });

      },
    );
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultSort(): Observable<SortInterface> {

    return of({
      id: 'user',
      order: OrderEnum.asc,
    });
  }

  /**
   * @inheritDoc
   */
  protected selectDataModels(): (state: StateInterface) => Dictionary<DeviceModel> {

    return selectDataDevices;
  }

  /**
   * @inheritDoc
   */
  protected selectDefaultFilters(): Observable<DeviceSearchModel> {

    return of(this.getEmptyFilters());
  }
}
