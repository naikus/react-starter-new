import React from "react";
import PropTypes from "prop-types";
import {NotificationServiceContext} from "./Context";


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

      /**
       * @param {NotificationMessage} message
       */
      enqueue = message => {
        messages.push(message);
        if(!current) {
          next();
        }
      },

      /**
       * @param {NotificationMessage} message
       */
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
    next
  };
}

const NotificationProvider = props => {
  const {children} = props,
      notifications = createNotificationService();

  return (
    <NotificationServiceContext.Provider value={notifications}>
      {children}
    </NotificationServiceContext.Provider>
  );
};
NotificationProvider.displayName = "NotificationProvider";
NotificationProvider.propTypes = {
  children: PropTypes.node
};

export default NotificationProvider;