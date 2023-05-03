/* global */
import React, {useState, useEffect, useRef, forwardRef} from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import "./style.less";

const Overlay = props => {
  const {target = "body", show, className: clazz, children} = props,
    [visible, setVisible] = useState(false),
    overlayRef = useRef(null),
    {current} = overlayRef,
    animationEndHandler = e => {
      // console.log(e);
      if(e.animationName === "overlay_close") {
        setVisible(false);
      }
    };

  useEffect(() => {
    if(show) {
      setVisible(true);
    }
  }, [show]);

  useEffect(() => {
    if(!current) {
      return;
    }
    current.addEventListener("animationend", animationEndHandler);
    return () => {
      current.removeEventListener("animationend", animationEndHandler);
    };
  }, [current]);

  return visible ? (
    <Portal target={target}>
      <div ref={overlayRef} className={`overlay-backdrop ${show ? "__visible" : ""}`}>
        <div className={`overlay ${clazz}`}>
          {children}
        </div>
      </div>
    </Portal>
  ) : null;
};
Overlay.propTypes = {
  show: PropTypes.bool,
  target: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any
};

export default Overlay;
