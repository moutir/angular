import { Injectable } from '@angular/core';

import { KeyValueType } from '../../../shared/type/key-value.type';
import { ModelSaveInterface } from '../../../shared/interface/model-save.interface';
import { LegacySaveResponseInterface } from './response/legacy-save-response.interface';

@Injectable()
export class LegacyParserService {

  /**
   * Constructor
   */
  constructor() {

  }

  /**
   * Parse JSONAPI errors to a model save interface
   */
  parseErrors(
    response: LegacySaveResponseInterface,
    errorMapping: KeyValueType<string, string>,
  ): ModelSaveInterface {

    const modelSave: ModelSaveInterface = {
      modelError: {},
      generalError: [],
    };

    // General legacy errors
    if (response && response.success === false && response.data && response.data.messages) {

      Object
        .keys(response.data.messages)
        .forEach(i => modelSave.generalError.push({
          code: '',
          message: response.data.messages[i],
        }));
    }

    // No validation errors
    if (!response || !response.validation || Object.keys(response.validation).length === 0) {

      return modelSave;
    }

    // No validation mapping
    if (Object.keys(errorMapping).length === 0) {

      return modelSave;
    }

    Object
      .keys(response.validation)
      .forEach(errorId => {

        // Exact mapping
        if (!!errorMapping[errorId]) {

          modelSave.modelError[errorMapping[errorId]] = response.validation[errorId];

          return;
        }

        // Array mapping
        const match = errorId.match(/\[([0-9]+)\]\./);

        if (match !== null) {

          const error = errorMapping[errorId.replace(match[0], '[{i}].')];

          if (!!error) {

            modelSave.modelError[error.replace('{i}', match[1])] = response.validation[errorId];

            return;
          }
        }

        modelSave.generalError.push({
          code: errorId,
          message: response.validation[errorId],
        });
      });

    return modelSave;
  }
}
