import React from "react";

const NotificationServiceContext = React.createContext({
  show: (message) => {},
  next: () => {},
  onCurrent: (current) => {
    return () => {};
  }
});

const useNotificationService = () => React.useContext(NotificationServiceContext);

export {
  NotificationServiceContext,
  useNotificationService
};
