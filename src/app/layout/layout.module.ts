import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { LegacyComponent } from './legacy/legacy.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutStore } from './shared/layout.store';
import { LayoutService } from './shared/layout.service';
import { UserSwitchComponent } from '../authentication/user-switch/user-switch.component';
import { LayoutConfig } from './layout.config';
import { CountStore } from './shared/count.store';
import { SidenavUserSwitchComponent } from './sidenav-user-switch/sidenav-user-switch.component';
import { SidenavSearchComponent } from './sidenav-search/sidenav-search.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    NavigationComponent,
    LegacyComponent,
    UserSwitchComponent,
    SidenavUserSwitchComponent,
    SidenavSearchComponent,
  ],
  declarations: [
    HeaderComponent,
    NavigationComponent,
    LegacyComponent,
    UserSwitchComponent,
    SidenavUserSwitchComponent,
    SidenavSearchComponent,
  ],
  providers: [
    LayoutStore,
    LayoutService,
    LayoutConfig,
    CountStore,
  ],
})
export class LayoutModule {

}
