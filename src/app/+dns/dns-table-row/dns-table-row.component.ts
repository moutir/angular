import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { TableRowComponentAbstract } from '../../shared/component/table-row/table-row-component.abstract';
import { DnsModel } from '../../shared/model/dns.model';
import { DnsRecordInterface } from '../../shared/interface/dns-record.interface';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';

@Component({
  selector: 'app-dns-table-row',
  templateUrl: './dns-table-row.component.html',
  styleUrls: ['./dns-table-row.component.scss'],
})
export class DnsTableRowComponent extends TableRowComponentAbstract implements OnChanges {

  /**
   * Dns domain record to display
   */
  @Input() dnsRecord: DnsModel = new DnsModel();

  /**
   * DNS records
   */
  dnsRecords: DnsRecordInterface[] = [];

  /**
   * Constructor
   */
  constructor(
    private clipboardService: ClipboardService,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  protected getModel(): DnsModel {

    return this.dnsRecord;
  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.dnsRecord) {

      this.dnsRecords = Object.values(this.dnsRecord.records);
    }
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text: string): void {

    this.clipboardService.copy(text);
  }

  /**
   * Clicked on host copy button
   */
  onClickCopyHost(host: string): void {

    this.copyToClipboard(host);
  }
}
