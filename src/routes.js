import {createElement as h} from "react";
import AboutView from "./modules/AboutView";
import LandingView from "./modules/LandingView";

export default [
  {
    path: "/",
    controller: context => {
      return {
        // redirect: "/route-error",
        component: LandingView
      };
    }
  },
  {
    path: "/about",
    controller: context => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res({
            component: AboutView,
            appBar: false
          });
        }, 2000);
      });
    }
  }
];
