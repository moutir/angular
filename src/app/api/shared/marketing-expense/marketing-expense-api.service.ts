import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HelperService } from '../../../core/shared/helper.service';
import { SortInterface } from '../../../shared/interface/sort.interface';
import { PaginationInterface } from '../../../shared/interface/pagination.interface';
import { MarketingExpenseModel } from '../../../shared/model/marketing-expense.model';
import { ModelListInterface } from '../../../shared/interface/model-list.interface';
import { PhalconHttpService } from '../../http/phalcon-http.service';
import { MarketingExpenseListResponseInterface } from './marketing-expense-list-response.interface';
import { ApiEndpointEnum } from '../../../shared/enum/api-endpoint.enum';

import { MarketingExpenseListRequestInterface } from './marketing-expense-list-request.interface';
import { MarketingExpenseSearchModel } from '../../../shared/model/marketing-expense-search.model';
import { MarketingExpenseLoadResponseInterface } from './marketing-expense-load-response.interface';
import { MarketingExpensePropertyModel } from '../../../shared/model/marketing-expense-property.model';
import { MarketingExpensePromotionModel } from '../../../shared/model/marketing-expense-promotion.model';
import { LegacySaveResponseInterface } from '../../format/legacy/response/legacy-save-response.interface';
import { MarketingExpenseSaveRequestInterface } from './marketing-expense-save-request.interface';

@Injectable()
export class MarketingExpenseApiService {

  /**
   * Constructor
   */
  constructor(
    private httpService: PhalconHttpService,
    private helperService: HelperService,
  ) {

  }

  /**
   * List marketing expenses
   */
  list(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MarketingExpenseSearchModel,
  ): Observable<ModelListInterface<MarketingExpenseModel>> {

    return this
      .httpService
      .get<MarketingExpenseListRequestInterface, MarketingExpenseListResponseInterface>(
        ApiEndpointEnum.marketingExpenseList,
        this.listRequest(pagination, sort, filters),
        null,
        true,
      )
      .pipe(
        map(response => this.listResponse(response)),
      );
  }

  /**
   * Load
   */
  load(id: string): Observable<MarketingExpenseModel> {

    return this.httpService.get<null, MarketingExpenseLoadResponseInterface>(
      ApiEndpointEnum.marketingExpenseLoad,
      null,
      { id },
      true,
    ).pipe(
      map(response => this.loadResponse(response)),
    );
  }

  /**
   * Save
   */
  save(marketingExpense: MarketingExpenseModel): Observable<LegacySaveResponseInterface> {

    return this
      .httpService
      .post<MarketingExpenseSaveRequestInterface, LegacySaveResponseInterface>(
        ApiEndpointEnum.marketingExpenseSave,
        this.saveRequest(marketingExpense),
        null,
        true,
      );
  }

