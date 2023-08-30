import React from "react";
import PropTypes from "prop-types";
import {NotificationContext} from "./Context";

function createNotificationService() {
  let current, handler;
  const messages = [],
      next = () => {
        if(messages.length) {
          setCurrent({
            key: new Date().getTime(),
            message: messages.shift()
          });
        }else {
          setCurrent(null);
        }
      },
      enqueue = message => {
        messages.push(message);
        if(!current) {
          next();
        }
      },
      setCurrent = message => {
        current = message;
        handler && handler(message);
      };

  return {
    onCurrent: cb => {
      handler = cb;
      return () => {
        cb = null;
      };
    },
    show: enqueue,
    toast(message) {
      enqueue({
        timeout: 700,
        // type: "info",
        content: message
      });
    },
    next
  };
}

const NotificationProvider = props => {
  const {children} = props,
      notifications = createNotificationService();

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