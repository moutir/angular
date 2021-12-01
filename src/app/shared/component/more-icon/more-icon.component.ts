import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-more-icon',
  templateUrl: './more-icon.component.html',
  styleUrls: ['./more-icon.component.scss'],
})
export class MoreIconComponent {

  /**
   * Total count
   */
  @Input() count: number = 0;

  /**
   * Maximum limit
   */
  @Input() max: number = 0;

  /**
   * Has background color
   */
  @Input() hasBackground: boolean = true;

  /**
   * Has margin bottom
   */
  @Input() hasMarginBottom: boolean = false;
}
