import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { FormComponentAbstract } from '../../shared/component/form/form-component.abstract';
import { AgendaModel } from '../../shared/model/agenda.model';
import { AgendaOptionsInterface } from '../../shared/interface/agenda-options.interface';
import { PermissionEnum } from '../../shared/enum/permission.enum';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { AgendaModelRequiredAdapterStrategy } from '../../core/shared/agenda/agenda-model-required-adapter.strategy';

@Component({
  selector: 'app-agenda-form-required',
  templateUrl: './agenda-form-required.component.html',
  styleUrls: ['./agenda-form-required.component.scss'],
})
export class AgendaFormRequiredComponent extends FormComponentAbstract<
  AgendaModel,
  AgendaOptionsInterface
> implements OnChanges {

  /**
   * Constants
   */
  readonly CALENDAR_URL: string = 'https://www.google.com/calendar/embed?wkst=1&src=';

  /**
   * Permissions
   */
  @Input() permissions: PermissionEnum[] = [];

  /**
   * Feature
   */
  @Input() feature: RuntimeFeatureInterface;

  /**
   * DOM element
   */
  @ViewChild('iframe', { static: true }) iframeElementRef: ElementRef;

  /**
   * Calendar iframe src
   */
  calendarIframeSrc: SafeHtml;

  /**
   * @inheritDoc
   */
  constructor(
    protected formBuilder: FormBuilder,
    protected modelAdapterStrategy: AgendaModelRequiredAdapterStrategy,
    private domSanitizer: DomSanitizer,
    private clipboardService: ClipboardService,
  ) {

    super(formBuilder, modelAdapterStrategy);
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (this.iframeElementRef) {

      this.iframeElementRef.nativeElement.style.opacity = 0;
    }

    // Update iframe src
    this.calendarIframeSrc = this.domSanitizer.bypassSecurityTrustResourceUrl(this.CALENDAR_URL + this.model.calendarId);
  }

  /**
   * Iframe loaded
   */
  onLoadIframe(): void {

    this.iframeElementRef.nativeElement.style.opacity = 1;
  }

  /**
   * Clicked on copy button
   */
  onClickButtonCopy(): void {

    // Copy calendar export link to clipboard
    this.clipboardService.copy(this.model.calendarExportLink);
  }
}
