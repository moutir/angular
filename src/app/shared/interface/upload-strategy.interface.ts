import { MimeTypeEnum } from '../enum/mime-type.enum';
import { UploadLayoutTypeEnum } from '../enum/upload-layout-type.enum';
import { DocumentTypeEnum } from '../enum/document-type.enum';
import { EntityEnum } from '../enum/entity.enum';

export interface UploadStrategyInterface {

  /**
   * Allowed file types
   */
  fileTypes: MimeTypeEnum[];

  /**
   * Maximum file size in MB
   */
  maxFileSize: number;

  /**
   * Maximum files count
   */
  maxFileCount: number;

  /**
   * Upload layout type
   */
  layoutType: UploadLayoutTypeEnum;

  /**
   * Is multiple file selection allowed ?
   */
  isAllowedMultiple: boolean;

  /**
   * Document type
   */
  documentType: DocumentTypeEnum;

  /**
   * Entity
   */
  entity: EntityEnum;

  /**
   * Entity ID
   */
  entityId: string;

  /**
   * Description to be shown on the uploader
   */
  description: string;
}
