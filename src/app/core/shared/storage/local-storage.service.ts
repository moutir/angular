import { Injectable } from '@angular/core';

import { StorageAbstract } from './storage.abstract';
import { LocalStorageEnum } from '../../../shared/enum/local-storage.enum';

Injectable()
export class LocalStorageService extends StorageAbstract<LocalStorageEnum> {

}
