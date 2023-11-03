/* global */
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useRouter} from "@components/router";
import Actions from "@components/actionbar/Actions";
import Overlay from "@components/overlay/Overlay";
import {NotificationContext} from "@components/notifications";
import Config from "@config";

function random(max, min = 0) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const nTypes = ["success", "info", "warn", "error", "toast"];


/**
 * Adds an escape key listener to close the overlays
 * @param {boolean} show 
 * @param {Function} onCancel 
 */
function useEscapeClose(show, onCancel) {
  const [wasShown, setWasShown] = React.useState(false),
  close = e => {
    if(e.key === "Escape") {
      setTimeout(() => {
        onCancel();
      }, 30);
    }
  };

  useEffect(() => {
    if(show) {
      // console.log("Adding listener");
      document.addEventListener("keyup", close);
      setWasShown(true);
    }else {
      if(wasShown) {
        // console.log("Removing listener");
        document.removeEventListener("keyup", close);
        setTimeout(() => {
          onCancel();
        }, 30);
      }
    }
  }, [show]);
}


const View = props => {
  const notifications = useContext(NotificationContext),
      router = useRouter(), 
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
      showForm = useCallback(() => {
        router.route("/form");
      }, []),
      [showOverlay, setShowOverlay] = useState(false);

  useEscapeClose(showOverlay, () => setShowOverlay(false));

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
      <Actions target=".app-bar">
        <button title="Sample Form" className="action" onClick={showForm}>
          <i className="icon icon-clipboard"></i>
        </button>
        <button className="action" onClick={() => setShowOverlay(!showOverlay)}>
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
        <img style={{animationDuration: "30s"}}
          className="spin" src={Config.logo} width="120" alt="logo" />
      </div>
      <Overlay className="modal alert" show={showOverlay}>
        <div className="title">
          <h4><i className="icon icon-alert-circle" /> Alert!</h4>
        </div>
        <div className="content">
          This is a sample alert message. You can close this by clicking the close button 
          below or by pressing the escape key.
        </div>
        <div className="actions">
          <button className="primary inline" onClick={() => setShowOverlay(!showOverlay)}>Close</button>
        </div>
      </Overlay>
    </div>
  );
};
View.displayName = "LandingView";

export default View;
