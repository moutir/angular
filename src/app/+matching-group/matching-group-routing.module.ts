import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchingGroupPageListComponent } from './matching-group-page-list/matching-group-page-list.component';

const routes: Routes = [
  {
    path: '',
    component: MatchingGroupPageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchingGroupRoutingModule {

}
