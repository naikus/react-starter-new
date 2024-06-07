/* global */
import React, {useCallback, useContext, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {useRouter} from "@components/router";
import Actions from "@components/actionbar/Actions";
import {NotificationContext} from "@components/notifications";
import {
  Form,
  Field,
  registerFieldType,
  ruleBuilder as rb,
  MultiValInput,
  MultiSelect,
  FileUpload
} from "@components/form";

import {FieldGroup} from "@components/form/Form";
import "./style.less";

const validationRules = {
  name: [
    rb("required", {message: "Name is required"})
    // rb("fieldCompare", {field: "email"})
    // rb("length", {min: 3, message: "Name must be at least 3 characters"})
  ],
  email: [
    // rb("fieldCompare", {field: "name"})
  ],
  // Validation for MultiValInut "hobbies"
  hobbies: [(value, field, fields) => {
    if(!value || value.length < 1) {
      return {valid: false, message: "At least 1 hobby is required"};
    }
    if(value.length > 4) {
      return {valid: false, message: "A maximum of 4 hobbies are allowed"};
    }
  }],
  // Validation for MultiSelect "sports"
  sports: [(value, field, fields) => {
    if(!value || value.length !== 2) {
      return {valid: false, message: "Choose any 2 sports"};
    }
  }]
};

// Register these with Form (to support validation, form data)
registerFieldType("multival", MultiValInput);
registerFieldType("multiselect", MultiSelect);
registerFieldType("fileupload", FileUpload);

const View = props => {
  const {context: {formTitle}} = props, 
      notifications = useContext(NotificationContext),
      [valid, setValid] = useState(false),
      router = useRouter(),
      [data, setData] = useState({
        name: "Dead Pool",
        sports: ["soccer", "hockey"],
        files: []
      });

  return (
    <div className="view form-view">
      {/* eslint-disable-next-line react/no-unknown-property */}

      <Actions target=".app-bar">
        <button title="Disabled if the form is invalid"
            className="action"
            onClick={() => notifications.show({
              type: "info",
              content: "The form is valid!",
              timeout: 1000,
              position: "top"
            })}
            disabled={!valid}
            aria-label="Check Validity">
          <i className={`icon icon-message-square`}></i>
        </button>
      </Actions>
      <div className="content">
        <p className="message">
          Below is an example of the form with support for custom components 
          like MultiValInput, MultiSelect and FileUpload. See
          (<code>src/components/form</code>) for these components.
        </p>
        <Form title={formTitle}
          rules={validationRules}
          className="my-form"
          onChange={form => {
            // console.log(form);
            const {valid, data} = form;
            setValid(valid);
            setData(data);
          }}>
          
          <FieldGroup label="Personal Info" className="name-email" hint="Name &amp; email">
            <div className="row">
              <Field placeholder="Name" defaultValue={data.name} id="name" name="name" />
              <Field placeholder="Email" name="email" type="" />
            </div>
            <Field defaultValue={"option1"} type="radio-group" name="option" options={[
              {label: "Option 1", value: "option1"},
              {label: "Option 2", value: "option2"}
            ]} />
            <Field id="subs" label="Subscribe to my newsletter" name="subscribe" type="checkbox" />
          </FieldGroup>

          <Field name="hobbies" 
              placeholder="Enter multiple separated by comma"
              type="multival"
              label="Hobbies"
              // disabled={true}
              hint="Enter upto four"
            defaultValue={["Walking", "Web Development"]} />

          <Field name="sports" type="multiselect" label="Sports"
            hint="Choose all that apply"
            // disabled={true}
            // className="horizontal"
            defaultValue={data.sports}
            options={[
              {label: "Basketball", value: "basketball"},
              {label: "Soccer", value: "soccer"},
              {label: "Hockey", value: "hockey", disabled: true}
            ]} />

          <Field name="files"
            type="fileupload"
            label="Basketball Files"
            multiple={true}
            defaultValue={data.files}
            disabled={data.sports && data.sports.indexOf("basketball") === -1} />
          
          <div className="row">
            <button className="my-button primary" disabled={!valid} onClick={() => {
              const json = JSON.stringify(
                data,
                (k, v) => {
                  if(k === "files") {
                    return v ? v.map(f => f.name) : [];
                  }
                  return v;
                },
                " "
              );
              notifications.show({
                content: () => <pre style={{fontSize: "0.7rem"}}>{json}</pre>,
                type: "toast"
              });
            }}>
              <i className="icon-save" /> Submit
            </button>
            <button onClick={() => (
                router.back("/")
              )}>
              <i className="icon-home" /> Home
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};
View.displayName = "FormView";
View.propTypes = {
  context: PropTypes.object
};

export default View;
