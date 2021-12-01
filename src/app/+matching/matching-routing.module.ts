import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchingPageListComponent } from './matching-page-list/matching-page-list.component';

const routes: Routes = [
  {
    path: '',
    component: MatchingPageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingRoutingModule {

}
