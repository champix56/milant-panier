import { getCookie, REST_SERVER_ADR, wrapper } from "./commonVariables.js";

let cartHistoryTemplate = "";
let cartHistories = [];
export async function loadAsyncCartHistory() {
  if (cartHistoryTemplate === "") {
    const promise = await fetch("/templates/cartHistory.html");
    cartHistoryTemplate = await promise.text();
  }
  history.pushState(null, null, "/carthistories");
  wrapper.innerHTML = cartHistoryTemplate;
  loadAllHistories();
  
}
async function loadAllHistories() {
  try {
    const userId = JSON.parse(getCookie("user")).id;
    const promise = await fetch(
      REST_SERVER_ADR +
        "/paniers?_expand=statut&_sort=lastStatusAction&_order=desc&userId=" +
        userId
    );
    cartHistories = await promise.json();
    loadDOMHistories();
    console.log(cartHistories);
  } catch (ex) {console.error(ex);}
}
function loadDOMHistories(){
    const historiesContainer=wrapper.querySelector("#history-").parentElement;
    cartHistories.map((e) => {
        const nodeCloned = wrapper.querySelector("#history-").cloneNode(true);
        nodeCloned.id = "history-" + e.id;
        nodeCloned.style.display="block";
        nodeCloned.querySelector('.history-date').innerHTML=e.lastStatusAction;
        nodeCloned.querySelector('.history-state').innerHTML=e.statut.nom;
        nodeCloned.querySelector('.history-id').innerHTML=e.id;

        const productTemplate=nodeCloned.querySelector('.history-product');
        productTemplate.remove();
        historiesContainer.append(nodeCloned);    
        nodeCloned.querySelector('.header').addEventListener('click',evt=>{
            const productsNode=$("#history-" + e.id+" .products");
            /*if(productsNode.css('display')==='none')productsNode.slideDown();
            else productsNode.slideUp();*/
            productsNode.slideToggle(600,()=>productsNode.css('display','flex'))
        })
        const productsContainer=nodeCloned.querySelector('.products');
        e.products.map(p=>{
            const productNodeCloned=productTemplate.cloneNode(true);
            productNodeCloned.id='product-'+p.id;
            productNodeCloned.querySelector('h3').innerHTML=p.nom;
            productNodeCloned.querySelector('h4').innerHTML='Quantité : '+p.quant;
            productsContainer.append(productNodeCloned);
        })
      });
}