import { getCookie } from "./commonVariables.js";
import {
  loadAsyncConnect,
  loadAsyncConnect as loadConnect,
} from "./connect.js";
import { loadNavbar } from "./navbar.js";
import { loadAsyncProductList } from "./productList.js";

/**
 * event de chargement principale du DOM
 */
addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  manageRoutes();
});
export function manageRoutes(redirectRoute) {
  let connected = false;
  let initialRoute =
    undefined === redirectRoute ? location.pathname : redirectRoute;
  const userCookie = getCookie("user");
  if (undefined != userCookie) {
    try {
      connected = JSON.parse(userCookie).id;
      switch (initialRoute) {
        case "/connect":
          loadAsyncConnect();
          break;
        case "/":
        case "/products":
        default:
          loadAsyncProductList();
          break;
      }
    } catch (e) {
      loadConnect(initialRoute);
    }
  }
}
