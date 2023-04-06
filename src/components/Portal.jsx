import React, {useState, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import PropTypes from "prop-types";

const Portal = props => {
  const {target = "body", replace = ""} = props,
      portalRef = useRef(document.createElement("div")),
      portalElem = portalRef.current,
      targetRef = useRef(document.querySelector(target)),
      targetElem = targetRef.current;

  useEffect(() => {
    if(replace) {
      const existing = targetElem.querySelector(replace);
      existing && existing.parentNode.removeChild(existing);
    }
  }, []);

  useEffect(() => {
    portalElem.className = "portal";
    targetElem.appendChild(portalElem);
    return () => {
      targetElem.removeChild(portalElem);
    };
  }, []);
  // render
  return createPortal(props.children, portalElem);
};
Portal.propTypes = {
  target: PropTypes.string,
  replace: PropTypes.string
};
Portal.displayName = "Portal";

export default Portal;
