import { ModelAbstract } from '../class/model.abstract';
import { DnsRecordRuleType } from '../type/dns-record-rule.type';
import { DnsRecordInterface } from '../interface/dns-record.interface';

export class DnsModel extends ModelAbstract {
  id: string = '';
  authDate: Date | null = null;
  domain: string = '';
  lastCheckDate: Date | null = null;
  lastValidDate: Date | null = null;
  sendgridId: string = '';
  valid: boolean = false;
  records: Partial<Record<DnsRecordRuleType, DnsRecordInterface>> = {};
}
