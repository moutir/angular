import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ProductionModel } from '../../../shared/model/production.model';
import { ModelServiceAbstract } from '../../../shared/service/model-service.abstract';
import { ProductionApiService } from '../../../api/shared/production/production-api.service';
import { Dictionary } from '../../../shared/class/dictionary';
import { ProductionValueInterface } from '../../../shared/interface/production-value.interface';
import { StateInterface } from '../../../core-store/state.interface';
import { ProductionUpdateByFrequency } from '../../../core-store/data-production/actions/production-update-by-frequency';
import { ProductionFrequencyInterface } from '../../../shared/interface/production-frequency.interface';
import { selectDataByFrequency } from '../../../core-store/data-production/selectors';
import { ProductionContactModel } from '../../../shared/model/production-contact.model';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacyParserService } from '../../../api/format/legacy/legacy-parser.service';
import { ProductionConfig } from './production.config';
import { ProductionTypeEnum } from '../../../shared/enum/production-type.enum';
import { ContactModel } from '../../../shared/model/contact.model';

@Injectable()
export class ProductionService extends ModelServiceAbstract<ProductionModel> {

  /**
   * Constructor
   */
  constructor(
    private store$: Store<StateInterface>,
    private productionApiService: ProductionApiService,
    private legacyParserService: LegacyParserService,
    protected moduleConfig: ProductionConfig,
  ) {

    super();
  }

  /**
   * @inheritDoc
   */
  factory(): ProductionModel {

    return new ProductionModel();
  }

  /**
   * Select production by frequency
   */
  selectByFrequency(): Observable<ProductionFrequencyInterface> {

    return this.store$.select(selectDataByFrequency);
  }

  /**
   * Return contacts by frequency
   */
  getContactsByFrequency(
    type: ProductionTypeEnum,
    byFrequency: ProductionFrequencyInterface,
    model: ProductionModel,
  ): ProductionContactModel[] {

    let contacts = [];
    const date = model[type + 'Date'];
    const dateStr = date ? (type.toLowerCase().indexOf('month') > -1 ?
      [date.getFullYear(), (date.getMonth() + 1)].join('_') : date.getFullYear()) : '';

    // No date OR No data available for the date
    if (!date || !(dateStr in byFrequency[type])) {

      contacts = model.contacts.map(contact => {

        const productionContact = new ProductionContactModel();
        productionContact.id = contact.id;
        productionContact.contact = contact.clone<ContactModel>();

        return productionContact;
      });
    }

    // Data available for the date
    if (date && dateStr in byFrequency[type]) {

      model.contacts.forEach(contact => {

        const productionContact = new ProductionContactModel();
        productionContact.id = contact.id;
        productionContact.contact = contact.clone<ContactModel>();

        // Data not available for the contact at the date
        if (!(contact.id in byFrequency[type][dateStr])) {

          contacts.push(productionContact);

          return;
        }

        const productionValue = byFrequency[type][dateStr][contact.id];

        Object.keys(productionValue).forEach(attr => {

          productionContact[attr] = byFrequency[type][dateStr][contact.id][attr];
        });

        contacts.push(productionContact);
      });
    }

    return contacts;
  }

  /**
   * @inheritDoc
   */
  load(): Observable<ProductionModel> {

    return this
      .productionApiService
      .load()
      .pipe(
        map(response => {

          const availabilityPerType = {};
          const values: Dictionary<Dictionary<ProductionValueInterface>> = {};
          const byFrequency = {
            saleMonthly: {},
            saleYearly: {},
            rentalMonthly: {},
            rentalYearly: {},
          };

          const model = new ProductionModel();
          model.id = 'admin';
          model.saleYearlyDate = new Date();
          model.saleMonthlyDate = new Date();
          model.rentalYearlyDate = new Date();
          model.rentalMonthlyDate = new Date();

          // Contacts
          Object.keys(response.colleagues || {}).forEach(contactId => {

            const contact = new ProductionContactModel();
            contact.id = contactId;
            contact.contact.id = contactId;
            contact.contact.fullName = response.colleagues[contactId];

            model.contacts.push(contact);
          });

          // Values
          Object.keys(response.production || {}).forEach(contactId => {

            Object.keys(response.production[contactId] || {}).forEach(year => {

              Object.keys(response.production[contactId][year] || {}).forEach(month => {

                const data = response.production[contactId][year][month];
                const key = [year, month].join('_');

                if (!values[key]) {

                  values[key] = {};

                  availabilityPerType[key] = {
                    saleMonthly: false,
                    saleYearly: false,
                    rentalMonthly: false,
                    rentalYearly: false,
                  };
                }

                values[key][contactId] = {
                  commissionRental: data.commission_rental,
                  commissionSales: data.commission_sales,
                  dealRental: data.deals_rental,
                  dealSales: data.deals_sales,
                  expenseRental: data.expenses_rental,
                  expenseSales: data.expenses_sales,
                  productionRental: data.production_rental,
                  productionSales: data.production_sales,
                  salaryRental: data.salary_rental,
                  salarySales: data.salary_sales,
                  targetRental: data.target_rental,
                  targetSales: data.target_sales,
                };

                // Sale data available for the year and month
                if (data.commission_sales || data.deals_sales ||
                  data.expenses_sales || data.production_sales || data.salary_sales
                ) {

                  availabilityPerType[key].saleMonthly = true;
                }

                // Rental data available for the year and month
                if (data.commission_rental || data.deals_rental ||
                  data.expenses_rental || data.production_rental || data.salary_rental
                ) {

                  availabilityPerType[key].rentalMonthly = true;
                }

                // Sale data available for the year
                if (data.target_sales) {

                  availabilityPerType[key].saleYearly = true;
                }

                // Rental data available for the year
                if (data.target_rental) {

                  availabilityPerType[key].rentalYearly = true;
                }
              });
            });
          });

          model.values = values;

          Object.keys(values).forEach(key => {

            const segments = key.split('_');

            if (segments[1] && segments[1] !== 'null') {

              if (availabilityPerType[key].saleMonthly) {

                byFrequency.saleMonthly[key] = values[key];
              }

              if (availabilityPerType[key].rentalMonthly) {

                byFrequency.rentalMonthly[key] = values[key];
              }
            }

            if (availabilityPerType[key].saleYearly) {

              byFrequency.saleYearly[segments[0]] = { ...byFrequency.saleYearly[segments[0]], ...values[key] };
            }

            if (availabilityPerType[key].rentalYearly) {

              byFrequency.rentalYearly[segments[0]] = { ...byFrequency.rentalYearly[segments[0]], ...values[key] };
            }
          });

          model.contactsByType.saleMonthly = null;
          model.contactsByType.saleYearly = null;
          model.contactsByType.rentalMonthly = null;
          model.contactsByType.rentalYearly = null;

          Object.keys(model.contactsByType).forEach((key: ProductionTypeEnum) => {

            model.contactsByType[key] = this.getContactsByFrequency(key, byFrequency, model);
          });

          this.store$.dispatch(
            new ProductionUpdateByFrequency({
              byFrequency: byFrequency,
            }),
          );

          return model;
        }),
      );
  }

  /**
   * @inheritDoc
   */
  save(model: ProductionModel): Observable<ModelSaveInterface> {

    return this
      .productionApiService
      .save(model)
      .pipe(
        map(response => this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING)),
        catchError(response => of(
          this.legacyParserService.parseErrors(response, this.moduleConfig.SAVE_VALIDATION_MAPPING),
        )),
      );
  }
}
