import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss'],
})
export class StarsComponent {

  /**
   * Total number of stars
   */
  @Input() total: number = 0;

  /**
   * Current number of stars
   */
  @Input() current: number = 0;

}
