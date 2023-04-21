/* global */
import React, {useState} from "react";
import {useRouter} from "../components/router";
import {Actions} from "../components/appbar/Appbar";
import Overlay from "../components/overlay/Overlay";

const View = props => {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState({
    fullName: "Aniket Naik",
    city: "Pune",
    address: "Pune",
    agreeToTerms: true,
    age: 30
  });

  const {fullName, city, address, agreeToTerms, age} = settings;

  const [valid, setValid] = useState(false);

  return (
    <div className="view landing-view">
      <Actions>
        <a className="action" onClick={() => setShow(!show)}>
          <i className="icon icon-bell"></i>
        </a>
      </Actions>
      <div className="content">
      
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
