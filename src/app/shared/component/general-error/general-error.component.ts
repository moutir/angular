import { Component, Input } from '@angular/core';

import { GeneralErrorInterface } from '../../interface/general-error.interface';

@Component({
  selector: 'app-shared-general-error',
  templateUrl: './general-error.component.html',
  styleUrls: ['./general-error.component.scss'],
})
export class GeneralErrorComponent {

  /**
   * Array of errors
   */
  @Input() error: GeneralErrorInterface[] = [];
}
