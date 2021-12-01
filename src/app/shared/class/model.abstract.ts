export class ModelAbstract {

  /**
   * List of this class' attributes that hold a model or array of models, useful for "deep cloning" this class
   */
  readonly MODEL_ATTRIBUTES: string[] = [];

  /**
   * Unique identifier
   */
  id: string = '';

  /**
   * Clone model
   */
  clone<Model extends ModelAbstract>(): Model {

    const clone = Object.create(Object.getPrototypeOf(this));
    const objectAttributes = Object.keys(this).filter(attribute => this.hasOwnProperty(attribute));

    objectAttributes.forEach(attribute => {

      // Model
      if (this.MODEL_ATTRIBUTES.indexOf(attribute) > -1) {

        // Array of models
        if (Array.isArray(this[attribute])) {

          clone[attribute] = this[attribute].map(model => {

            if (!model.clone) {

              console.error('This model part of an array of models does not have a clone() function:', model);
              return;
            }

            return model.clone();
          });

          return;
        }

        // Not initialized
        if (this[attribute] === null) {

          clone[attribute] = null;

        // Single instance
        } else {

          if (!this[attribute].clone) {

            console.error('This model does not have a clone() function:', this[attribute]);
            return;
          }

          clone[attribute] = this[attribute].clone();
        }

        return;
      }

      // Array
      if (Array.isArray(this[attribute]) === true) {

        clone[attribute] = this[attribute].slice(0);

        return;
      }

      // Object (not array)
      if (typeof this[attribute] === 'object') {

        if (this[attribute] instanceof Date) {

          clone[attribute] = new Date(this[attribute].getTime());

          return;
        }

        if (this[attribute] === null || this[attribute] === undefined) {

          clone[attribute] = this[attribute];

          return;
        }

        clone[attribute] = { ...this[attribute] };

        return;
      }

      // Scalar
      clone[attribute] = this[attribute];
    });

    return clone;
  }
}
