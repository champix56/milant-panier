import { disconnect, loadAsyncConnect } from "./connect.js";

/**
 * fonction de chargement des events de
 * @param {Element} navbarDivElement div element in html to load in
 */
function loadNavbarEvents(navbarDivElement) {
    navbarDivElement.querySelector("#disconnect").addEventListener('click',e=>{
        disconnect();
        
        loadAsyncConnect();
    })
}
/**
 * chargement de la bar de nav avec ajout des events
 */
export function loadNavbar() {
    let navbarDiv = document.querySelector("#navbar");
    //  je recupere le fichier contenant la structure de la navbar en async avec fetch
    fetch("templates/navbar.html")
      .then((fluxReponse) => fluxReponse.text())
      .then((html) => {
          //attention les scripts dans du html prevenant d'un xhr/fetch ne sont pas executer
        navbarDiv.innerHTML = html;
      loadNavbarEvents(navbarDiv)
      });
  }