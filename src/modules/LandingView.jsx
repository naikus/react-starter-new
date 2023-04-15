/* global */
import React, {useState} from "react";
import {useRouter} from "../components/router";
import {Actions} from "../components/appbar/Appbar";
import Overlay from "../components/overlay/Overlay";

import {Form, Field} from "../components/form/Form";
import {rules, ruleBuilder} from "../components/form/rule-builder";

const validationRules = {
  fullName: [
    ruleBuilder("required")
  ],
  address: [
    ruleBuilder("required")
  ],
  agreeToTerms: [
    (value, field, context) => {
      if(!value) {
        return {valid: false, message: "You must agree to terms and conditions"};
      }
    }
  ]
};

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

  return (
    <div className="view landing-view">
      <Actions>
        <a className="action" onClick={() => setShow(!show)}>
          <i className="icon icon-bell"></i>
        </a>
      </Actions>
      <div className="content">
      <Form rules={validationRules}
        onChange={fm => {
          const {data: newSettings, valid, validation} = fm;
          console.log(fm);
          if(valid) {
            // console.log("Form valid");
            // setSettings(newSettings);
          }else {
            // console.log("Form invalid");
            // setSettings(newSettings);
            // this.setState({valid, setttings: newSettings});
          }
        }}>

        <Field type="text"
          name="fullName"
          defaultValue={fullName}
          label="Full Name"
          data-hint="Your given name and last name" />

        <Field type="select"
          name="city"
          defaultValue={city}
          label="City"
          data-hint="Choose a city">
          <option value="Banglore">Banglore</option>
          <option value="Delhi">Delhi</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
        </Field>

        <label>
          <Field name="agreeToTerms"
            type="checkbox"
            value={agreeToTerms}
            defaultChecked={agreeToTerms}
            label="I agree to terms and conditions"
            data-hint="You must agree :D" />
        </label>
        {/*

        <Field type="textarea" name="address"
          value={address}
          label="Address"
          data-hint="Your street address" />

        <Field type="range" name="age"
          min={10}
          max={150}
          data-hint="Between 10 and 150"
          value={age}
          step={1}
          label="Your Age" />

        <Field name="agreeToTerms"
          type="checkbox"
          value={agreeToTerms}
          label="I agree to terms and conditions"
          data-hint="You must agree :D" />
        
        <Field name="myRadio"
          type="radio"
          label="Option 1" />
        <Field name="myRadio"
          type="radio"
          label="Option 2" />
        */}
      </Form>
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
