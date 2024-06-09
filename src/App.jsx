import React, {useEffect, useRef, useState, useContext, forwardRef, memo, useCallback} from "react";
import PropTypes from "prop-types";
import {CSSTransition, SwitchTransition} from "react-transition-group";

import "./App.less";

import createRouter, {/*useRouter,*/ RouterProvider} from "@components/router";
import Progress from "@components/progress/Progress";
import Config from "@config";
import {Notifications, useNotifications} from "@components/notifications";
import {useOnMount} from "@components/util/hooks";
import routes from "./routes";

// import top level styles
import "./index.less";


function createViewWrapper(View) {
  /* eslint-disable react/display-name */
  // Forward ref is for CSSTransition
  const Wrapper = forwardRef((props, ref) => {
    const {className} = props;
    return (
      <div className={`view-wrapper ${className}`} ref={ref}>
        {View ? <View context={props.context} /> : null}
      </div>
    );
  });
  Wrapper.displayName = `ViewWrapper(${View.displayName || View.name})`;
  Wrapper.propTypes = {
    className: PropTypes.string,
    context: PropTypes.object
  };
  return Wrapper;
}

/*
const ActionMessage = props => {
  const {message, actions = []} = props;
  return (
    <div className="action-message">
      <div className="message">{message}</div>
      <div className="actions">
        {actions.map((action, index) => (
          <button key={index} className="action" onClick={action.onClick}>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
ActionMessage.displayName = "ActionMessage";
ActionMessage.propTypes = {
  message: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  })).isRequired
};
*/



const AppBar = props => {
  const {title = "App", logo, logoAltText = "Logo", children} = props;
  return (
    <div className={`actionbar app-bar`}>
      <div className="branding">
        <img className="logo" alt={logoAltText} src={logo} />
        <h2 className="title">{title}</h2>
      </div>
      <div className="actions"></div>
      <div className="actions global-actions">{children}</div>
    </div>
  );
};
AppBar.propTypes = {
  title: PropTypes.string.isRequired,
  logo: PropTypes.string,
  logoAltText: PropTypes.string,
  children: PropTypes.any
};

function App({appBarPosition = "left"}) {
  const routerRef = useRef(),
      [routeContext = {
        config: {appBar: false}
      }, setRouteContext] = useState(),
      [isRouteLoading, setRouteLoading] = useState(false),
      {component: View, config = {}, route, data = {}} = routeContext,
      {appBar = true} = config,
      transitionRef = useRef(null),
      transitionKey = route ? route.path : "root",
      notify = useNotifications(),
      goAbout = useCallback(() => {
        routerRef.current.route("/about");
      }, []);

  /*
  // Set theme based on system preference
  useOnMount(() => {
    if(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.firstElementChild.dataset.theme = "dark";
    }else {
      document.firstElementChild.dataset.theme = "light";
    }
  }, []);
  */

  // Router setup
  useOnMount(function setupRouter() {
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
            notify({
              content: (
                <span>
                  {error.message}. <button className="small" onClick={() => router.route("/")}>Home</button>
                </span>
              ),
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
  });

  return (
    <RouterProvider router={routerRef.current}>
      <div className={`app appbar-${appBarPosition}`}>
        {appBar ? 
          <AppBar logo={Config.logo}
            // position="top"
            title={Config.appName}
            logoAltText="Logo">
            <button className="action"
                title={`About ${Config.appName}`}
                onClick={goAbout}
                aria-label="About">
              <i className="icon icon-info"></i>
            </button>
          </AppBar>
        : null}

        <SwitchTransition>
          <CSSTransition 
            classNames={"fadeup"}
            nodeRef={transitionRef} 
            key={transitionKey} 
            timeout={{enter: 400, exit: 10}}>
            {View ? 
              <View className={!appBar ? "no-appbar" : ""} context={data} ref={transitionRef} /> 
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
App.displayName = "App";
App.propTypes = {
  appBarPosition: PropTypes.oneOf(["top", "left"])
};

export default App;
