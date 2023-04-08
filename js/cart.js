import { getCookie, REST_SERVER_ADR } from "./commonVariables.js";

let cart = { id: undefined, products: [] };

/**
 * load last cart not fully finished for userId
 */
export function loadAsyncUnfinishedCart() {
  let user = getCookie("user");
  if ("" === user) {
    return;
  }
  user = JSON.parse(user);
  fetch(
    REST_SERVER_ADR +
      "/paniers?statutId=0&_sort=lastStatusAction&_order=desc&userId=" +
      user.id
  )
    .then((r) => r.json())
    .then((arr) => {
      if (arr.length > 0) {
        cart = arr[0];
        cart.products.map(e=>addProductInCartDOM(e));
        console.log(cart);
      }
    });
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
  syncCart();
}
/**
 * create a new empty cart in db for a user
 * @param {Number} userId
 */
async function createCart() {
  const userId = JSON.parse(getCookie("user")).id;
  const promise = await fetch(REST_SERVER_ADR + "/paniers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      statutId: 0,
      lastStatusAction: new Date().toISOString(),
      statusHistorys: [{ statutId: 0, dateTime: new Date().toISOString() }],
      products: [],
    }),
  });
  return await promise.json();
  //.then((r) => r.json());
}
function refreshProductInCartDOM(productInCart) {
  const nodeProduct = document.querySelector("#produit-" + productInCart.id);
  nodeProduct.querySelector(".produit-quant").innerHTML = productInCart.quant;
  nodeProduct.parentElement.parentElement.querySelector(
    "#cart-total"
  ).innerHTML = getTotalCart().toFixed(2);
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
async function syncCart() {
  if (undefined === cart.id) {
    const c = await createCart();
    cart = { ...c, products: cart.products };
  }
  fetch(REST_SERVER_ADR + "/paniers/" + cart.id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });
}
export function cartClear() {
  cart = { id: undefined, products: [] };
}
export function changeCartState(stateValue) {
  if (undefined === cart.id) {
    return;
  }
  cart.statutId = stateValue;
  cart.lastStatusAction = new Date().toISOString();
  cart.statusHistorys.push({
    statutId: cart.statutId,
    dateTime: cart.lastStatusAction,
  });
  syncCart();
}
export function getTotalCart() {
  let total = 0.0;
  cart.products.map((e) => (total += e.quant * e.prix));
  return total;
}
