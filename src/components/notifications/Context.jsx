import React from "react";

const NotificationServiceContext = React.createContext({
  show: () => {},
  next: () => {},
  current: null,
  setCurrent: () => {}
});

const useNotificationService = () => React.useContext(NotificationServiceContext);

export {
  NotificationServiceContext,
  useNotificationService
};
