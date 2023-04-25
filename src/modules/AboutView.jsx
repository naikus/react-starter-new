import React, { useState } from "react";
import {useRouter} from "../components/router";


const View = props => {
  const router = useRouter();
  return (
    <div className="view about-view no-navbar">
      <div className="content _text-center">
        <button className="primary inline" onClick={() => router.back()}>
          <i className="icon icon-arrow-left" /> Back 89685
        </button>
      </div>

    </div>
  );
};
View.displayName = "AboutView";

export default View;