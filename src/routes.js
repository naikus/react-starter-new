// import AboutView from "./modules/AboutView";
// import LandingView from "./modules/LandingView";
// import FormView from "./modules/FormView";

/**
 * @typedef {import("simple-router").Router} Router
 * @typedef {import("simple-router").RouteDefn} RouteDefn
 */

export default [
  /*
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
  */
  // Example of loading a view and it's dependencies lazily
  {
    path: "/",
    controller: async context => {
      // console.log(context);
      const LandingView = (await import("./modules/LandingView")).default;
      return {
        // forward: "/route-error",
        component: LandingView
      };
    }
  },
  {
    path: "/form",
    controller: async context => {
      const FormView = (await import("./modules/FormView")).default;
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
  {
    path: "/about",
    controller: async context => {
      const AboutView = (await import("./modules/AboutView")).default;

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
