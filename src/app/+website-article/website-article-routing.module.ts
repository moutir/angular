import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WebsiteArticleComponent } from './website-article.component';
import { WebsiteArticlePageListComponent } from './website-article-page-list/website-article-page-list.component';
import { WebsiteArticlePageWriteComponent } from './website-article-page-write/website-article-page-write.component';
import { WebsiteArticlePageReadComponent } from './website-article-page-read/website-article-page-read.component';
import { CanDeactivateRouteGuard } from '../core/shared/can-deactivate.route-guard';

const routes: Routes = [
  {
    path: '',
    component: WebsiteArticleComponent,
    children: [
      {
        path: 'add',
        component: WebsiteArticlePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: ':id',
        component: WebsiteArticlePageReadComponent,
      },
      {
        path: ':id/edit',
        component: WebsiteArticlePageWriteComponent,
        canDeactivate: [CanDeactivateRouteGuard],
      },
      {
        path: '',
        component: WebsiteArticlePageListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteArticleRoutingModule {

}
