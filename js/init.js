const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}
document.addEventListener('DOMContentLoaded', function() {
  // Verifica si el usuario tenía guardada una preferencia en localStorage
  if (localStorage.getItem('theme') === 'night') {
      document.body.classList.add('night'); 
      document.getElementById('mododia-noche').innerHTML = '<i class="fas fa-sun"></i>'; 
  }
  
  const modosNocheDia = document.getElementById('mododia-noche');
  if (modosNocheDia) { // Verifica que el botón esté en la página actual
      modosNocheDia.addEventListener('click', () => {
          document.body.classList.toggle('night');
          
          // Cambia el icono y guarda la preferencia
          if (document.body.classList.contains('night')) {
              modosNocheDia.innerHTML = '<i class="fas fa-sun"></i>';
              localStorage.setItem('theme', 'night');
          } else {
              modosNocheDia.innerHTML = '<i class="fas fa-moon"></i>';
              localStorage.removeItem('theme');
          }
      });
  }
});
