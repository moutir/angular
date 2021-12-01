import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { MatchingGroupRoutingModule } from './matching-group-routing.module';
import { MatchingGroupFormSearchComponent } from './matching-group-form-search/matching-group-form-search.component';
import { MatchingGroupSearchlistComponent } from './matching-group-searchlist/matching-group-searchlist.component';
import { MatchingGroupTableRowComponent } from './matching-group-table-row/matching-group-table-row.component';
import { MatchingGroupModalProposalComponent } from './matching-group-modal-proposal/matching-group-modal-proposal.component';
import { MatchingGroupModalConfirmComponent } from './matching-group-modal-confirm/matching-group-modal-confirm.component';
import { MatchingGroupPageListComponent } from './matching-group-page-list/matching-group-page-list.component';

@NgModule({
  imports: [
    SharedModule,
    MatchingGroupRoutingModule,
  ],
  declarations: [
    MatchingGroupFormSearchComponent,
    MatchingGroupSearchlistComponent,
    MatchingGroupTableRowComponent,
    MatchingGroupModalProposalComponent,
    MatchingGroupModalConfirmComponent,
    MatchingGroupPageListComponent,
  ],
})
export class MatchingGroupModule {

}
