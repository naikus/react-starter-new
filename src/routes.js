// import AboutView from "./modules/AboutView";
// import LandingView from "./modules/LandingView";
// import FormView from "./modules/FormView";

/**
 * @typedef {import("simple-router").Router} Router
 * @typedef {import("simple-router").RouteDefn} RouteDefn
 */

export default [
  {
    path: "/",
    controller: async () => {
      return {
        forward: "/landing"
      };
    }
  },
  // Example of loading a view and it's dependencies lazily
  // Also how to pass query parameters e.g. "/landing?hello=world&world=hello"
  {
    path: "/landing{\\?:query}",
    controller: async context => {
      const {route: {params}} = context,
          {query = ""} = params,
          queryParams = new URLSearchParams(query);

      // console.log(queryParams.toString());
      const LandingView = (await import("./modules/LandingView")).default;
      return {
        // forward: "/route-error",
        component: LandingView,
        data: {
          queryParams
        }
      };
    }
  },
  {
    path: "/form",
    controller: async () => {
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
    controller: async () => {
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
