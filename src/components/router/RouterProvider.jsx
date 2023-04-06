import React from  "react";
import PropTypes from "prop-types";
import Context from "./RouterContext";

/**
 * A Router context provider
 * @param {*} props The props object
 * @return {Context.Provider} A datalayer provider
 */
function Provider(props) {
  const {router, children} = props;
  return (
    <Context.Provider value={router}>
      {children}
    </Context.Provider>
  );
}
Provider.displayName = "RouterProvider";
Provider.propTypes = {
  router: PropTypes.object,
  children: PropTypes.node
};

export default Provider;