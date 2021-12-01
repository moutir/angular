import { DnsRecordRuleType } from '../../../shared/type/dns-record-rule.type';
import { DnsRecordInterface } from '../../../shared/interface/dns-record.interface';

export interface DnsListResponseInterface {
  count: number;
  domains: Array<{
    authDate: string;
    domain: string;
    id: string;
    lastCheckDate: string;
    lastValidDate: string;
    sendgridId: string;
    valid: boolean;
    records: Partial<Record<DnsRecordRuleType, DnsRecordInterface>>
  }>;
}
