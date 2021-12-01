import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { PhalconHttpService } from '../../api/http/phalcon-http.service';
import { ApiEndpointEnum } from '../../shared/enum/api-endpoint.enum';
import { DateFilterModel } from './date-filter.model';
import { DashboardState } from './dashboard.state';
import { SummaryModel } from './summary.model';
import { DashboardTransactionFilterInterface } from '../../shared/interface/dashboard-transaction-filter.interface';
import { FilterRequestInterface } from '../../api/shared/dashboard/filter-request.interface';
import { PipelineListResponseInterface } from '../../api/shared/dashboard/pipeline-list-response.interface';
import { PipelineUpdateRequestInterface } from '../../api/shared/dashboard/pipeline-update-request.interface';
import { MandateSummaryResponseInterface } from '../../api/shared/dashboard/mandate-summary-response.interface';
import { PropertyLocationListResponseInterface } from '../../api/shared/dashboard/property-location-list-response.interface';
import { SummaryResponseInterface } from '../../api/shared/dashboard/summary-response.interface';
import { PropertyChartResponseInterface } from '../../api/shared/dashboard/property-chart-response.interface';
import { BuyerChartResponseInterface } from '../../api/shared/dashboard/buyer-chart-response.interface';
import { PropertyTypeChartResponseInterface } from '../../api/shared/dashboard/property-type-chart-response.interface';
import { BudgetChartResponseInterface } from '../../api/shared/dashboard/budget-chart-response.interface';
import { MyProductionTableResponseInterface } from '../../api/shared/dashboard/my-production-table-response.interface';
import { MyEffortTableResponseInterface } from '../../api/shared/dashboard/my-effort-table-response.interface';
import { AgentProductionTableResponseInterface } from '../../api/shared/dashboard/agent-production-table-response.interface';
import { AgentEffortTableResponseInterface } from '../../api/shared/dashboard/agent-effort-table-response.interface';
import { AgentProductionChartResponseInterface } from '../../api/shared/dashboard/agent-production-chart-response.interface';
import { AgentProductionChartRequestInterface } from '../../api/shared/dashboard/agent-production-chart-request.interface';
import { DateFilterLoadResponseInterface } from '../../api/shared/dashboard/date-filter-load-response.interface';
import { PropertyTransactionListRequestInterface } from '../../api/shared/dashboard/property-transaction-list-request.interface';
import { PropertyTransactionListResponseInterface } from '../../api/shared/dashboard/property-transaction-list-response.interface';
import { PropertyTransactionSummaryRequestInterface } from '../../api/shared/dashboard/property-transaction-summary-request.interface';
import { PropertyTransactionSummaryResponseInterface } from '../../api/shared/dashboard/property-transaction-summary-response.interface';
import { SummaryByIdResponseInterface } from '../../api/shared/contact/summary-by-id-response.interface';
import { BrokerListResponseInterface } from '../../api/shared/contact/broker-list-response.interface';
import { SummaryByIdResponseInterface as PropertySummaryByIdResponseInterface } from '../../api/shared/property/summary-by-id-response.interface';
import { AutocompleteActiveRequestInterface } from '../../api/shared/contact/autocomplete-active-request.interface';
import { AutoCompleteActiveResponseInterface } from '../../api/shared/contact/autocomplete-active-response.interface';
import { PropertySearchRequestInterface } from '../../api/shared/mailbox/property-search-request.interface';
import { PropertySearchResponseInterface } from '../../api/shared/mailbox/property-search-response.interface';
import { DateFilterUpdateRequestInterface } from '../../api/shared/dashboard/date-filter-update-request.interface';
import { TokenInputSuggestionInterface } from '../../shared/interface/token-input-suggestion.interface';

