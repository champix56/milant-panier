import { REST_SERVER_ADR } from "./commonVariables.js";

let cart = { cartId: undefined, products: [] };

/**
 * load last cart not fully finished for userId
 * @param {Number} userid
 */
export function loadAsyncUnfinishedCart(userid) {
  fetch(REST_SERVER_ADR + "/carts?&userId=" + userid)
    .then((r) => r.json())
    .then((arr) => console.log(arr));
}
/**
 * change quantity or add a product in cart
 * @param {Object} product
 * @param {Number} value
 */
export function changeQuantityProductToCart(product, value = 1) {
  const productInCart = cart.products.find((e) => e.id === product.id);
  if (productInCart) {
    productInCart.quant += value;
    refreshProductInCartDOM(productInCart);
  } else {
    product.quant = value;
    cart.products.push(product);
    addProductInCartDOM(product);
  }
}
/**
 * create a new empty cart in db for a user
 * @param {Number} userId
 */
function createCart(userId) {
  fetch(REST_SERVER_ADR + "/carts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      body: JSON.stringify({ userId: userId }),
    },
  }).then((r) => r.json());
}
function refreshProductInCartDOM(productInCart) {
  const nodeProduct = document.querySelector("#produit-" + productInCart.id);
  nodeProduct.querySelector(".produit-quant").innerHTML = productInCart.quant;
}
function addProductInCartDOM(productInCart) {
  const panier = document.querySelector("#produit-").parentElement;
  const nodeToClone = document.querySelector("#produit-").cloneNode(true);
  nodeToClone.id += productInCart.id;
  nodeToClone.querySelector(".produit-name").innerHTML = productInCart.nom;
  nodeToClone.querySelector(".produit-img").src = productInCart.image;
  nodeToClone
    .querySelector(".produit-remove-icon")
    .addEventListener("click", (e) => {
      changeQuantityProductToCart(productInCart, -1);
    });
  nodeToClone
    .querySelector(".produit-add-icon")
    .addEventListener("click", (e) => {
      changeQuantityProductToCart(productInCart, 1);
    });

  panier.append(nodeToClone);
  refreshProductInCartDOM(productInCart);
}
