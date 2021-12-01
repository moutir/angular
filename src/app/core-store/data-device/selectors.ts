import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { Dictionary } from 'app/shared/class/dictionary';

import { DataDeviceStateInterface, FEATURE_NAME } from './state';
import { DeviceModel } from '../../shared/model/device.model';

export const selectDataState: MemoizedSelector<object, DataDeviceStateInterface>
  = createFeatureSelector<DataDeviceStateInterface>(FEATURE_NAME);

export const selectDataDevices: MemoizedSelector<object, Dictionary<DeviceModel>> = createSelector(
  selectDataState,
  (state: DataDeviceStateInterface) => state.models,
);

export const selectDataDevice = (id: string): MemoizedSelector<object, DeviceModel|null> => createSelector(
  selectDataDevices,
  (models: Dictionary<DeviceModel>) => models[id] || null,
);
