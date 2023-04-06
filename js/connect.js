import { getCookie, MD5, REST_SERVER_ADR, setCookie } from "./commonVariables.js";
import { loadAsyncProductList } from "./productList.js";

let connectTemplate = undefined;

/**
 * network loading html template if not already loading and caching in var connetTemplate
 * @param {HTMLElement} wrapper node to wrap template in
 */
export function loadAsyncConnect() {
    const wrapper=document.querySelector('#wrapper');
    history.pushState(null,null,'/connect');
    const userCookie=getCookie('user');
    if(undefined!=userCookie ){
        try{
            JSON.parse(userCookie).id;
            loadAsyncProductList(wrapper);
            return ;}catch(e){}
    }
  if (undefined === connectTemplate) {
    fetch("/templates/connect.html")
      .then((r) => r.text())
      .then((h) => {
        connectTemplate = h;
        loadConnectHTMLInElement(wrapper);
        return h;
      });
  } else loadConnectHTMLInElement(wrapper);
}
/**
 * sync loading function to wrap connect template in node and add events
 * @param {HTMLElement} wrapper node to wrap in
 */
function loadConnectHTMLInElement(wrapper) {
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
