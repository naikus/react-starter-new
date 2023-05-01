/* global */
import React, {useContext, useState} from "react";
import {useRouter} from "../components/router";
import {Actions} from "../components/appbar/Appbar";
import Overlay from "../components/overlay/Overlay";
import {NotificationContext} from "../components/notifications";

const View = props => {
  const router = useRouter(), 
      notifications = useContext(NotificationContext),
      [show, setShow] = useState(false);
  return (
    <div className="view landing-view">
      <style>
        {`
          .modal.alert {
            max-width: 350px;
          }
        `}
      </style>
      <Actions>
        <a className="action" onClick={() => setShow(!show)}>
          <i className="icon icon-bell"></i>
        </a>
        <a className="action" onClick={() => {
          notifications.show({
            content: "Hello world",
            type: "info"
            // sticky: true
          });
        }}>
          <i className="icon icon-star"></i>
        </a>
      </Actions>
      <div className="content">
        <div className="title">Hola!</div>
        
      </div>
      <Overlay className="modal alert" show={show}>
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
