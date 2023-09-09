import React, {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";

import {registerFieldType} from "./Form";


function createEvent(value) {
  return {
    target: {
      value
    }
  };
}

function MultiValInput(props) {
  const {value, defaultValue, onChange, onInput, placeholder, delimiter = "," /*"/\s|\n|\r\n/"*/, disabled} = props;
  const [data, setData] = useState(value || defaultValue || []),
      removeValue = e => {
        if(disabled) {return;}
        const {target} = e,
            value = target.dataset ? target.dataset.value : target.getAttribute("data-value"),
            newData = data.filter(item => item !== value),
            event = createEvent(newData);

        setData(newData);
        onInput && onInput(event); // This is for when this component is part of a form
        onChange && onChange(event);
      },

      addValues = e => {
        // console.log(data);
        const {target} = e, inputValue = target.value.trim();
        if(!inputValue) return;

        const newValues = inputValue.split(delimiter),
            uniqueVals = newValues.filter(val => {
              const trimmed = val.trim();
              return trimmed && data.indexOf(trimmed) === -1;
            });

        if(uniqueVals.length) {
          const newData = [...data, ...uniqueVals],
              event = createEvent(newData)
          // console.log(newData);
          setData(newData);
          onInput && onInput(event); // This is for when this component is part of a form
          onChange && onChange(event);
        }
        target.value = "";
      },

      handleKeyEnter = e => {
        if(e.keyCode === 13) {
          addValues(e);
        }
      },

      values = data.map(value => {
        const key = value;
        return (
          <span key={key} className={`value-item${disabled ? " disabled" : ""}`}>
            {value}
            <i data-value={value} className="icon icon-x-circle" onClick={removeValue} />
          </span>
        );
      });

  useEffect(() => {
    setData(value || []);
  }, [value]);

  return (
    <div className={`multi-val-input`}>
      <div className="values">{values}</div>
      <input type="text" placeholder={placeholder} name="__input"
          className="value-input" onBlur={addValues} onKeyUp={handleKeyEnter} disabled={disabled} />
    </div>
  );
}
MultiValInput.displayName = "MultiValInput";
MultiValInput.propTypes = {
  delimiter: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onInput: PropTypes.func,
  disabled: PropTypes.bool
};

registerFieldType("multi-val", MultiValInput);

export default MultiValInput;