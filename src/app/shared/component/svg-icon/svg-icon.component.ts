import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-svg-icon',
  styleUrls: ['./svg-icon.component.scss'],
  template: '<svg><use attr.xlink:href="/dist/assets/realforce/icons.svg#{{icon}}"></use></svg>',
})
export class SvgIconComponent {

  /**
   * Icon ID
   */
  @Input() icon: string;

}
