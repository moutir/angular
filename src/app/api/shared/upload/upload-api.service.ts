import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';

import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { UploadModel } from '../../../shared/model/upload.model';
import { MimeTypeEnum } from '../../../shared/enum/mime-type.enum';
import { UploadResponseInterface } from './upload-response.interface';
import { UploadInterface } from '../../../shared/interface/upload.interface';
import { UploadStatusEnum } from '../../../shared/enum/upload-status.enum';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UploadApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Upload file
   */
  upload(upload: UploadInterface): Observable<UploadModel> {

    // Fake local upload
    if (environment.production === false) {

      const photoUrl = 'https://media-exp1.licdn.com/dms/image/C5103AQFpcTYFv1In6g/profile-displayphoto-shrink_200_200/0?e=1606953600&v=beta&t=2meT0Bs7tQUSxVPkDNdIHzkTuyRatT8GEi80gkaUSOE';

      const uploadModel = new UploadModel();
      uploadModel.id = upload.uid;
      uploadModel.name = upload.file.name;
      uploadModel.size = upload.file.size;
      uploadModel.type = <MimeTypeEnum>upload.file.type;
      uploadModel.extension = upload.file.name.split('.').pop().toUpperCase();
      uploadModel.fileId = '1337';
      uploadModel.fileUrl = photoUrl;
      uploadModel.thumbnailUrl = photoUrl;
      uploadModel.createDate = new Date();
      uploadModel.updateDate = new Date(); // BE sends only uploaded date, so using current date time to match both
      uploadModel.progressPercentage = 100;
      uploadModel.status = UploadStatusEnum.completed;

      return of(uploadModel);
    }

    // Production upload
    const formData: FormData = new FormData();

    formData.append('file', upload.file, upload.file.name);

    const url = [
      '/upload/upload',
      upload.strategy.documentType,
      upload.strategy.entity,
      upload.strategy.entityId,
    ].join('/');

    return this.httpService
      .post<FormData, HttpEvent<UploadResponseInterface>>(
        <ApiEndpointEnum>url, formData, null, null, null, { reportProgress: true, observe: 'events' },
      )
      .pipe(
        map(response => this.uploadResponse(response, upload)),
      );
  }

  /**
   * Handle a upload() response and return a UploadModel
   */
  private uploadResponse(event: HttpEvent<UploadResponseInterface>, upload: UploadInterface): UploadModel {

    let progressPercentage = 0;
    let uploadStatus = null;
    const model = new UploadModel();

    model.id = upload.uid;
    model.name = upload.file.name;
    model.size = upload.file.size;
    model.type = <MimeTypeEnum>upload.file.type;
    model.extension = upload.file.name.split('.').pop().toUpperCase();
    model.fileUrl = '';
    model.thumbnailUrl = '';
    model.createDate = new Date();
    model.updateDate = new Date(); // BE sends only uploaded date, so using current date time to match both

    if (event.type === HttpEventType.Sent) { // Request sent

      progressPercentage = 0;
      uploadStatus = UploadStatusEnum.started;

    } else if (event.type === HttpEventType.UploadProgress) { // Upload progressing

      progressPercentage = Math.round(100 * event.loaded / event.total);
      uploadStatus = UploadStatusEnum.progressing;

    } else if (event.type === HttpEventType.Response) { // Completed response

      uploadStatus = UploadStatusEnum.completed;
      model.fileId = event.body.fileId;
      model.thumbnailUrl = event.body.thumbnailUrl;

    } else if (event.type === HttpEventType.User) { // Upload failed

      uploadStatus = UploadStatusEnum.failed;
    }

    model.progressPercentage = progressPercentage;
    model.status = uploadStatus;

    return model;
  }
}
