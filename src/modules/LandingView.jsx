/* global */
import React, {useState} from "react";
import {useRouter} from "../components/router";
import {Actions} from "../components/appbar/Appbar";
import Overlay from "../components/overlay/Overlay";

const View = props => {
  const router = useRouter(), [show, setShow] = useState(false);
  return (
    <div className="view landing-view">
      <Actions>
        <a className="action" onClick={() => setShow(!show)}>
          <i className="icon icon-bell"></i>
        </a>
      </Actions>
      <div className="content">
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        <h1>Hello!</h1>
        
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
