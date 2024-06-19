import AboutView from "./modules/AboutView";
import LandingView from "./modules/LandingView";
import FormView from "./modules/FormView";
// const {XRMeetingCanvas, isXRSupported} = lazy(() => delay(import("../meeting-canvas-xr/XRCanvas")));

/**
 * Lazily import a route view
 * @param {String} path The route path e.g. "./modules/FormView"
 * @param {boolean} isDefault Whether this is a default module
 * @returns {Object} ESModule.default if default is true, else The ESModule
 */
async function lazy(path, isDefault = true) {
  const module = await import(path);
  return isDefault ? module.default : module;
}

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
  // Example of loading a view and it's dependencies lazily
  /*
  {
    path: "/form",
    controller: async context => {
      const FormView = await lazy("./modules/FormView");
      return {
        // forward: "/route-error",
        component: FormView,
        // data passed to form view (can be fetched from server)
        data: {
          formTitle: "Hobby Form"
        }
      };
    }
  }
  */

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
