import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BrowserService } from '../../core/shared/browser/browser.service';
import { AgencyModel } from '../../shared/model/agency.model';

@Component({
  selector: 'app-mls-agency-panel',
  templateUrl: './mls-agency-panel.component.html',
  styleUrls: ['./mls-agency-panel.component.scss'],
})
export class MlsAgencyPanelComponent implements OnChanges {

  /**
   * Agency model
   */
  @Input() agency: AgencyModel = new AgencyModel();

  /**
   * Is it a placeholder ?
   */
  @Input() isPlaceholder: boolean = true;

  /**
   * Agency website URL
   */
  websiteUrl: string = '';

  /**
   * Constructor
   */
  constructor(
    private browserService: BrowserService,
  ) {

  }

  /**
   * Changed component input(s)
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.agency && changes.agency.currentValue.socials && this.agency.socials.length > 0) {

      this.websiteUrl = this.agency.socials.find(social => social.network === 'website').url;
    }
  }

  /**
   * Clicked on social media button
   */
  onClickButtonUrl(event: MouseEvent, url: string): void {

    event.stopPropagation();

    // URL does not start by 'http' or '//'
    if (url.indexOf('http') === -1 && url.indexOf('//') === -1) {

      url = '//' + url;
    }

    this.browserService.blank(url);
  }
}