  /**
   * Handle a list() request parameters and return a formatted request
   */
  private listRequest(
    pagination: PaginationInterface,
    sort: SortInterface,
    filters: MarketingExpenseSearchModel,
  ): MarketingExpenseListRequestInterface {

    const request = <MarketingExpenseListRequestInterface>{
        start: (pagination.page - 1) * pagination.perPage,
        length: pagination.perPage,
        sort_id: sort.id,
        sort_order: sort.order,
    };

    if (filters.dateFrom) {
      request.marketing_from = this.helperService.dateToString(new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      request.marketing_to = this.helperService.dateToString(new Date(filters.dateTo));
    }

    if (filters.category) {
      request.main_category_id = filters.category;
    }

    if (filters.promotionId) {
      request.promotion = filters.promotionId;
    }

    if (filters.propertyId) {
      request.property = filters.propertyId;
    }
    return request;
  }

  /**
   * Handle a list() response and return a list of lead models
   */
  private listResponse(response: MarketingExpenseListResponseInterface): ModelListInterface<MarketingExpenseModel> {

    return {
      models: response.data.map((data, i) => {

        const item = new MarketingExpenseModel();

        item.id = data.id;
        item.title = data.title;
        item.invoiceAmount = parseFloat(data.amount);
        item.agency.id = data.agency_id;
        item.invoiceNumber = data.invoice_number || '';
        item.mainCategoryLabel = data.main_category;
        item.mainCategoryId = data.main_category_id;
        item.subCategoryLabel = data.sub_category;
        item.subCategoryId = data.sub_category_id;

        if (data.invoice_date) {

          item.invoiceDate = this.helperService.stringToDate(data.invoice_date);
        }

        if (data.period_start) {

          item.startDate = this.helperService.stringToDate(data.period_start);
        }

        if (data.period_end) {

          item.endDate = this.helperService.stringToDate(data.period_end);
        }

        return item;
      }),
      total: parseInt(response.recordsTotal, 10),
    };
  }

  /**
   * Handle a load() response and return an marketing expense model
   */
  private loadResponse(data: MarketingExpenseLoadResponseInterface): MarketingExpenseModel {

    const model = new MarketingExpenseModel();
    const leadCount = parseInt(data.lead_count, 10);

    model.id = data.id;
    model.title = data.title || '';
    model.invoiceAmount = parseFloat(data.amount);
    model.agency.id = data.agency_id;
    model.invoiceNumber = data.invoice_number || '';
    model.mainCategoryId = data.main_category_id || '';
    model.subCategoryId = data.sub_category_id || '';

    if (data.invoice_date) {

      model.invoiceDate = this.helperService.stringToDate(data.invoice_date);
    }

    if (data.period_start) {

      model.startDate = this.helperService.stringToDate(data.period_start);
    }

    if (data.period_end) {

      model.endDate = this.helperService.stringToDate(data.period_end);
    }

    model.costPerLead.total = {
      leadCount: leadCount,
      totalCost: model.invoiceAmount,
      averageCost: leadCount === 0 ? 0 : parseFloat((model.invoiceAmount / leadCount).toFixed(2)),
    };

    // Properties
    model.properties = (data.properties || []).map(prop => {

      const property = new MarketingExpensePropertyModel();
      const propertyLeadCount = parseInt(prop.lead_count, 10);

      property.property.id = prop.property_id;
      property.property.reference = prop.label;
      property.property.isLoading = true;
      property.amount = parseFloat(prop.amount);
      property.title = prop.title;

      model.costPerLead.property[property.property.id] = {
        leadCount: propertyLeadCount,
        totalCost: property.amount,
        averageCost: propertyLeadCount === 0 ? 0 : parseFloat((property.amount / propertyLeadCount).toFixed(2)),
      };

      return property;
    });

    // Promotions
    model.promotions = (data.promotions || []).map(promo => {

      const promotion = new MarketingExpensePromotionModel();
      const promotionLeadCount = parseInt(promo.lead_count, 10);

      promotion.promotion.id = promo.promotion_id;
      promotion.promotion.name = promo.label;
      promotion.promotion.reference = promo.label;
      promotion.promotion.isLoading = true;
      promotion.amount = parseFloat(promo.amount);
      promotion.title = promo.title;

      model.costPerLead.promotion[promotion.promotion.id] = {
        leadCount: promotionLeadCount,
        totalCost: promotion.amount,
        averageCost: promotionLeadCount === 0 ? 0 : parseFloat((promotion.amount / promotionLeadCount).toFixed(2)),
      };

      return promotion;
    });

    return model;
  }

  /**
   * Handle save() request parameters and return a formatted request
   */
  private saveRequest(model: MarketingExpenseModel): MarketingExpenseSaveRequestInterface {

    const request: MarketingExpenseSaveRequestInterface = <MarketingExpenseSaveRequestInterface>{
      marketing_id: model.id,
      marketing_main_category: model.mainCategoryId,
      marketing_sub_category: model.subCategoryId,
      invoice_amount: model.invoiceAmount || '',
      invoice_title: model.title || '',
      invoice_number: model.invoiceNumber || '',
      invoice_date: this.helperService.dateToString(model.invoiceDate),
      period_start: this.helperService.dateToString(model.startDate),
      period_end: this.helperService.dateToString(model.endDate),
    };

    if (model.properties.length > 0) {

      request.marketing_property_ids = [];
      request.marketing_property_amounts = [];
      request.marketing_property_titles = [];

      model.properties.forEach(expenseProperty => {

        request.marketing_property_ids.push(expenseProperty.property.id);
        request.marketing_property_amounts.push(expenseProperty.amount);
        request.marketing_property_titles.push(expenseProperty.title);
      });
    }

    if (model.promotions.length > 0) {

      request.marketing_promotion_ids = [];
      request.marketing_promotion_amounts = [];
      request.marketing_promotion_titles = [];

      model.promotions.forEach(expensePromotion => {

        request.marketing_promotion_ids.push(expensePromotion.promotion.id);
        request.marketing_promotion_amounts.push(expensePromotion.amount);
        request.marketing_promotion_titles.push(expensePromotion.title);
      });
    }

    return request;
  }
}
