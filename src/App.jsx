import React, {useEffect, useRef, useState} from "react";
import createRouter, {/*useRouter,*/ RouterProvider} from "./components/router";

import {AppBar} from "./components/appbar/Appbar";

import routes from "./routes";
import "./index.less";
import "./App.less";
import Progress from "./components/progress/Progress";
import Config from "./config";

function App() {
  const routerRef = useRef(),
      [routeContext = {}, setRouteContext] = useState(),
      [isRouteLoading, setRouteLoading] = useState(false),
      {component: View, appBar = true, ...viewData} = routeContext;

  useEffect(() => {
    const router = createRouter(routes, {
          defaultRoute: "/",
          errorRoute: "/~error"
        }),
        subs = [
          router.on("before-route", (event, data) => {
            setRouteLoading(true);
          }),
          router.on("route", (event, context) => {
            // console.log("Setting route", context);
            setRouteLoading(false);
            setRouteContext(context);
          }),
          router.on("route-error", (event, error) => {
            setRouteLoading(false);
          })
        ];

    routerRef.current = router;
    router.start();
    router.route(router.getBrowserRoute() || "/");
    return () => {
      subs.forEach(sub => sub.dispose());
      router.stop();
    };
  }, []);

  return (
    <RouterProvider router={routerRef.current}>
      <div className="app">
        {appBar ? 
          <AppBar logo={Config.logo}
            title={Config.appName}
            logoAltText="Logo">
            <a className="action" href="#/about">
              <i className="icon icon-info"></i>
            </a>
          </AppBar> : 
          null
        }
        {View ? <View context={viewData} /> : null}
        {isRouteLoading ? <Progress /> : null}
      </div>
    </RouterProvider>
  );
}

export default App;
