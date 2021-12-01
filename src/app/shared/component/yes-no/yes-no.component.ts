import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss'],
})
export class YesNoComponent {

  /**
   * Is yes (true) or no (false) ?
   */
  @Input() isYes: boolean = false;

  /**
   * Label for this.isYes === true
   */
  @Input() labelYes: string = 'label_yes';

  /**
   * Label for this.isYes === false
   */
  @Input() labelNo: string = 'label_no';

}
