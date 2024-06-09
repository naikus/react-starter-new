import {NotificationServiceContext, useNotificationService} from "./Context";
import NotificationProvider from "./Provider";
import Notifications from "./Notifications";

/**
 * @typedef {"toast" | "info" | "success" | "warn" | "error"} NotificationType
 * @typedef {"bottom" | "top"} NotificationPosition
 */

/**
 * @typedef NotificationMessage
 * @property {NotificationType} type
 * @property {string | JSX.Element} content
 * @property {NotificationPosition} position
 * @property {number} timeout
 * @property {boolean} sticky
 * @property {() => void} onDismiss
 * @property {string} class
 */

/**
 * @typedef {Function} Notify
 * @param {NotificationMessage} message
 * @property {Function} info
 * @property {Function} success
 * @property {Function} warn
 * @property {Function} error
 */

/**
 * 
 * @returns 
 */
function useNotifications() {
  const service = useNotificationService(),
      /**
       * @param {NotificationMessage} message
       */
      notify = function(message) {
        service.show(message);
      };

  notify.info = (content) => {
    notify({
      type: "info",
      content
    });
  };
  notify.success = (content) => {
    notify({
      type: "success",
      content
    });
  };
  notify.warn = (content, sticky) => {
    notify({
      type: "warn",
      sticky,
      content
    });
  };
  notify.error = (content, sticky) => {
    notify({
      type: "error",
      sticky,
      content
    });
  };
  notify.toast = (content) => {
    notify({
      content
    });
  };

  return notify;
}

export {
  useNotifications,
  NotificationServiceContext,
  NotificationProvider,
  Notifications
};