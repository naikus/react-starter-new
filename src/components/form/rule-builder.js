/**
 * @typedef {import("./Form").Field} Field
 * @typedef {import("./Form").Validator} Field
 */

const stringValue = value => value === null || typeof(value) === "undefined" ? "" : String(value),
    invalid = message => ({valid: false, message}),
    rules = {
      required(value, field) {
        let val = stringValue(value), {trim = true} = this;
        if(trim) {
          val = val.trim();
        }
        if(!val) {
          const message = this.message || `${field.label} is required`;
          return invalid(message);
        }
      },
      length(value, field) {
        const {min, max} = this,
            val = stringValue(value),
            len = val.length;
        if(min && len < min) {
          const message =
              this.message || `${field.label} must be a minimum of ${min} characters`;
          return invalid(message);
        }
        if(max && len > max) {
          const message =
              this.message || `${field.label} must be a maxinum of ${max} characters`;
          return invalid(message);
        }
      },
      number(value, field) {
        const {min = Number.MIN_VALUE, max = Number.MAX_VALUE} = this,
            strVal = stringValue(value),
            val = Number(strVal);
        if(isNaN(val) || val < min || val > max) {
          const message = this.message || `${field.label} is an invalid number`;
          return invalid(message);
        }
      },
      email(value, field) {
        const reEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2,3})?)$/,
            val = stringValue(value);
        if(!reEmail.test(val)) {
          const message = this.message || `${field.label} must be a valid email`;
          return invalid(message);
        }
      },
      fieldCompare(value, field, fields) {
        const {field: fieldName} = this, other = fields[fieldName];
        if(!other) {
          return;
        }
        if(other.value !== value) {
          const message = this.message || `${field.label} must be same as ${other.name}`;
          return invalid(message);
        }else {
          return {valid: true, revalidate: [fieldName]};
        }
      },
      pattern(value, field) {
        const regExp = this.pattern, val = stringValue(value);
        if(!regExp.test(val)) {
          const message = this.message || `${field.label} must match pattern: ${regExp}`;
          return invalid(message);
        }
      }
    },

    /**
     * Builds a rule function from a rule name
     * @param {String} name The name of the validator
     * @param {Object} options The options for the validator All options are available on the this property
     * of the validator function
     */
    ruleBuilder = (name, options = {}) => {
      const r = rules[name];
      return (...args) => {
        return r.call(options, ...args);
      };
    };

export {
  rules,
  ruleBuilder
};
