import React, { useState } from "react";
import {useRouter} from "../components/router";
import Config from "../config";

const View = props => {
  const router = useRouter();
  return (
    <div className="view about-view no-navbar">
      <style>
        {`
          .about-view .content {
            display: flex;
            align-items: center;
            padding-top: 100px;
            flex-direction: column;
          }
        `}
      </style>
      <div className="content _text-center">
        <pre>{Config.appName} ({Config.appVersion})</pre>
        <button className="primary inline" onClick={() => router.back()}>
          <i className="icon icon-arrow-left" /> Back
        </button>
      </div>

    </div>
  );
};
View.displayName = "AboutView";

export default View;