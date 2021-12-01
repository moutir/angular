import { Component, Input } from '@angular/core';

import { PropertyModel } from '../../model/property.model';

@Component({
  selector: 'app-shared-preview-property',
  templateUrl: './preview-property.component.html',
  styleUrls: ['./preview-property.component.scss'],
})
export class PreviewPropertyComponent {

  /**
   * Property to preview or null if not available yet
   */
  @Input() property: PropertyModel|null;
}
