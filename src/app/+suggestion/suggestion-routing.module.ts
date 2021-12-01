import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SuggestionComponent } from './suggestion.component';
import { SuggestionPageListComponent } from './suggestion-page-list/suggestion-page-list.component';
import { SuggestionPageWriteComponent } from './suggestion-page-write/suggestion-page-write.component';
import { SuggestionPageSearchComponent } from './suggestion-page-search/suggestion-page-search.component';
import { SuggestionPageReadComponent } from './suggestion-page-read/suggestion-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: SuggestionComponent,
    children: [
      {
        path: 'add',
        component: SuggestionPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: 'search',
        component: SuggestionPageSearchComponent,
      },
      {
        path: ':id',
        component: SuggestionPageReadComponent,
      },
      {
        path: ':id/edit',
        component: SuggestionPageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: SuggestionPageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestionRoutingModule {

}
