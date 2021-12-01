import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { ProductionLoadResponseInterface } from './production-load-response.interface';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { ProductionModel } from '../../../shared/model/production.model';
import { ProductionSaveRequestInterface } from './poroduction-save-request.interface';
import { ProductionTypeEnum } from '../../../shared/enum/production-type.enum';

@Injectable()
export class ProductionApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
  ) {

  }

  /**
   * Load
   */
  load(): Observable<ProductionLoadResponseInterface> {

    return this.httpService.get<null, ProductionLoadResponseInterface>(ApiEndpointEnum.productionLoad);
  }

  /**
   * Save production
   */
  save(model: ProductionModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<ProductionSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.productionSave,
        this.saveRequest(model),
        null,
        true,
      );
  }

  /**
   * Handle a save() request parameters and return a formatted request
   */
  private saveRequest(model: ProductionModel): ProductionSaveRequestInterface {

    const request = {};
    const mapping = {
      commissionRental: 'commission_rental',
      commissionSales: 'commission_sales',
      dealRental: 'deals_rental',
      dealSales: 'deals_sales',
      expenseRental: 'expenses_rental',
      expenseSales: 'expenses_sales',
      productionRental: 'production_rental',
      productionSales: 'production_sales',
      salaryRental: 'salary_rental',
      salarySales: 'salary_sales',
      targetRental: 'target_rental',
      targetSales: 'target_sales',
    };

    Object.keys(model.values).forEach(dateStr => {

      const year = dateStr.split('_')[0];
      const month = dateStr.split('_')[1];

      Object.keys(model.values[dateStr]).forEach(contactId => {

        Object.keys(model.values[dateStr][contactId]).forEach(attr => {

          request[contactId + '[' + year + '][' + month + '][' + mapping[attr] + ']'] = model.values[dateStr][contactId][attr];
        });
      });
    });

    Object.keys(model.contactsByType).forEach(type => {

      const date: Date = model[type + 'Date'];

      if (!date) {

        return;
      }

      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      model.contactsByType[type].forEach(contact => {

        // Monthly
        if (type === ProductionTypeEnum.saleMonthly || type === ProductionTypeEnum.rentalMonthly) {

          Object.keys(contact).forEach(attr => {

            if (!mapping[attr] || mapping[attr].indexOf('target') > -1 || !contact[attr]) {

              return;
            }

            request[contact.id + '[' + year + '][' + month + '][' + mapping[attr] + ']'] = contact[attr];

          });
        }

        // Yearly
        if (type === ProductionTypeEnum.saleYearly || type === ProductionTypeEnum.rentalYearly) {

          Object.keys(contact).forEach(attr => {

            if (!mapping[attr] || mapping[attr].indexOf('target') === -1 || !contact[attr]) {

              return;
            }

            request[contact.id + '[' + year + '][null][' + mapping[attr] + ']'] = contact[attr];

          });
        }
      });
    });

    return request;
  }
}
