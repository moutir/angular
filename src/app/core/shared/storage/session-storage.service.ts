import { Injectable } from '@angular/core';

import { StorageAbstract } from './storage.abstract';
import { SessionStorageEnum } from '../../../shared/enum/session-storage.enum';

Injectable();
export class SessionStorageService extends StorageAbstract<SessionStorageEnum> {

}
