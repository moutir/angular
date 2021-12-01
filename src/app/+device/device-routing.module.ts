import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DevicePageListComponent } from './device-page-list/device-page-list.component';

const routes: Routes = [
  {
    path: '',
    component: DevicePageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceRoutingModule {

}
