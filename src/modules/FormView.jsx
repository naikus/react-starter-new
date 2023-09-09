/* global */
import React, {useCallback, useContext, useEffect, useState} from "react";
// import {useRouter} from "@components/router";
import {NotificationContext} from "@components/notifications";
import {Form, Field, registerFieldType, ruleBuilder as rb} from "@components/form/Form";
import MultiValInput from "@components/form/MultiValInput";
import MultiSelect from "../components/form/MultiSelect";

const formRules = {
  name: [rb("required")],
  // Validation for MultiValInut "hobbies"
  hobbies: [(value, field, fields) => {
    if(!value || value.length < 1) {
      return {valid: false, message: "At least one hobby is required"};
    }
    if(value.length > 4) {
      return {valid: false, message: "Only 4 hobbies allowed"};
    }
  }],
  // Validation for MultiSelect "sports"
  sports: [(value, field, fields) => {
    if(!value || value.length < 1) {
      return {valid: false, message: "At least one sport is required"};
    }
  }]
};

// Register these with Form (to support validation, form data)
registerFieldType("multival-input", MultiValInput);
registerFieldType("multiselect", MultiSelect);

const View = props => {
  const notifications = useContext(NotificationContext),
      [valid, setValid] = useState(false),
      [data, setData] = useState({});

  return (
    <div className="view form-view">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style scoped>
        {`
          .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding-top: 20px;
            position: relative;
            align-items: center;
          }
          .row {
            display: flex;
            flex-direction: row; 
          }
          .row > .field-container {
            flex: 1;
          }
          .row > .field-container:last-child {
            margin-left: 16px;
            flex: 2;
          }

          .message {
            padding: 16px;
            margin: 0px;
            margin-bottom: 24px;
            background-color: rgba(0, 173, 181, 0.13);
            border-radius: 8px;
          }
          .message code {
            font-size: 0.9rem;
          }
        `}
      </style>
      <div className="content">
        <p className="message">
          Below is an example of the form with support for custom components 
          like MultiValInput input and MultiSelect. See
          (<code>src/components/forms</code>) for these component
        </p>
        <Form rules={formRules} onChange={form => {
          const {valid, data} = form;
          setValid(valid);
          if(valid) {
            setData(data);
          }
        }}>
          <div className="row">
            <Field name="name" hint="Enter your full name" label="Name" />
            <Field name="hobbies" hint="Enter upto four" label="Hobbies" type="multival-input" />
          </div>
          <Field name="sports" type="multiselect" label="Sports"
            hint="Choose all that apply"
            options={[
              {label: "Basketball", value: "basketball"},
              {label: "Soccer", value: "soccer"},
              {label: "Hockey", value: "hockey"}
            ]} />
        </Form>
        <button className="primary inline" disabled={!valid} onClick={() => {
            notifications.show({
              content: () => <pre>{JSON.stringify(data, null, " ")}</pre>,
              type: "success"
            });
          }}>
          Submit
        </button>
      </div>
    </div>
  );
};
View.displayName = "FormView";

export default View;
