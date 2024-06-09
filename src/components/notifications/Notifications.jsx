import React, {useState, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {useNotificationService} from "./Context";
import "./style.less";

const Notification = props => {
  const {message} = props,
      {timeout = 3000, sticky = false, type = "toast", position = "bottom", content} = message,
      [show, setShow] = useState(false),
      stickyTimer = useRef(null),
      onDismiss = e => {
        e && e.stopPropagation();
        clearTimeout(stickyTimer.current);
        setShow(false);
        props.onDismiss && props.onDismiss();
      };

  useEffect(function show() {
    const delay = setTimeout(() => {
      setShow(true);
    }, 50);

    if(!sticky) {
      stickyTimer.current = setTimeout(() => {
        onDismiss();
      }, timeout);
    }

    return () => {
      clearTimeout(delay);
      clearTimeout(stickyTimer.current);
    };
  }, []);

  return (
    <div className={`notification ${type} ${position} ${show ? "show" : ""}`} onClick={onDismiss}>
      {typeof (content) === "function" ? content(message) : content}
    </div>
  );
};
Notification.displayName = "Notification";
Notification.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onDismiss: PropTypes.func
};


const Notifications = props => {
  const {onCurrent, next} = useNotificationService(),
      [current, setCurrent] = useState(null),
      // {current, next} = notifications,
      timer = useRef(null),
      onDismiss = () => {
        clearTimeout(timer);
        timer.current = setTimeout(() => {
          next();
        }, 200);
      },
      notification = current ? 
        <Notification key={current.key} message={current.message} onDismiss={onDismiss} /> : 
        null;

  useEffect(function setCurrentMessage() {
    const unsub = onCurrent(message => {
      setCurrent(message);
    });
    () => {
      unsub();
    };
  }, []);

  return (
    <div className="notifications">
      {notification}
    </div>
  );
};

export default Notifications;