import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgendaPageWriteComponent } from './agenda-page-write/agenda-page-write.component';

const routes: Routes = [
  {
    path: '',
    component: AgendaPageWriteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendaRoutingModule {

}
