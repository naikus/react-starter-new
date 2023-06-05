import React, {useEffect, useRef, useState, useContext, forwardRef, memo} from "react";
import PropTypes from "prop-types";
import {CSSTransition, SwitchTransition} from "react-transition-group";

import "./App.less";

import createRouter, {/*useRouter,*/ RouterProvider} from "@components/router";
import {AppBar} from "@components/appbar/Appbar";
import Progress from "@components/progress/Progress";
import Config from "@config";
import {Notifications, NotificationContext} from "@components/notifications";
import routes from "./routes";

// import top level styles
import "./index.less";


function createViewWrapper(View) {
  /* eslint-disable react/display-name */
  const Wrapper = forwardRef((props, ref) => {
    const {className} = props;
    return (
      <div className={`view-wrapper ${className}`} ref={ref}>
        {View ? <View /> : null}
      </div>
    );
  });
  Wrapper.displayName = `ViewWrapper(${View.displayName || View.name})`;
  Wrapper.propTypes = {
    className: PropTypes.string
  };
  return Wrapper;
}

function App() {
  const routerRef = useRef(),
      [routeContext = {}, setRouteContext] = useState(),
      [isRouteLoading, setRouteLoading] = useState(false),
      {component: View, config = {}, ...viewData} = routeContext,
      {appBar = true} = config,
      transitionRef = useRef(null),
      transitionKey = viewData.route ? viewData.route.path : "root",
      notifications = useContext(NotificationContext);

  // Router setup
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
            if(context.component) {
              context.component = memo(createViewWrapper(context.component));
            }
            setRouteLoading(false);
            setRouteContext(context);
          }),
          router.on("route-error", (event, error) => {
            setRouteLoading(false);
            notifications.show({
              content: error.message,
              type: "error",
              sticky: true
            });
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
          </AppBar>
        : null}

        <SwitchTransition>
          <CSSTransition 
            classNames={"fadeup"}
            nodeRef={transitionRef} 
            key={transitionKey} 
            timeout={{enter: 400, exit: 10}}>
            {View ? 
              <View className={!appBar ? "no-appbar" : ""} context={viewData} ref={transitionRef} /> 
            : <div />}
          </CSSTransition>
        </SwitchTransition>
        
        {isRouteLoading ? 
          <Progress className="global" /> 
        : null}

        <Notifications  />
      </div>
    </RouterProvider>
  );
}

export default App;
