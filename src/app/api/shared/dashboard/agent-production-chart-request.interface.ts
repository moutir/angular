import { FilterRequestInterface } from './filter-request.interface';

export interface AgentProductionChartRequestInterface extends FilterRequestInterface {
  'seller-type': string;
}
