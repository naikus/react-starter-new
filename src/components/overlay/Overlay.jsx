/* global */
import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import "./style.less";

/**
 * Grabs focus as soon as overlay is mounted
 */
/*
const FocusGrabber = () => {
  const focusGrabberRef = useRef(null);

  useEffect(() => {
    if(!focusGrabberRef.current) {
      return;
    }
    const tid = setTimeout(() => {
      focusGrabberRef.current.focus();
    }, 50);
    return () => {
      clearTimeout(tid);
    };
  }, [focusGrabberRef.current]);

  return (
    <span ref={focusGrabberRef} tabIndex={-1} />
  );
};
*/

const Overlay = props => {
  const {target = "body", show, className: clazz, onClose, children} = props,
    // [prevShow, setPrevShow] = useState(show),
    [wasShown, setWasShown] = useState(false),
    [anim, setAnim] = useState(false),
    [mount, setMount] = useState(false),
    overlayBackdropRef = useRef(null),
    {current: overlayBackdropElem} = overlayBackdropRef,
    overlayCloseAnimHandler = e => {
      // console.log("Animation end", e);
      if(e.animationName === "overlay_close") {
        setMount(false);
        onClose && onClose();
      }
    };

  useEffect(function registerCloseAnimListener() {
    if(!overlayBackdropElem) {
      return;
    }
    overlayBackdropElem.addEventListener("animationend", overlayCloseAnimHandler);
    return () => {
      overlayBackdropElem.removeEventListener("animationend", overlayCloseAnimHandler);
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
      <div ref={overlayBackdropRef} className={`overlay-backdrop ${anim ? "__visible" : ""}`}>
        <div tabIndex={1} className={`overlay ${clazz}`}>
          {/* <FocusGrabber /> */}
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
