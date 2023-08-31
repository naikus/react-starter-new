/* global */
import React, {useCallback, useContext, useEffect, useState} from "react";
// import {useRouter} from "@components/router";
import {Actions} from "@components/appbar/Appbar";
import Overlay from "@components/overlay/Overlay";
import {NotificationContext} from "@components/notifications";
import Config from "@config";

function random(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const nTypes = ["success", "info", "warn", "error", "toast"];



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

  useEffect(() => {
    const close = e => {
      if(e.key === "Escape") {
        setTimeout(() => {
          setShow(false);
        }, 50);
      }
    };
    document.addEventListener("keyup", close);
    return () => {
      document.removeEventListener("keyup", close);
    };
  }, []);

  // console.log("Landing");
  return (
    <div className="view landing-view">
      <style>
        {`
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
      <div className="content anim">
        <img style={{animationDuration: "30s"}} className="spin" src={Config.logo} width="300" alt="logo" />
      </div>
      <Overlay className="modal alert" show={show}>
        <div className="title">
          <h4><i className="icon icon-alert-circle" /> Alert!</h4>
        </div>
        <div className="content">
          This is a sample alert message. You can close this by clicking the close button 
          below or by pressing the escape key.
        </div>
        <div className="actions">
          <button className="primary inline" onClick={() => setShow(!show)}>Close</button>
        </div>
      </Overlay>
    </div>
  );
};
View.displayName = "LandingView";

export default View;
