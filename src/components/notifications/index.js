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
 * @property {string} [message]
 * @property {string | JSX.Element | function} [content]
 * @property {NotificationPosition} [position="bottom"]
 * @property {number} [timeout=0]
 * @property {boolean} [sticky=false]
 * @property {() => void} [onDismiss]
 */

/**
 * @typedef NotificationService
 * @property {(message: NotificationMessage) => void} show
 * @property {() => void} next
 * @property {(cb: (message: NotificationMessage) => void) => function} onCurrent The onCurrent handler
 */

/**
 * @typedef {(message: NotificationMessage) => void} Notify
 * @property {Function} info
 * @property {Function} success
 * @property {Function} warn
 * @property {Function} error
 */

/**
 * @returns {Notify}
 */
function useNotifications() {
  const service = useNotificationService(),
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