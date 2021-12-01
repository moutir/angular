import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-group-activity',
  templateUrl: './group-activity.component.html',
  styleUrls: ['group-activity.component.scss'],
})
export class GroupActivityComponent {

  @Input() data: any;
}
