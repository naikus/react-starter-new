/* global */
import React, {useCallback, useContext, useEffect, useState} from "react";
// import {useRouter} from "@components/router";
import {Actions} from "@components/appbar/Appbar";
import {NotificationContext} from "@components/notifications";
import {Form, Field, registerFieldType, ruleBuilder as rb} from "@components/form/Form";
import MultiValInput from "@components/form/MultiValInput";
import MultiSelect from "@components/form/MultiSelect";
import FileUpload from "@components/form/FileUpload";

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
registerFieldType("multival", MultiValInput);
registerFieldType("multiselect", MultiSelect);
registerFieldType("fileupload", FileUpload);

const View = props => {
  const notifications = useContext(NotificationContext),
      [valid, setValid] = useState(false),
      [data, setData] = useState({
        sports: [],
        files: []
      });

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
            /* font-size: .9em; */
          }
          .message code {
            /* font-size: 0.9em; */
          }
        `}
      </style>
      <Actions>
        <button title="Disabled if the form is invalid"
            className="action"
            onClick={() => notifications.show({
              type: "info",
              content: "The form is valid!"
            })}
            disabled={!valid}>
          <i className={`icon icon-message-square`}></i>
        </button>
      </Actions>
      <div className="content">
        <p className="message">
          Below is an example of the form with support for custom components 
          like MultiValInput, MultiSelect and FileUpload. See
          (<code>src/components/forms</code>) for these components.
        </p>
        <Form rules={formRules} onChange={form => {
          const {valid, data} = form;
          setValid(valid);
          if(valid) {
            setData(data);
          }
        }}>
          <div className="row">
            <Field id="name" name="name" hint="Enter your full name" label="Name" />
            <Field name="hobbies" 
              type="multival"
              label="Hobbies"
              hint="Enter upto four"
              defaultValue={["Walking", "Web Development"]} />
          </div>
          <Field name="sports" type="multiselect" label="Sports"
            hint="Choose all that apply"
            // disabled={true}
            defaultValue={data.sports}
            options={[
              {label: "Basketball", value: "basketball"},
              {label: "Soccer", value: "soccer"},
              {label: "Hockey", value: "hockey", disabled: true}
            ]} />

          <Field name="files"
              type="fileupload"
              label="Files"
              defaultValue={data.files}
              disabled={data.sports.length !== 2} />
        </Form>
        <button className="primary inline" disabled={!valid} onClick={() => {
            const json = JSON.stringify(
              data,
              (k, v) => {
                if(k === "files") {
                  return v ? v.map(f => f.name) : [];
                }
                return v;
              },
              "  "
            );
            notifications.show({
              content: () => <pre style={{fontSize: "0.7rem"}}>{json}</pre>,
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
