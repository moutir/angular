import { Component } from '@angular/core';

import { ModalFooterComponent } from '../../modal/modal-footer/modal-footer.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fisher-modal-footer',
  templateUrl: './fisher-modal-footer.component.html',
  styleUrls: ['./fisher-modal-footer.component.scss'],
})
export class FisherModalFooterComponent extends ModalFooterComponent {

  /**
   * Image host
   */
  host: string = environment.fisher.assets.host;
}
