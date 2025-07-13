let carrito = JSON.parse(localStorage.getItem('carrito')) || [];


// Función para obtener los productos del carrito desde localStorage
function getCartItems() {
    const cartItems = localStorage.getItem('carrito');
    return cartItems ? JSON.parse(cartItems) : []; // Si no existe, devuelve un array vacío
  }
 
  // Función para actualizar el badge con el total de cantidades
  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const cartItems = getCartItems(); // Obtener productos del localStorage


    // Inicializar el total de cantidades
    let totalCantidad = 0;
   
    // Sumar cantidades de cada producto
    cartItems.forEach(item => {
      totalCantidad += item.cantidad;
    });
 
    // Actualizar el texto del badge con el total de cantidades
    badge.textContent = totalCantidad;
  }
 
  // Inicializa el badge al cargar la página con la cantidad de productos en el carrito
  document.addEventListener("DOMContentLoaded", updateCartBadge);



document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});


document.getElementById('logout').addEventListener('click', function() {
    // Borrar los datos del usuario en localStorage
    localStorage.clear();
   
    // Redirigir a la página de login
    window.location.href = "login.html";
});
