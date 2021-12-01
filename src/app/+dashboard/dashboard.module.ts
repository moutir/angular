import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { StagePipe } from './shared/stage.pipe';
import { OverviewComponent } from './overview/overview.component';
import { BuyersComponent } from './buyers/buyers.component';
import { ProfileComponent } from './profile/profile.component';
import { PipelineComponent } from './pipeline/pipeline.component';
import { MandatesTabComponent } from './tab-mandates/tab-mandates.component';
import { TabProductionComponent } from './tab-production/tab-production.component';
import { PropertiesComponent } from './properties/properties.component';
import { ProductionMyComponent } from './production-my/production-my.component';
import { TabSummaryComponent } from './tab-summary/tab-summary.component';
import { GroupActivityComponent } from './group-activity/group-activity.component';
import { DashboardComponent } from './dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { LeadsPortfolioComponent } from './leads-portfolio/leads-portfolio.component';
import { ProductionAgentComponent } from './production-agent/production-agent.component';
import { BrokersComponent } from './brokers/brokers.component';
import { TabTransactionsComponent } from './tab-transactions/tab-transactions.component';
import { DashboardApiService } from './shared/dashboard-api.service';
import { DashboardStore } from './shared/dashboard.store';
import { ExpandingTableComponent } from './expanding-table/expanding-table.component';
import { CurrencyFormatterDirective } from './shared/currency-formatter.directive';
import { CurrencyPipe } from './shared/currency.pipe';
import { FilterComponent } from './filter/filter.component';
import { MapComponent } from './map/map.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { MultiselectComponent } from './multiselect/multiselect.component';
import { ClickOutsideDirective } from './shared/click-outside.directive';
import { TotalTableComponent } from './total-table/total-table.component';
import { OrderByPipe } from './shared/order-by.pipe';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { BarLeadsComponent } from './bar-leads/bar-leads.component';
import { ListItemPipe } from './shared/list-item.pipe';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DashboardConfig } from './dashboard.config';
import { DashboardWidgetTodolistComponent } from './dashboard-widget-todolist/dashboard-widget-todolist.component';
import { DashboardWidgetSuggestionComponent } from './dashboard-widget-suggestion/dashboard-widget-suggestion.component';

@NgModule({
  imports: [
    SharedModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DashboardComponent,
    PipelineComponent,
    GroupActivityComponent,
    OverviewComponent,
    ProfileComponent,
    MandatesTabComponent,
    PropertiesComponent,
    BuyersComponent,
    LeadsPortfolioComponent,
    TabProductionComponent,
    ProgressComponent,
    ProductionMyComponent,
    TabSummaryComponent,
    ProductionAgentComponent,
    StagePipe,
    BrokersComponent,
    TabTransactionsComponent,
    BarLeadsComponent,
    MapComponent,
    LineChartComponent,
    DoughnutChartComponent,
    TotalTableComponent,
    PreloaderComponent,
    MultiselectComponent,
    ClickOutsideDirective,
    ExpandingTableComponent,
    FilterComponent,
    OrderByPipe,
    ListItemPipe,
    CurrencyFormatterDirective,
    CurrencyPipe,
    ExpandingTableComponent,
    FilterComponent,
    DashboardWidgetTodolistComponent,
    DashboardWidgetSuggestionComponent,
  ],
  providers: [
    DashboardConfig,
    DashboardApiService,
    DashboardStore,
    CurrencyPipe,
  ],
})
export class DashboardModule {

}
