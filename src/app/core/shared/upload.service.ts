import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { StateInterface } from '../../core-store/state.interface';
import { UploadEventUpload } from '../../core-store/ui-upload/actions/upload-event-upload';
import {
  selectDataByUploaderId,
  selectDataUpload,
  selectDataUploadList,
  selectDataUploadsProgressing,
} from '../../core-store/data-upload/selectors';
import { UploadModel } from '../../shared/model/upload.model';
import { UploadEventCancel } from '../../core-store/ui-upload/actions/upload-event-cancel';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { UploadEventCancelAll } from '../../core-store/ui-upload/actions/upload-event-cancel-all';
import { UploadEventToggleStatusBar } from '../../core-store/ui-upload/actions/upload-event-toggle-status-bar';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { selectUiIsFoldedStatusBar, selectUiUploads } from '../../core-store/ui-upload/selectors';
import { UploadInterface } from '../../shared/interface/upload.interface';
import { Dictionary } from '../../shared/class/dictionary';

@Injectable()
export class UploadService {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Select uploads by UID
   */
  selectUploads(uid: string): Observable<UploadModel[]> {

    return this.store$.select(selectUiUploads(uid));
  }

  /**
   * Select all uploads as array
   */
  selectUploadList(): Observable<UploadModel[]> {

    return this.store$.select(selectDataUploadList);
  }

  /**
   * Select status bar fold/unfold status
   */
  selectIsFoldedStatusBar(): Observable<boolean> {

    return this.store$.select(selectUiIsFoldedStatusBar);
  }

  /**
   * Select upload data
   */
  selectDataUpload(uid: string): Observable<UploadModel> {

    return this.store$.select(selectDataUpload(uid));
  }

  /**
   * Select uploader ID data
   */
  selectDataByUploaderId(): Observable<Dictionary<string[]>> {

    return this.store$.select(selectDataByUploaderId);
  }

  /**
   * Select upload data progressing
   */
  selectDataUploadsProgressing(): Observable<UploadModel[]> {

    return this.store$.select(selectDataUploadsProgressing);
  }

  /**
   * Notification regarding uploads
   */
  notification(type: NotificationTypeEnum, message: string): void {

    this.runtimeService.notification(type, message);
  }

  /**
   * Returns generated UID from file
   */
  generateFileUid(file: File): string {

    return [
      (file.name || '').replace(/\s/g, '_'),
      file.type,
      file.size,
      file.lastModified,
      (new Date()).getTime(),
    ].join('_');
  }

  /**
   * Upload file
   */
  upload(uploaderUid: string, upload: UploadInterface): void {

    this.store$.dispatch(
      new UploadEventUpload({
        uid: uploaderUid,
        upload: upload,
      }),
    );
  }

  /**
   * Cancel ongoing upload
   */
  cancel(uid: string): void {

    this.store$.dispatch(
      new UploadEventCancel({
        uid,
      }),
    );
  }

  /**
   * Cancel all ongoing uploads
   */
  cancelAll(): void {

    this.store$.dispatch(new UploadEventCancelAll({}));
  }

  /**
   * Toggle status bar fold/unfold
   */
  toggleStatusBar(): void {

    this.store$.dispatch(
      new UploadEventToggleStatusBar({}),
    );
  }
}
