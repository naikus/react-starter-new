import {createElement as h} from "react";
import AboutView from "./modules/AboutView";
import LandingView from "./modules/LandingView";
import FormView from "./modules/FormView";

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
  {
    path: "/form",
    controller: context => {
      // console.log(context);
      return {
        // forward: "/route-error",
        component: FormView,
        // data passed to form view (can be fetched from server)
        data: {
          formTitle: "Hobby Form"
        }
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
