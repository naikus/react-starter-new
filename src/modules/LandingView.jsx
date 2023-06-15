/* global */
import React, {useCallback, useContext, useState} from "react";
// import {useRouter} from "@components/router";
import {Actions} from "@components/appbar/Appbar";
import Overlay from "@components/overlay/Overlay";
import {NotificationContext} from "@components/notifications";
import Config from "@config";

function random(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const nTypes = ["success", "info", "warn", "error"];

const View = props => {
  const notifications = useContext(NotificationContext),
      // router = useRouter(), 
      toggleScheme = useCallback(() => {
        const root = document.firstElementChild,
            data = root.dataset,
            theme = data.theme;
        if(theme === "light") {
          data.theme = "dark";
        }else {
          data.theme = "light";
        }
      }, []),
      [show, setShow] = useState(false);
  return (
    <div className="view landing-view">
      <style>
        {`
          .alert {
            height: 50%;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            border-radius: 20px 20px 0 0
          }

          .landing-view .content {
            display: flex;
            justify-content: center;
            padding-top: 100px;
            position: relative;
          }
        `}
      </style>
      <Actions>
        <button className="action" onClick={() => setShow(!show)}>
          <i className="icon icon-eye"></i>
        </button>
        <button className="action" onClick={() => toggleScheme()}>
          <i className="icon icon-sun"></i>
        </button>
        <button className="action" onClick={() => {
            notifications.show({
              content: (message) => `This is a ${message.type} message`,
              type: nTypes[random(nTypes.length - 1)],
              sticky: random(1, 0),
              timeout: 2000
            });
          }}>
          <i className="icon icon-bell"></i>
        </button>
      </Actions>
      <div className="content">
        <img src={Config.logo} width="300" alt="logo" />
      </div>
      <Overlay className="modal" show={show}>
        <div className="title">Hola!</div>
        <div className="message">Hello world</div>
        <div className="actions">
          <button className="primary inline" onClick={() => setShow(!show)}>Close</button>
        </div>
      </Overlay>
    </div>
  );
};
View.displayName = "LandingView";

export default View;
