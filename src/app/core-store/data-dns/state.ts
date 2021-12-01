import { DnsModel } from '../../shared/model/dns.model';
import { DataStateInterface } from '../data-state.interface';

export const FEATURE_NAME = 'data-dns';

export interface DataDnsStateInterface extends DataStateInterface<DnsModel> {

}

export const initialState: DataDnsStateInterface = {
  models: {},
};
