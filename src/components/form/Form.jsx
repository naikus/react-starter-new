import React, {useState, useEffect, useReducer, useContext, useRef, useCallback} from "react";
import PropTypes from "prop-types";
import "./style.less";
import { flushSync } from "react-dom";

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
    
    FormContext = React.createContext(),

    useFormContext = () => {
      return useContext(FormContext);
    },

    useStateCallback = initialstate => {
      const [state, setState] = useState(initialstate),
        callbackRef = useRef(),
        callbackSetState = useCallback((state, cb) => {
          callbackRef.current = cb;
          setState(state);
        });

      useEffect(() => {
        const {current} = callbackRef;
        if(current) {
          callbackRef.current = null;
          current(state);
        }
      }, [state]);

      return [state, callbackSetState];
    };



const fieldReducer = (state, action) => {
    const {type, value} = action;
    return {
      ...state,
      [type]: value,
      pristine: false
    };
  },
  renderField = (field, model, props, context) => {
    const {name, type, "data-label": label, "data-hint": hint, className} = props,
      {valid = true, message, pristine = true, value=""} = model,
      messageComp = (
        !valid ?
          <span className="v-msg hint">{message}</span>
        : null
      ),
      labelComp = (
        label ?
          <div className="label">
            <span className="title">{label}</span>
            {hint ? <span className="hint">{hint}</span> : null}
            {type === "range" ? <span className="value">{value}</span> : null}
          </div>
        : null
      );

    return (
      <label className={`field-container ${name} ${type} pristine-${pristine} valid-${valid} ${className}`}>
        {labelComp}
        {field}
        {messageComp}
      </label>
    );
  },
  Field = props => {
    const {name, value, defaultValue, label, onInput, type} = props,
        [state, setState] = useState({
          name,
          value,
          label,
          pristine: true
        }),

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

    let newProps = props, renderer;
    if(formContext) {
      renderer = formContext.fieldRenderer;
      newProps = {
        ...props,
        onInput: e => {
          const value = e.target.value, {name} = props;
          if(formContext) {
            // flushSync(() => {
              formContext.updateField({name, value, pristine: false}, () => {
                setState({name, value, pristine: false});      
              });
            // });
          }else {
            setState({name, value, pristine: false});
          }
          onInput && onInput(e);
        }
      };
    }
    const fieldComp = typeRenderer(newProps, formContext);
    if(typeof renderer === "function") {
      const fm = formContext.getFieldModel(name);
      return renderer(fieldComp, fm, newProps, formContext);
    }else {
      return fieldComp;
    }
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
    const {type, payload, formContext, callback} = action;
      let newState;
      switch (type) {
        case "add-field": {
          const {fields} = state,
              {valid, message} = formContext.validateField(payload),
              fieldValue = payload.value || payload.defaultValue;

          newState = {
            ...state,
            fields: [...fields, {...payload, value: fieldValue, valid, message}]
          };
          break;
        }
        case "update-field": {
          const {name, value, pristine} = payload, // Here payload is field model
            {fields} = state,
            {valid, message} = formContext.validateField(payload),
            newFields = fields.map(f => {
              if(f.name === name) {
                return {
                  ...f,
                  valid,
                  message,
                  pristine,
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
    },
    Form = props => {
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
          let state = compState, updateCallback;
          return {
            fieldRenderer: props.fieldRenderer,
            getValidationRules(name) {
              const {rules = {}} = props;
              return rules[name] || [];
            },
            addField(fieldModel) {
              dispatch({type: "add-field", payload: fieldModel, formContext: this});
            },
            updateField(fieldModel, callback) {
              updateCallback = callback;
              dispatch({type: "update-field", payload: fieldModel, formContext: this});
            },
            removeField(name) {
              dispatch({type: "remove-field", payload: name, formContext: this});
            },
            updateState(newState) {
              state = newState;
              if(updateCallback) {
                const cb = updateCallback;
                updateCallback = null;
                cb();
              }
            },
            getFieldModel(name) {
              let fieldModel;
              state.fields.some(f => {
                if(f.name === name) {
                  fieldModel = f;
                  return true;
                }
                return false;
              });
              return fieldModel || {};
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
  fieldRenderer: PropTypes.func,
  rules: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

export {
  Form, Field, registerFieldType, renderField
};