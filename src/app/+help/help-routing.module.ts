import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HelpPageReadComponent } from './help-page-read/help-page-read.component';

const routes: Routes = [
  {
    path: '',
    component: HelpPageReadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpRoutingModule {

}