@Injectable()
export class DashboardApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load pipeline
   */
  loadPipeline(state: DashboardState): Observable<PipelineListResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, PipelineListResponseInterface>(
        ApiEndpointEnum.dashboardPipelineList,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Update pipeline
   */
  updatePipeline(contactId: string, stageId: string): Observable<null> {

    return this
      .httpService
      .get<PipelineUpdateRequestInterface, null>(
        ApiEndpointEnum.dashboardPipelineUpdate,
        {
          contact_id: contactId,
          stage_id: stageId,
        },
      );
  }

  /**
   * Load mandate summary
   */
  loadMandateSummary(state: DashboardState): Observable<MandateSummaryResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, MandateSummaryResponseInterface>(
        ApiEndpointEnum.dashboardMandateSummary,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load property location list
   */
  loadPropertyLocationList(state: DashboardState): Observable<PropertyLocationListResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, PropertyLocationListResponseInterface>(
        ApiEndpointEnum.dashboardPropertyLocationList,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load summary
   */
  loadSummary(state: DashboardState): Observable<SummaryModel> {

    return this.httpService
      .get<FilterRequestInterface, SummaryResponseInterface>(
        ApiEndpointEnum.dashboardSummary,
        this.convertToFilterRequest(state),
      )
      .pipe(
        map(response => this.convertToSummaryModel(response)),
      );
  }

  /**
   * Load property chart
   */
  loadPropertyChart(state: DashboardState): Observable<PropertyChartResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, PropertyChartResponseInterface>(
        ApiEndpointEnum.dashboardPropertyChart,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load buyer chart
   */
  loadBuyerChart(state: DashboardState): Observable<BuyerChartResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, BuyerChartResponseInterface>(
        ApiEndpointEnum.dashboardBuyerChart,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load property type chart
   */
  loadPropertyTypeChart(state: DashboardState): Observable<PropertyTypeChartResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, PropertyTypeChartResponseInterface>(
        ApiEndpointEnum.dashboardPropertyTypeChart,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load budget chart
   */
  loadBudgetChart(state: DashboardState): Observable<BudgetChartResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, BudgetChartResponseInterface>(
        ApiEndpointEnum.dashboardBudgetChart,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load "my" production table
   */
  loadMyProductionTable(state: DashboardState): Observable<MyProductionTableResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, MyProductionTableResponseInterface>(
        ApiEndpointEnum.dashboardMyProductionTable,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load "my" effort table
   */
  loadMyEffortTable(state: DashboardState): Observable<MyEffortTableResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, MyEffortTableResponseInterface>(
        ApiEndpointEnum.dashboardMyEffortTable,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load agent production table
   */
  loadAgentProductionTable(state: DashboardState): Observable<AgentProductionTableResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, AgentProductionTableResponseInterface>(
        ApiEndpointEnum.dashboardAgentProductionTable,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load agent effort table
   */
  loadAgentEffortTable(state: DashboardState): Observable<AgentEffortTableResponseInterface> {

    return this
      .httpService
      .get<FilterRequestInterface, AgentEffortTableResponseInterface>(
        ApiEndpointEnum.dashboardAgentEffortTable,
        this.convertToFilterRequest(state),
      );
  }

  /**
   * Load agent production chart
   */
  loadAgentProductionChart(state: DashboardState): Observable<AgentProductionChartResponseInterface> {

    const request = this.convertToFilterRequest(state);
    request['seller-type'] = '';

    return this
      .httpService
      .get<AgentProductionChartRequestInterface, AgentProductionChartResponseInterface>(
        ApiEndpointEnum.dashboardAgentProductionChart,
        <AgentProductionChartRequestInterface>request,
      );
  }

  /**
   * Load agent direct margin chart
   */
  loadAgentDirectMarginChart(state: DashboardState): Observable<AgentProductionChartResponseInterface> {

    const request = this.convertToFilterRequest(state);
    request['seller-type'] = 'i';

    return this
      .httpService
      .get<AgentProductionChartRequestInterface, AgentProductionChartResponseInterface>(
        ApiEndpointEnum.dashboardAgentProductionChart,
        <AgentProductionChartRequestInterface>request,
      );
  }

  /**
   * Load broker list // TODO[later] should be in ContactService
   */
  loadBrokerList(): Observable<BrokerListResponseInterface> {

    return this.httpService.get<null, BrokerListResponseInterface>(ApiEndpointEnum.contactBrokerList);
  }

  /**
   * Load date filter
   */
  loadDateFilter(): Observable<DateFilterLoadResponseInterface> {

    return this.httpService.get<null, DateFilterLoadResponseInterface>(ApiEndpointEnum.dashboardDateFilterLoad);
  }

  /**
   * Load property transaction list
   */
  loadPropertyTransactionList(
    state: DashboardState,
    filters: DashboardTransactionFilterInterface,
    isContractMvp: boolean,
  ): Observable<PropertyTransactionListResponseInterface> {

    // Merge filters with state
    const request: PropertyTransactionListRequestInterface = {
      ...filters,
      ...this.convertToFilterRequest(state),
    };

    const endpoint = isContractMvp ?
      ApiEndpointEnum.dashboardPropertyTransactionListContractMvp : ApiEndpointEnum.dashboardPropertyTransactionList;

    return this
      .httpService
      .get<PropertyTransactionListRequestInterface, PropertyTransactionListResponseInterface>(endpoint, request);
  }

  /**
   * Load property transaction summary
   */
  loadPropertyTransactionSummary(
    state: DashboardState,
    filter: DashboardTransactionFilterInterface,
    isContractMvp: boolean,
  ): Observable<PropertyTransactionSummaryResponseInterface> {

    // Merge filter with state
    const request = {
      ...filter,
      ...this.convertToFilterRequest(state),
    };

    const endpoint = isContractMvp ?
      ApiEndpointEnum.dashboardPropertyTransactionSummaryContractMvp : ApiEndpointEnum.dashboardPropertyTransactionSummary;

    return this
      .httpService
      .get<PropertyTransactionSummaryRequestInterface, PropertyTransactionSummaryResponseInterface>(endpoint, request);
  }

  /**
   * Load contact summary // TODO[later] To be moved in ContactService
   */
  loadContactSummary(id: string): Observable<SummaryByIdResponseInterface> {

    return this
      .httpService
      .get<null, SummaryByIdResponseInterface>(ApiEndpointEnum.contactSummaryById, null, { id });
  }

  /**
   * Load property summary // TODO[later] To be moved in PropertyService
   */
  loadPropertySummary(id: string): Observable<PropertySummaryByIdResponseInterface> {

    return this
      .httpService
      .get<null, PropertySummaryByIdResponseInterface>(ApiEndpointEnum.propertySummaryById, null, { id });
  }

  /**
   * Load autocomplete suggestions // TODO[later] To be moved in ContactService
   */
  loadAutocompleteSuggestions(keyword: string): Observable<TokenInputSuggestionInterface[]> {

    if (!keyword) {

      return of([]);
    }

    const request: AutocompleteActiveRequestInterface = {
      query: keyword,
    };

    return this
      .httpService
      .get<AutocompleteActiveRequestInterface, AutoCompleteActiveResponseInterface>(
        ApiEndpointEnum.contactAutocompleteActive,
        request,
      )
      .pipe(
        map(json => json.suggestions),
      );
  }

  /**
   * Get list of emailing properties // TODO[later] To be moved in PropertyService
   */
  loadEmailProperties(keyword: string): Observable<PropertySearchResponseInterface> {

    if (!keyword) {

      return of([]);
    }

    const request: PropertySearchRequestInterface = {
      q: keyword,
    };

    return this
      .httpService
      .get<PropertySearchRequestInterface, PropertySearchResponseInterface>(
        ApiEndpointEnum.mailboxPropertySearch,
        request,
      );
  }

  /**
   * Store date filter
   */
  storeDateFilter(dateFilter: DateFilterModel): Observable<null> {

    return this
      .httpService
      .get<DateFilterUpdateRequestInterface, null>(
        ApiEndpointEnum.dashboardDateFilterUpdate, {
          date: dateFilter.year,
          month: String(dateFilter.month),
        },
      );
  }

  /**
   * Convert state into filter request
   */
  private convertToFilterRequest(state: DashboardState): FilterRequestInterface {

    return {
      brokers: state.brokerIds.join(','),
      transaction_type_id: state.transactionTypeId,
      broker_type_id: state.brokerTypeId,
      client_type_id: state.contactTypeId,
    };
  }

  /**
   * Convert response to a summary model
   */
  private convertToSummaryModel(response: SummaryResponseInterface): SummaryModel {

    const summary = new SummaryModel();

    summary.dealSignedCount = response.deals_signed || 0;
    summary.leadCount = response.leads || 0;
    summary.offerReceivedCount = response.offers_recieved || 0;
    summary.productionCount = response.production || 0;
    summary.proposalSentCount = response.proposals_sent || 0;
    summary.targetCount = response.target || 0;
    summary.viewingCount = response.viewings || 0;

    return summary;
  }
}
