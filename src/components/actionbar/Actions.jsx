import React, {useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import PropTypes from "prop-types";
import "./styles.less";

/**
 * Action component for AppBar
 * @param {{
 *  target: string=.app-bar,
 *  className: string,
 *  children: any
 * }} props
 */
const Actions = props => {
  const {target = ".app-bar", className = ""} = props,
      element = useRef(document.createElement("div")),
      {current} = element;

  useEffect(function mountActionsOnTarget() {
    const targetElem = document.querySelector(`${target} > .actions`);
    targetElem.appendChild(current);
    return () => {
      const {parentElement} = current;
      if(parentElement) {
        parentElement.removeChild(current);
      }
    };
  }, []);

  current.className = `action-group ${className}`;
  return createPortal(props.children, current);
};
Actions.displayName = "Actions";
Actions.propTypes = {
  target: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any
};

export default Actions;