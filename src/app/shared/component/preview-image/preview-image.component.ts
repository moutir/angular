import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-preview-image',
  templateUrl: './preview-image.component.html',
  styleUrls: ['./preview-image.component.scss'],
})
export class PreviewImageComponent {

  /**
   * Image URL to preview
   */
  @Input() url: string;
}
