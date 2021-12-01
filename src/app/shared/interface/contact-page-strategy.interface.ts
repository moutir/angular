import { Observable } from 'rxjs';

import { PermissionEnum } from '../enum/permission.enum';
import { ContactModel } from '../model/contact.model';
import { ModelSaveInterface } from './model-save.interface';
import { PageTypeEnum } from '../enum/page-type.enum';
import { KeyValueType } from '../type/key-value.type';
import { LanguageEnum } from '../enum/language.enum';

export interface ContactPageStrategyInterface {

  /**
   * Return read permission
   */
  getPermissionRead(): PermissionEnum;

  /**
   * Return write permission
   */
  getPermissionWrite(): PermissionEnum;

  /**
   * Load contact
   */
  load(id: string): Observable<ContactModel>;

  /**
   * Save contact
   */
  save(model: ContactModel): Observable<ModelSaveInterface>;

  /**
   * Return page title
   */
  getModelPageTitle(model: ContactModel, language: LanguageEnum): string;

  /**
   * Return redirect segments based on @type and @id, or null if default logic should apply
   */
  getRedirectSegments(type: PageTypeEnum|null, id: string|null): null|string[];

  /**
   * Return notification update success
   */
  getNotificationUpdate(): string;

  /**
   * Return tab labels
   */
  getTabLabels(): KeyValueType<PageTypeEnum, string>;
}
