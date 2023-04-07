import { changeQuantityProductToCart } from "./cart.js";
import { REST_SERVER_ADR } from "./commonVariables.js";
let products = [];
let productListTemplate;
/**
 *
 * @param {HTMLElement} wrapper node to wrap template in
 */
export function loadAsyncProductList(wrapper) {
  if (undefined === productListTemplate) {
    fetch("/templates/produitsListe.html")
      .then((r) => r.text())
      .then((h) => {
        productListTemplate = h;
        loadTemplate(wrapper);
      });
  } else loadTemplate(wrapper);
}
/**
 * sync function to wrap content of list template
 * @param {HTMLElement} wrapper node to wrap in
 */
function loadTemplate(wrapper) {
  history.pushState(null, null, "/home");
  wrapper.innerHTML = productListTemplate;
  loadProductContent();
}
function loadProductContent() {
  /*recup des noeuds dans la structure , le container pour un produit a dupliquer et remplir et le parent pour mettre tous les enfants*/
  let uniqueProductTemplate = document.querySelector(".produit-in-liste");
  let wrapper = uniqueProductTemplate.parentNode;
  uniqueProductTemplate.style.display = "none";
  //uniqueProductTemplate=uniqueProductTemplate.cloneNode(true);
  fetch(REST_SERVER_ADR + "/produits")
    .then((r) => r.json())
    .then((arr) => {
      products = arr;
      arr.map((element, index, liste) => {
        const productNode = makeAProductNode(uniqueProductTemplate, element);
        wrapper.appendChild(productNode);
      });
    });
}
/**
 * assemble a node from base templte with product data
 * @param {HTMLElement} baseNodeToClone base template for a unique product
 * @param {Object} product product object with data 
 * @returns a HTML assembled node with product data
 */
function makeAProductNode(baseNodeToClone, product) {
  let produitElement = baseNodeToClone.cloneNode(true);
  produitElement.id = "produit-" + product.id;
  produitElement.style.display = "block";
  produitElement.querySelector("h3").innerHTML = product.nom;
  produitElement.querySelector("img").src = product.image;
  produitElement.querySelector(".prix").innerHTML = product.prix.toFixed(2);
  produitElement.addEventListener('click',e=>{
    if(confirm('Voulez vous ajouter ce produit au panier')){
        changeQuantityProductToCart(product);
        alert('produit ajouté');
    }
})
  return produitElement;
}
 
