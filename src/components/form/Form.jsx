import React, {useState, useEffect, useReducer, useContext, useRef, useCallback} from "react";
import PropTypes from "prop-types";

const VALID = {valid: true, message: ""},
    objToString = Object.prototype.toString,
    isArray = that => objToString.call(that).slice(8, -1) === "Array",
    isIos = () => /iPad|iPhone|iPod/.test(navigator.platform),

    fieldTypes = {
      input(props, context) {
        return (
          <input type={props.type} {...props} />
        );
      },
      checkbox(props, context) {
        const onInput = props.onInput,
            handler = e => {
              onInput && onInput({
                target: {
                  srcElement: e.target,
                  value: e.target.checked
                }
              });
            },
            events = isIos() ? {onChange: handler, onInput: null} : {onInput: handler},
            newProps = {
              ...props,
              ...events,
              // checked: props.value,
              value: `${props.value}`
            };
        return (
          <span className="checkbox-container">
            <input type="checkbox" {...newProps} />
            <div className="indicator"></div>
          </span>
        );
      },
      radio(props, context) {
        const handler = e => props.onInput && props.onInput({
              target: {
                value: e.target.checked
              }
            }),
            events = isIos() ? {onClick: handler} : {onInput: handler},
            newProps = {
              ...props,
              ...events,
              checked: props.value,
              value: `${props.value}`
            };
        return (
          <span className="radio-container">
            <input type="radio" {...newProps} />
            <div className="indicator"></div>
          </span>
        );
      },
      button(props, context) {
        return (
          <button {...props}>
            {props.children}
          </button>
        );
      },
      select(props, context) {
        return (
          <select {...props}>
            {props.children}
          </select>
        );
      },
      textarea(props, context) {
        return (
          <textarea {...props}>
            {props.children}
          </textarea>
        );
      }
    },

    registerFieldType = (type, fieldImpl) => {
      fieldTypes[type] = fieldImpl;
    },

    fieldReducer = (state, action) => {
      const {type, value} = action;
      return {
        ...state,
        [type]: value
      };
    },
    
    FormContext = React.createContext(),

    useFormContext = () => {
      return useContext(FormContext);
    };

const Field = props => {
  const {name, value, defaultValue, label, onInput, type} = props,
      [state, dispatch] = useReducer(fieldReducer, {
        name,
        value,
        defaultValue,
        label,
        pristine: true
      }),
      // {value: val} = state,
      typeRenderer = fieldTypes[type] || fieldTypes.input,
      formContext = useFormContext();

  useEffect(() => {
    if(formContext) {
      formContext.addField({name, value, defaultValue, label});
    }
    return () => {
      if(formContext) {
        formContext.removeField(name);
      }
    };
  }, []);

  let newProps = props;
  if(formContext) {
    newProps = {
      ...props,
      // val,
      onInput: e => {
        const value = e.target.value, {name, label} = state;
        dispatch({type: "value", value});
        if(formContext) {
          formContext.updateField({name, label, value, pristine: false});
        }
        onInput && onInput(e);
      }
    }; 
  }
  return typeRenderer(newProps, formContext);
};
Field.displayName = "Field";
Field.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  label: PropTypes.string,
  onInput: PropTypes.func
};




/**
 * The Form state reducer
 */
const formReducer = (state, action) => {
  const {type, payload, formContext} = action;

  let newState;
  switch (type) {
    case "add-field": {
      const {fields} = state, {valid, message} = formContext.validateField(payload),
          fieldValue = payload.value || payload.defaultValue;
      newState = {
        ...state,
        fields: [...fields, {...payload, value: fieldValue, valid, message}]
      };
      break;
    }
    case "update-field": {
      const {name, value} = payload, // Here payload is field model
        {fields} = state,
        {valid, message} = formContext.validateField(payload),
        newFields = fields.map(f => {
          if(f.name === name) {
            return {
              ...f,
              valid,
              message,
              pristine: false,
              value
            };
          }
          return f;
        });
        newState = {
          valid: valid ? formContext.validateFields(newFields) : false,
          pristine: false,
          fields: newFields
        };
      break;
    }
    case "remove-field": {
      // here payload is the name of the field
      const {fields} = state, name = payload;
      newState = {
        ...state,
        fields: fields.filter(f => f.name !== name)
      };
      break;
    }
    default:
      newState = state;
      break;
  }
  // console.log("New State", action.type, newState);
  return newState;
};

const Form = props => {
  /**
   * The form state
   */ 
  const [state, dispatch] = useReducer(formReducer, {
      fields: [],
      valid: true,
      pristine: true
    }),

    /**
     * Handles form submit
     */
    handleSubmit = useCallback(e => {
      e.preventDefault();
      const {onSubmit} = props;
      if(typeof onSubmit === "function") {
        onSubmit(formContext.getData());
      }
      return false;
    }, []),

    /**
     * Form context stored as ref for all the Field components.
     * useRef cannot access the updated state and hence it has to be set locally on each state update
     */
    {current: formContext} = useRef(((compState, dispatch) => {
      let state = compState;
      return {
        addField(fieldModel) {
          dispatch({type: "add-field", payload: fieldModel, formContext: this});
        },
        updateField(fieldModel) {
          dispatch({type: "update-field", payload: fieldModel, formContext: this});
        },
        removeField(name) {
          dispatch({type: "remove-field", payload: name, formContext: this});
        },
        updateState(newState) {
          state = newState;
        },
        getField(name) {
          let fieldModel;
          state.fields.some(f => {
            if(f.name === name) {
              fieldModel = f;
              return true;
            }
            return false;
          });
          return fieldModel;
        },
        validateField(field) {
          const {rules} = props,
              {name, value} = field,
              fieldRules = rules[name];
  
          let result = VALID;
          if(!fieldRules) {
            return result;
          }
          fieldRules.some(r => {
            const v = r(value, field, this);
            if(typeof (v) !== "undefined" && !v.valid) {
              result = v;
              return true;
            }
            return false;
          });
          return result;
        },
        validateFields(fields) {
          if(!fields) return;
          let valid = true;
          fields.some(f => {
            const v = this.validateField(f);
            if(!v.valid) {
              valid = false;
              return true;
            }
          });
          return valid;
        },
        getValidationInfo(name) {
          const fm = state.fields[name];
          if(fm) {
            return {valid: fm.valid, message: fm.message};
          }
          return null;
        },
        getData() {
          const {fields, valid, pristine} = state,
              [validation, data] = fields.reduce((acc, f) => {
                const [vInfo, data] = acc,
                    {name, value, valid, message, pristine} = f;
                data[name] = value;
                vInfo[name] = {valid, message, pristine};
                return acc;
              }, [{}, {}]);
          return {
            valid,
            pristine,
            validation,
            data
          };
        }
      };
    })(state, dispatch));


  /**
   * Fire onChange if the state changes
   */
  useEffect(() => {
    const {onChange} = props;
    // This is important since formContext can't access the latest state
    formContext.updateState(state);

    if(typeof onChange === "function") {
      onChange(formContext.getData());
    }
  }, [state]);

  return (
    <FormContext.Provider value={formContext}>
      <form name="myForm" onSubmit={handleSubmit}>
        {/* eslint-disable-next-line react/prop-types */}
        {props.children}
      </form>
    </FormContext.Provider>
  );
};
Form.displayName = "Form";
Form.propTypes = {
  rules: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

export {
  Form, Field, registerFieldType
};