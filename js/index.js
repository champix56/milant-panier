import { loadAsyncUnfinishedCart } from "./cart.js";
import { loadAsyncCartHistory } from "./cartHistory.js";
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
  loadAsyncUnfinishedCart();
  manageRoutes();
});
export function manageRoutes(redirectRoute) {
  let connected = false;
  let initialRoute =
    undefined === redirectRoute ? location.pathname : redirectRoute;
  const userCookie = getCookie("user");
  //if ("" !== userCookie) {
  try {
    //si le cookie est vide le parse genere une erreur qui renvoie vers catch
    connected = JSON.parse(userCookie).id;
    switch (initialRoute) {
      case "/connect":
        loadAsyncConnect();
        break;
      //not yet implented
      case "/carthistories":loadAsyncCartHistory(); break;
      case "/":
      case "/home":
      case "/products":
      default:
        loadAsyncProductList();
        break;
    }
  } catch (e) {
    loadConnect(initialRoute);
  }
  // }
}
