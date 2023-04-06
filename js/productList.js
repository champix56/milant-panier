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
function loadProductContent(){}
function loadEvents(){}