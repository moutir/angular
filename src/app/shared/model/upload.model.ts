import { UploadStatusEnum } from '../enum/upload-status.enum';
import { MimeTypeEnum } from '../enum/mime-type.enum';
import { ModelAbstract } from '../class/model.abstract';

export class UploadModel extends ModelAbstract {
  id: string = '';
  name: string = '';
  size: number = 0;
  type: MimeTypeEnum = null;
  fileId: string = '';
  fileUrl: string = '';
  thumbnailUrl: string = '';
  extension: string = '';
  createDate: Date|null = null;
  updateDate: Date|null = null;
  status: UploadStatusEnum = null;
  progressPercentage: number = 0;
}
