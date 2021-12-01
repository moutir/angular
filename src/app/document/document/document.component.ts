import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { DocumentModel } from '../../shared/model/document.model';
import { ConfirmService } from '../../core/shared/confirm.service';
import { DocumentInputInterface } from '../../shared/interface/document-input.interface';
import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { DocumentModelAdapterStrategy } from '../shared/document-model-adapter.strategy';
import { OptionInterface } from '../../shared/interface/option.interface';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { Dictionary } from '../../shared/class/dictionary';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';
import { RuntimeService } from '../../runtime/shared/runtime.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent extends FormComponentAbstract<
  DocumentModel,
  Dictionary<OptionInterface[]>
> {

  /**
   * Size in bytes
   */
  private static SIZE_KB: number = 1024;
  private static SIZE_MB: number = 1048576;
  private static SIZE_GB: number = 1073741824;

  /**
   * List of inputs
   */
  @Input() inputs: DocumentInputInterface[] = [];

  /**
   * Is the document a placeholder ?
   */
  @Input() isPlaceholder: boolean = false;

  /**
   * Is the document read only ?
   */
  @Input() isReadOnly: boolean = true;

  /**
   * Constructor
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: DocumentModelAdapterStrategy,
    private translateService: TranslateService,
    private confirmService: ConfirmService,
    private runtimeService: RuntimeService,
    private clipboard: ClipboardService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  protected build(): void {

    // Set model if not available
    if (!this.model) {

      this.model = new DocumentModel();
      this.inputs.forEach(input => this.model.data[input.name] = input.default);
    }

    super.build();
  }

  /**
   * Returns the document file extension
   */
  getExtension(document: DocumentModel): string {

    return document.name.split('.').pop().toUpperCase();
  }

  /**
   * Returns the document file size label
   */
  getSize(document: DocumentModel): string {

    // Size in KB
    if (document.size < DocumentComponent.SIZE_MB) {

      return this.translateService.instant(
        'label_size_kb',
        { size: Math.round(document.size / DocumentComponent.SIZE_KB * 10) / 10 },
        );
    }

    // Size in MB
    if (document.size < DocumentComponent.SIZE_GB) {

      return this.translateService.instant(
        'label_size_mb',
        { size: Math.round(document.size / DocumentComponent.SIZE_MB * 10) / 10 },
        );
    }

    // Size in GB
    return this.translateService.instant(
      'label_size_gb',
      { size: Math.round(document.size / DocumentComponent.SIZE_GB * 10) / 10 },
    );
  }

  /**
   * Clicked on the button to copy URL
   */
  onClickButtonCopy(url: string): void {

    this.clipboard.copy(url);

    this.runtimeService.notification(NotificationTypeEnum.success, 'copied_to_clipboard');
  }

  /**
   * Clicked the delete button
   */
  onClickButtonDelete(document: DocumentModel): void {

    // Readonly
    if (this.isDisabled !== false) {

      return;
    }

    // Confirm message
    this
      .confirmService
      .message('confirm_remove_document')
      .pipe(take(1))
      .subscribe(isConfirmed => this.setValue('isRemoved', isConfirmed));
  }
}
