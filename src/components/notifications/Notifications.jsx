import React, {useState, useEffect, useRef, memo, useCallback, useContext} from "react";
import PropTypes from "prop-types";
import NotificationContext from "./Context";
import "./style.less";

const ICONS = {
  error: "icon-alert-octagon",
  success: "icon-check",
  default: "icon-bell",
  info: "icon-info",
  warn: "icon-alert-triangle"
};



const Notification = props => {
  const {message} = props,
      {timeout = 3000, sticky = false, type = "default", icon = ICONS[type], content} = message,
      [show, setShow] = useState(false),
      stickyTimer = useRef(null),
      onDismiss = e => {
        e && e.stopPropagation();
        clearTimeout(stickyTimer.current);
        setShow(false);
        props.onDismiss && props.onDismiss();
      };

  useEffect(() => {
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
    <div className={`notification ${type} ${show ? "show" : ""}`} onClick={onDismiss}>
      <i className={`icon ${icon}`}></i>
      <span className="data">
        {typeof (content) === "function" ? content(message) : content}
      </span>
    </div>
  );
};
Notification.displayName = "Notification";
Notification.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onDismiss: PropTypes.func
};


const Notifications = props => {
  const notifications = useContext(NotificationContext),
      {current, next} = notifications,
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

  return (
    <div className="notifications">
      {notification}
    </div>
  );
};

export default Notifications;