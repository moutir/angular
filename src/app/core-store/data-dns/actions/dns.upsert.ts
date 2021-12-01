import { FEATURE_NAME } from '../state';
import { DnsModel } from '../../../shared/model/dns.model';
import { UpsertAbstract } from '../../upsert.abstract';
import { DataStateInterface } from '../../data-state.interface';

export class DnsUpsert extends UpsertAbstract<DnsModel, DataStateInterface<DnsModel>> {
  static readonly TYPE: string = FEATURE_NAME + ': upsert';
  readonly type: string = DnsUpsert.TYPE;
}
