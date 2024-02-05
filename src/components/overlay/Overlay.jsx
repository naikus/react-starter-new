/* global */
import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import "./style.less";

const Overlay = props => {
  const {target = "body", show, className: clazz, onClose, children} = props,
    // [prevShow, setPrevShow] = useState(show),
    [wasShown, setWasShown] = useState(false),
    [anim, setAnim] = useState(false),
    [mount, setMount] = useState(false),
    overlayRef = useRef(null),
    {current: overlayBackdropElem} = overlayRef,
    animationEndHandler = e => {
      if(e.animationName === "overlay_close") {
        setMount(false);
        onClose && onClose();
      }
    };

  useEffect(function registerAnimListener() {
    if(!overlayBackdropElem) {
      return;
    }
    overlayBackdropElem.addEventListener("animationend", animationEndHandler);
    return () => {
      overlayBackdropElem.removeEventListener("animationend", animationEndHandler);
    };
  }, [overlayBackdropElem]);

  // mount & unmount
  useEffect(function showOverlay() {
    if(show) {
      setMount(true);
      setAnim(true);
      setWasShown(true);
    }else {
      if(wasShown) {
        setAnim(false);
      }
    }
  }, [show]);

  /*
  if(show !== prevShow && show) {
    console.log("Mounting...");
    setPrevShow(show);
    setMount(true);
    setAnim(true);
    setWasShown(true);
  }
  */

  // unmount
  /*
  useEffect(() => {
    if(!show && wasShown) {
      setAnim(false);
    }
  }, [show]);
  */
  /*
  if(show !== prevShow && !show && wasShown) {
    setPrevShow(show);
    setAnim(false);
  }
  */

  return mount ? (
    <Portal target={target}>
      <div ref={overlayRef} className={`overlay-backdrop ${anim ? "__visible" : ""}`}>
        <div className={`overlay ${clazz}`}>
          {children}
        </div>
      </div>
    </Portal>
  ) : null;
};
Overlay.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  target: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.any
};

export default Overlay;
