import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Config from "@config";
import {NotificationProvider} from "@components/notifications";

(() => {
  document.getElementById("favicon").href = Config.favicon;
  document.title = Config.appName;
})();
// /*
ReactDOM.createRoot(document.getElementById("root"))
    .render(
      <React.StrictMode>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </React.StrictMode>
    );
// */