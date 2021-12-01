import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MapService } from './shared/map.service';
import { GoogleMapsStrategy } from './shared/strategy/google-maps.strategy';
import { MapComponent } from './map/map.component';
import { MapStrategyAbstract } from './shared/map-strategy.abstract';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MatIconModule,
  ],
  declarations: [
    MapComponent,
  ],
  exports: [
    MapComponent,
  ],
  providers: [
    MapService,
    {
      provide: MapStrategyAbstract,
      useClass: GoogleMapsStrategy,
      deps: [NgZone],
    },
  ],
})
export class MapModule {

}
