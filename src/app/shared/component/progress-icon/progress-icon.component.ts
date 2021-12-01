import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-progress-icon',
  templateUrl: './progress-icon.component.html',
  styleUrls: ['./progress-icon.component.scss'],
})
export class ProgressIconComponent {

  /**
   * Current percentage
   */
  @Input() percentage: number = 0;

  /**
   * Return the bar level used for coloration
   */
  getBarLevel(): number {

    return Math.floor(this.percentage / 25);
  }
}
