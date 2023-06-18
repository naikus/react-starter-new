import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {registerFieldType} from "./Form";

function createEvent(value) {
  return {
    target: {
      value
    }
  };
}

function MultiSelect(props) {
    const {
      comparator = (value, option) => value === option.value,
      name,
      options,
      value,
      defaultValue,
      onChange,
      disabled,
      className = ""
    } = props,
    listElemRef = useRef(null),
    [data, setData] = useState(value || defaultValue || []),
    toggleSelectItem = e => {
      if(disabled) {return;}

      // If this is a keyup event, ignore all keys except Space
      if(e.type === "keyup" && e.code !== "Space") {return;}

      const {target} = e,
        value = target.dataset ? target.dataset.value : target.getAttribute("data-value");

      let newData;
      if(data.indexOf(value) === -1) {
        newData = [...data, value];
      }else {
        newData = data.filter(item => item !== value);
      }
      setData(newData);
      onChange && onChange(createEvent(newData));
    };

  if(value !== data) {
    setData(value);
  }

  const items = options.map((option, index) => {
    const {value} = option,
        selected = data.some(item => comparator(item, option));

    return (
      <div key={`${value}_${index}`}
          tabIndex={index + 1}
          data-value={value}
          onClick={toggleSelectItem}
          onKeyUp={toggleSelectItem}
          className={`multi-select-item${selected ? " selected" : ""}`}>
        {option.label}
      </div>
    );
  });

  return (
    <div tabIndex={0} ref={listElemRef}
        className={`input multi-select ${disabled ? " disabled": ""} ${className}`}>
      {items}
    </div>
  );
}
MultiSelect.displayName = "MultiSelect";
MultiSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  name: PropTypes.string,
  value: PropTypes.array,
  defaultValue: PropTypes.array,
  comparator: PropTypes.func,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

registerFieldType("multi-select", MultiSelect);

export default MultiSelect;