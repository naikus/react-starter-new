import React from "react";

const NotificationContext = React.createContext({
  show: () => {},
  next: () => {},
  current: null,
  setCurrent: () => {}
});

const useNotifications = () => React.useContext(NotificationContext);

export {
  NotificationContext,
  useNotifications
};
