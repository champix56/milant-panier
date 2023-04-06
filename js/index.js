import { loadAsyncConnect as loadConnect } from "./connect.js";
import { loadNavbar } from "./navbar.js";

/**
 * event de chargement principale du DOM
 */
addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  loadConnect(document.querySelector('#wrapper'));
});
