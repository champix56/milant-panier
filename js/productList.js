import { REST_SERVER_ADR } from "./commonVariables.js";

let productListTemplate;
/**
 * 
 * @param {HTMLElement} wrapper node to wrap template in  
 */
export function loadAsyncProductList(wrapper){
    if(undefined===productListTemplate)
    {
        fetch('/templates/produitsListe.html').then(r=>r.text()).then(h=>{
            productListTemplate=h;
            loadTemplate(wrapper);
        })
    }
    else loadTemplate(wrapper);
}
/**
 * sync function to wrap content of list template
 * @param {HTMLElement} wrapper node to wrap in  
 */
function loadTemplate(wrapper) {
    history.pushState(null, null, "/home");
    wrapper.innerHTML     = productListTemplate;   
    loadProductContent();
}
function loadProductContent(){
/*recup des noeuds dans la structure , le container pour un produit a dupliquer et remplir et le parent pour mettre tous les enfants*/
    let uniqueProductTemplate = document.querySelector(".produit-in-liste")
    let wrapper=uniqueProductTemplate.parentNode;
    uniqueProductTemplate.style.display='none';
    //uniqueProductTemplate=uniqueProductTemplate.cloneNode(true);
    fetch(REST_SERVER_ADR+'/produits').then(r=>r.json()).then(arr=>{
        arr.map((element,index,liste)=>{
            let produitElement= uniqueProductTemplate.cloneNode(true);
            produitElement.id="produit-"+element.id;
            produitElement.style.display="block";
            produitElement.querySelector('h3').innerHTML=element.nom;
            produitElement.querySelector('img').src=element.image;
            produitElement.querySelector('.prix').innerHTML=element.prix.toFixed(2);
            loadUniqueProduitEvent(produitElement);
            wrapper.appendChild(produitElement);
        });
    })

}
function loadUniqueProduitEvent(produitElement){}