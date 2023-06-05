import React, {useState, useEffect, useRef, memo, useCallback, useContext} from "react";
import PropTypes from "prop-types";
import NotificationContext from "./Context";

const useNotifications = () => {
  const messages = useRef([]),
      [current, setCurrent] = useState(null),
      next = () => {
        if(messages.current.length) {
          setCurrent({
            key: new Date().getTime(),
            message: messages.current.shift()
          });
        }else {
          setCurrent(null);
        }
      },
      enqueue = message => {
        messages.current.push(message);
        if(!current) {
          next();
        }
      };

  return {
    show: enqueue,
    toast(message) {
      enqueue({
        // type: "info",
        content: message
      });
    },
    next,
    current,
    setCurrent
  };
};

const NotificationProvider = props => {
  const {children} = props,
      notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};
NotificationProvider.displayName = "NotificationProvider";
NotificationProvider.propTypes = {
  children: PropTypes.node
};

export default NotificationProvider;