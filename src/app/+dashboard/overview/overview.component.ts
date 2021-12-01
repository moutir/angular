import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TabType } from '../shared/tab.type';
import { RuntimeService } from '../../runtime/shared/runtime.service';
import { RuntimeFeatureInterface } from '../../shared/interface/runtime-feature.interface';
import { RuntimeOptionsInterface } from '../../shared/interface/runtime-options.interface';

@Component({
  selector: 'app-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['overview.component.scss'],
})
export class OverviewComponent implements OnInit {

  /**
   * Active tab
   */
  tabActive: TabType;

  /**
   * State observable
   */
  feature$: Observable<RuntimeFeatureInterface>;
  options$: Observable<RuntimeOptionsInterface>;

  /**
   * Constructor
   */
  constructor(
    private runtimeService: RuntimeService,
  ) {

  }

  /**
   * Initialized component
   */
  ngOnInit(): void {

    // Default values
    this.tabActive = 'summary';

    // State observables
    this.feature$ = this.runtimeService.selectFeature();
    this.options$ = this.runtimeService.selectOptions();
  }

  /**
   * Clicked on a tab
   */
  onClickTab(tab: TabType): void {

    this.tabActive = tab;
  }
}
