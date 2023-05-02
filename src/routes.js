import {createElement as h} from "react";
import AboutView from "./modules/AboutView";
import LandingView from "./modules/LandingView";

export default [
  {
    path: "/",
    controller: context => {
      // console.log(context);
      return {
        // forward: "/route-error",
        component: LandingView
      };
    }
  },
  /*
  {
    path: "/landing/:action?",
    controller: context => {
      console.log(context);
      return {
        
      };
    }
  },
  */
  {
    path: "/about",
    controller: context => {
      // const {route, state} = context;
      // console.log(context);
      return new Promise((res, rej) => {
        setTimeout(() => {
          res({
            component: AboutView,
            config: {
              appBar: false
            }
          });
        }, 1000);
      });
    }
  }
];
