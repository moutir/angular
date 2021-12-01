import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Handlebars from 'handlebars/dist/cjs/handlebars';

import { ModalComponentAbstract } from '../../modal/modal/modal-component.abstract';
import { AgencyEmailPreviewInterface } from '../../shared/interface/agency-email-preview.interface';
import { AgencyEmailPreviewDataInterface } from '../../shared/interface/agency-email-preview-data.interface';

@Component({
  selector: 'app-agency-profile-modal-preview',
  templateUrl: './agency-profile-modal-preview.component.html',
  styleUrls: ['./agency-profile-modal-preview.component.scss'],
})
export class AgencyProfileModalPreviewComponent
  extends ModalComponentAbstract<null> implements OnChanges {

  /**
   * Email preview
   */
  @Input() emailPreview: AgencyEmailPreviewInterface;

  /**
   * Preview HTML
   */
  preview: SafeHtml = null;

  /**
   * Constructor
   */
  constructor(
    private domSanitizer: DomSanitizer,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  ngOnChanges(changes: SimpleChanges): void {

    super.ngOnChanges(changes);

    if (changes.emailPreview && this.emailPreview.data) {

      this.onNextPreview(this.emailPreview.data);
    }
  }

  /**
   * Next email preview
   */
  private onNextPreview(preview: AgencyEmailPreviewDataInterface): void {

    const compiled = Handlebars.compile(preview.template);
    const html = compiled(preview.data);

    this.preview = this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
