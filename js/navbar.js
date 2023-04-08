import { cartClear, changeCartState, getTotalCart } from "./cart.js";
import { loadAsyncCartHistory } from "./cartHistory.js";
import { BASE_HTTP_WEB_URL } from "./commonVariables.js";
import { disconnect, loadAsyncConnect } from "./connect.js";

/**
 * fonction de chargement des events de navbar
 * @param {Element} navbarDivElement div element in html to load in
 */
function loadNavbarEvents(navbarDivElement) {
  //deonnxion des liens pointant vers # de la navbar
  navbarDivElement.querySelectorAll('a[href="#"]').forEach((e) => {
    e.addEventListener("click", (evt) => evt.preventDefault());
  });
  navbarDivElement
    .querySelector("#disconnect")
    .addEventListener("click", (e) => {
      disconnect();
      loadAsyncConnect();
    });
     navbarDivElement
     .querySelector("#cart-history").addEventListener('click',evt=>{evt.preventDefault();loadAsyncCartHistory();})
    navbarDivElement
    .querySelector("#validate-cart")
    .addEventListener("click", (e) => {
      //passage de l'etat a 1:valider sur le panier
        changeCartState(1);
        cartClear();
        //je recupere le template pour le reijecter apres vidange
        const uniqueTemplateProduct=navbarDivElement.querySelector('#produit-').innerHTML;
        const cartDOM=navbarDivElement.querySelector('#panier-produits');
        cartDOM.innerHTML=uniqueTemplateProduct;
        cartDOM.firstElementChild.id="produit-"
        navbarDivElement.querySelector('#cart-total').innerHTML=0.00;


    });
}
/**
 * chargement de la bar de nav avec ajout des events
 */
export function loadNavbar() {
  let navbarDiv = document.querySelector("#navbar");
  //  je recupere le fichier contenant la structure de la navbar en async avec fetch
  fetch(BASE_HTTP_WEB_URL+"/templates/navbar.html")
    .then((fluxReponse) => fluxReponse.text())
    .then((html) => {
      //attention les scripts dans du html prevenant d'un xhr/fetch ne sont pas executer
      navbarDiv.innerHTML = html;
      loadNavbarEvents(navbarDiv);
    });
}
