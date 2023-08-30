import React, {useState, useEffect, useReducer, useContext, useRef, useCallback} from "react";
import PropTypes from "prop-types";
import {rules, ruleBuilder} from "./rule-builder";
import "./style.less";

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
              ...events
              // checked: props.value,
              // value: props.value || props.defaultChecked
            };
            // console.log(newProps);
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
              ...events
              // checked: props.value,
              // value: props.value || props.defaultChecked
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

    useForm = () => {
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



const renderField = (field, model, props) => {
    const {name, type, label, hint, className} = props,
      {valid = true, message, pristine = true, value=""} = model,
      messageComp = (
        !valid && !pristine ?
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
      <label className={`field-container ${name} field-container-${type} pristine-${pristine} valid-${valid} ${className}`}>
        {labelComp}
        {field}
        {messageComp}
      </label>
    );
  },
  Field = props => {
    const {
          name,
          defaultValue,
          defaultChecked,
          value = (defaultValue || defaultChecked),
          label,
          onInput,
          type
        } = props,
        typeRenderer = fieldTypes[type] || fieldTypes.input,
        formContext = useForm();

    useEffect(() => {
      if(formContext) {
        const {form, addField} = formContext,
            thisField = form.fields[name];
        if(!thisField) {
          // console.log("[Field] adding field", name);
          addField({
            name, 
            value, 
            defaultValue, 
            label: label || name
          });
        }
      }

      return () => {
        if(formContext) {
          // console.log("[Field] removing field", name);
          const {removeField} = formContext;
          removeField(name);
        }
      };
    }, []);


    if(formContext) {
      const {form: {fields}, updateField, renderer} = formContext,
        fieldModel = fields[name] || {name, value, defaultValue, label},
        newProps = {
          ...props,
          onInput: e => {
            const value = e.target.value, {name} = props;
            // console.log("Dispatching", name, value);
            updateField({name, value});
            onInput && onInput(e);
          }
        },
        fieldComp = typeRenderer(newProps, formContext);

      if(type === "hidden") {
        return fieldComp;
      }
      return renderer(fieldComp, fieldModel, newProps);
    }else {
      return typeRenderer(props, formContext);
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



function validateField(field, rules, allFields) {
  const {name, value} = field,
      fieldRules = rules[name];

  let result = VALID;
  if(!fieldRules) {
    return result;
  }
  fieldRules.some(r => {
    const v = r(value, field, allFields);
    // console.log("[vaidateField]", r, field.name, v);
    if(typeof (v) !== "undefined" && !v.valid) {
      // console.log("[validatefield]", v);
      result = v;
      return true;
    }else {
      result = v || VALID;
    }
    return false;
  });
  return result;
}

function validateFields(fields, rules) {
  let valid = true;
  Object.values(fields).some(f => {
    const v = validateField(f, rules, fields);
    if(!v.valid) {
      valid = false;
      return true;
    }
  });
  return valid;
}

/**
 * The Form state reducer
 */
const formReducer = (state, action) => {
    const {type, payload} = action,
        {fields, rules} = state;

      let newState;
      switch (type) {
        case "set-fields": {
          // console.log("[reducer] set-field", payload);
          newState = {
            ...state,
            fields: Object.values(payload).reduce((acc, f) => {
              const {valid, message} = validateField(f, rules, payload),
                  {name} = f;

              acc[name] = {
                ...f,
                valid,
                message
              };
              return acc;
            }, {})
          };
          break;
        }
        case "add-field": {
          const {name, value, label} = payload,
              {valid, message} = validateField(payload, rules, fields);
          // console.log("[reducer] add-field", payload);
          newState = {
            ...state,
            fields: {
              ...fields,
              [name]: {
                name,
                label,
                value,
                pristine: true,
                valid,
                message
              }
            }
          };
          break;
        }
        case "update-field": {
          const {fields} = state,
            {name, value} = payload, // Here payload is field model
            fld = fields[name],
            {valid, message, revalidate} = validateField({...fld, value}, rules, fields),
            newFields = {
              ...fields,
              [name]: {
                ...fld,
                value,
                valid,
                message,
                pristine: false
              }
            };

            if(revalidate) {
              // console.log("[reducer] re validating", revalidate);
              revalidate.forEach(fn => {
                const f = fields[fn];
                // console.log("[reducer] revalidating", f);
                if(f) {
                  const {valid, message} = validateField(f, rules, newFields);
                  newFields[fn] = {
                    ...f,
                    valid,
                    message
                  };
                }
              });
            }

            newState = {
              valid: valid ? validateFields(newFields, rules) : false,
              pristine: false,
              fields: newFields,
              rules
            };
          break;
        }
        case "remove-field": {
          // console.log("[reducer] remove-field", payload);
          // here payload is the name of the field
          const {fields} = state, name = payload,
            newFields = {...fields};

          delete newFields[name];
          newState = {
            ...state,
            fields: newFields
          };
          break;
        }
        default:
          newState = state;
          break;
      }
      // console.log("[reducer] New State", action.type, newState);
      return newState;
    },
    Form = props => {
      /**
       * The form state
       */ 
      const [form, dispatch] = useReducer(formReducer, {
          fields: {},
          valid: true,
          pristine: true,
          rules: props.rules || {}
        }),

        fieldsRef = useRef({}),

        /**
         * Handles form submit
         */
        handleSubmit = useCallback(e => {
          e.preventDefault();
          const {onSubmit} = props;
          if(typeof onSubmit === "function") {
            const {fields, valid, pristine} = form;
            onSubmit({
              valid,
              pristine,
              fields: {
                ...fields
              },
              data: Object.keys(fields).reduce((acc, name) => {
                acc[name] = fields[name].value;
                return acc;
              }, {})
            });
          }
          return false;
        }, []);

      // Set the fields when the form is mounted
      useEffect(() => {
        const {current} = fieldsRef;
        if(current) {
          // console.log("[Form] Set fields");
          dispatch({type: "set-fields", payload: current});
          fieldsRef.current = null;
        }
      }, []);

      useEffect(() => {
        const {onChange} = props;
        // Only fire onchange if fields are set in state (not in fields ref, which means we are still loading)
        if(typeof onChange === "function" && !fieldsRef.current) {
          const {fields, valid, pristine} = form;
          // Only fire if the form is not pristine (i.e. don't fire on mount or initially)
          if(!pristine) {
            onChange({
              valid,
              pristine,
              fields: {
                ...fields
              },
              data: Object.keys(fields).reduce((acc, name) => {
                acc[name] = fields[name].value;
                return acc;
              }, {})
            });
          }
        }
      }, [form]);

      return (
        <FormContext.Provider value={{
          form, 
          addField(field) {
            // console.log("[formcontext] addField", field.name, fieldsRef.current);
            if(!fieldsRef.current) {
              dispatch({type: "add-field", payload: field});
            }else {
              fieldsRef.current[field.name] = field;
            }
          },
          updateField(field) {
            dispatch({type: "update-field", payload: field});
          },
          /*
          getField(name) {
            return form.fields[name];
          },
          */
          removeField(name) {
            // console.log("[formcontext] removeField", name);
            dispatch({type: "remove-field", payload: name});
          },
          renderer: props.fieldRenderer || renderField
        }}>
          <form className={props.className} name={props.name} onSubmit={handleSubmit}>
            {/* eslint-disable-next-line react/prop-types */}
            {props.children}
          </form>
        </FormContext.Provider>
      );
    };
Form.displayName = "Form";
Form.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  fieldRenderer: PropTypes.func,
  rules: PropTypes.object,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

export {
  Form, Field, registerFieldType, renderField, rules, ruleBuilder
};