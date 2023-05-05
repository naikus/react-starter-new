/* global */
import React, {useState, useEffect, useRef, forwardRef} from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import "./style.less";

const Overlay = props => {
  const {target = "body", show, className: clazz, children} = props,
    [wasShown, setWasShown] = useState(false),
    [anim, setAnim] = useState(false),
    [mount, setMount] = useState(false),
    overlayRef = useRef(null),
    {current} = overlayRef,
    animationEndHandler = e => {
      if(e.animationName === "overlay_content_close") {
        setMount(false);
      }
    };

  useEffect(() => {
    if(!current) {
      return;
    }
    current.addEventListener("animationend", animationEndHandler);
    return () => {
      current.removeEventListener("animationend", animationEndHandler);
    };
  }, [current]);

  // mount
  useEffect(() => {
    if(show) {
      setMount(true);
      setAnim(true);
      setWasShown(true);
    }
  }, [show]);

  // unmount
  useEffect(() => {
    if(!show && wasShown) {
      setAnim(false);
    }
  }, [show]);

  // console.log("Overlay", show, mount, anim);

  return mount ? (
    <Portal target={target}>
      <div className={`overlay-backdrop ${anim ? "__visible" : ""}`}>
        <div ref={overlayRef} className={`overlay ${clazz}`}>
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
