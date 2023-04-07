import { getCookie, MD5, REST_SERVER_ADR, setCookie, wrapper } from "./commonVariables.js";
import { manageRoutes } from "./index.js";
import { loadAsyncProductList } from "./productList.js";

let connectTemplate = undefined;
let RedirectRoute=undefined;
/**
 * network loading html template if not already loading and caching in var connetTemplate
 * @param {String} initialRoute route to redirect after connect if is set
 */
export function loadAsyncConnect(initialRoute) {
    RedirectRoute=initialRoute;
    history.pushState(null,null,'/connect');
  if (undefined === connectTemplate) {
    fetch("/templates/connect.html")
      .then((r) => r.text())
      .then((h) => {
        connectTemplate = h;
        loadConnectHTMLInElement();
        return h;
      });
  } else loadConnectHTMLInElement();
}
/**
 * sync loading function to wrap connect template in node and add events
 */
function loadConnectHTMLInElement() {
  wrapper.innerHTML = connectTemplate;
  loadConnectEvents(wrapper);
}
function loadConnectEvents(wrapper) {
  wrapper.querySelector("form").addEventListener("submit", (evt) => {
    evt.preventDefault();
    doConnection(evt.target["login"].value, evt.target["password"].value);
  });
}
function doConnection(login, password) {
  fetch(`${REST_SERVER_ADR}/users?passhash=${MD5(password)}&login=${login}`)
    .then((r) => {
      console.log(r.url);
      if (r.ok) return r.json();
      else throw new Error("User not found");
    })
    .then((o) => {
      if (undefined !== o[0]) connected(o[0]);
      console.log(o);
    });
}
function connected(user) {
  window.user = user;
  //setcookie
  setCookie("user", JSON.stringify(user), 7);
manageRoutes(RedirectRoute);
  loadAsyncProductList(document.querySelector("#wrapper"));

}
function subscribe(login, password) {
  fetch(REST_SERVER_ADR + "/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: login, hashpass: MD5(password) }),
  }).then((r) => doConnection(login, password));
}
export function disconnect() {
  setCookie('user',undefined,-1);
}
