import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageReadComponentAbstract } from '../../shared/component/page-read/page-read-component.abstract';
import { HelpPageService } from '../../core/shared/help/help-page.service';
import { HelpModel } from '../../shared/model/help.model';
import { Dictionary } from '../../shared/class/dictionary';
import { HelpContentModel } from '../../shared/model/help-content.model';
import { HelpService } from '../../core/shared/help/help.service';
import { ClipboardService } from '../../clipboard/shared/clipboard.service';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { WhoAmIModel } from '../../shared/model/whoami.model';
import { NotificationTypeEnum } from '../../shared/enum/notification-type.enum';

@Component({
  selector: 'app-help-page-read',
  templateUrl: './help-page-read.component.html',
  styleUrls: ['./help-page-read.component.scss'],
})
export class HelpPageReadComponent extends PageReadComponentAbstract<HelpModel, {}>
  implements OnInit, OnDestroy {

  /**
   * Panel UIDs expanded state
   */
  panelUids: Dictionary<boolean> = {};

  /**
   * Help contents
   */
  helpContents: HelpContentModel[] = [];

  /**
   * WhoAmI string
   */
  whoAmI: string = '';

  /**
   * Constructor
   */
  constructor(
    protected pageService: HelpPageService,
    protected activatedRoute: ActivatedRoute,
    private helpService: HelpService,
    private clipboardService: ClipboardService,
    private runtimeService: RuntimeService,
  ) {

    super(
      pageService,
      activatedRoute,
    );
  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    super.ngOnInit();

    this.subscriptions.push(
      this.helpService.whoAmI().subscribe(whoAmIModel => this.onNextWhoAmI(whoAmIModel)),
    );
  }

  /**
   * Return content title
   */
  getTitle(panelId: string): string {

    const content = this.helpContents.find(c => c.id === panelId);

    return content.title;
  }

  /**
   * Is the panel expanded?
   */
  isPanelExpanded(panelId: string): boolean {

    return this.panelUids[panelId];
  }

  /**
   * Clicked on help content link
   */
  onClickLink(panelId: string): void {

    this.panelUids[panelId] = true;
  }

  /**
   * Closed panel
   */
  onClosePanel(panelId: string): void {

    this.panelUids[panelId] = false;
  }

  /**
   * Next who am I model
   */
  onNextWhoAmI(whoAmIModel: WhoAmIModel): void {

    this.whoAmI = [
      '{',
      'data: "' + whoAmIModel.data + '",',
      'hash: "' + whoAmIModel.hash + '"',
      '}',
    ].join('\n');
  }

  /**
   * Clicked on copy button
   */
  onClickCopy(): void {

    this.clipboardService.copy(this.whoAmI);

    this.runtimeService.notification(NotificationTypeEnum.success, 'copied_to_clipboard');
  }

  /**
   * @inheritDoc
   */
  protected onNextModel(model: HelpModel): void {

    this.model = model;

    Object.keys(this.model.contents).forEach(categoryId => {

      this.helpContents = [ ...this.helpContents, ...this.model.contents[categoryId] ];

      this.model.contents[categoryId].forEach(content => {

        this.panelUids[content.id] = false;
      });
    });
  }
}
