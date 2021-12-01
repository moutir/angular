import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { StateInterface } from '../../../core-store/state.interface';
import { PageServiceAbstract } from '../../../shared/service/page.service.abstract';
import { ContactModel } from '../../../shared/model/contact.model';
import { RuntimeService } from '../../../runtime/shared/runtime.service';
import { ContactService } from './contact.service';
import { ContactConfig } from './contact.config';
import { ContactOptionsInterface } from '../../../shared/interface/contact-options.interface';
import { selectDataOptions } from '../../../core-store/data-runtime/selectors';
import { RuntimeOptionsInterface } from '../../../shared/interface/runtime-options.interface';

@Injectable()
export class ContactPageService extends PageServiceAbstract<ContactModel, ContactOptionsInterface> {

  /**
   * Constructor
   */
  constructor(
    protected store$: Store<StateInterface>,
    protected runtimeService: RuntimeService,
    protected router: Router,
    protected moduleConfig: ContactConfig,
    protected modelService: ContactService,
  ) {

    super(
      store$,
      runtimeService,
      router,
      moduleConfig,
      modelService,
    );
  }

  /**
   * @inheritDoc
   */
  protected getSelectorOptions(): MemoizedSelector<StateInterface, ContactOptionsInterface> {

    return createSelector(
      selectDataOptions,
      (
        options: RuntimeOptionsInterface,
      ): ContactOptionsInterface => {

        return <ContactOptionsInterface>{
          language: options.languageCommunication,
          homePage: options.homePage,
          menuDisplay: options.menuDisplay,
          title: options.contactTitle,
          greeting: options.contactGreeting,
          country: options.countryById,
          nationality: options.nationality,
          maritalStatus: options.maritalStatus,
          children: options.children,
          pipelineStage: options.pipelineStage,
          socialMedia: options.socialMedia,
          accountType: options.accountType,
        };
      },
    );
  }
}
