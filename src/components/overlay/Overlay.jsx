/* global */
import React, {useState, useEffect, useRef, forwardRef} from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import "./style.less";

const OverlayBackdrop = forwardRef(function OverlayBackdrop(props, ref) {
  const {show} = props;
  return (
    <div ref={ref} className={`overlay-backdrop ${show ? "__visible" : ""}`}>
      {props.children}
    </div>
  );
});
OverlayBackdrop.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.any
};

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
      <OverlayBackdrop ref={overlayRef} show={show}>
        <div className={`overlay ${clazz}`}>
          {children}
        </div>
      </OverlayBackdrop>
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
