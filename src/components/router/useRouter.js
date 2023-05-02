import {useContext} from "react";
import RouterContext from "./Context";

export default function useRouter() {
  return useContext(RouterContext);
}