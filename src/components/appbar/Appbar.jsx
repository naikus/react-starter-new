import React, {useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import PropTypes from "prop-types";
import "./styles.less";


const AppBar = props => {
  const {title = "App", logo, logoAltText = "Logo", children} = props;
  return (
    <div className={`app-bar`}>
      <div className="branding">
        <img className="logo" alt={logoAltText} src={logo} />
        <h2 className="title">{title}</h2>
      </div>
      <div className="actions"></div>
      <div className="actions global-actions">{children}</div>
    </div>
  );
};
AppBar.propTypes = {
  title: PropTypes.string.isRequired,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  children: PropTypes.any
};


const Actions = props => {
  const {target = ".app-bar", className = ""} = props,
      element = useRef(document.createElement("div")),
      {current} = element;

  useEffect(() => {
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

export {
  AppBar,
  Actions
};
