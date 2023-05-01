import React from "react";

export default React.createContext({
  show: () => {},
  next: () => {},
  current: null,
  setCurrent: () => {}
});