const API_URL = "https://japceibal.github.io/emercado-api/products";

function showData(product) {
    const productInfoDiv = document.getElementById('product-info');
    productInfoDiv.innerHTML = `
        <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="img/prod${product.id}_1.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="img/prod${product.id}_2.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="img/prod${product.id}_3.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="img/prod${product.id}_4.jpg" class="d-block w-100" alt="...">
                </div>
                <div class="carousel-item">
                    <img src="img/prod${product.id}_5.jpg" class="d-block w-100" alt="...">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
                </button>
        </div>
        <div class="container info">
            <h2 class="modelo">${product.name}</h2>
            <span class="precio">$${product.cost} ${product.currency}</span><br>
            <br>
            <p class="descripcion">${product.description}</p>
            <p class="vendidos">${product.soldCount} productos vendidos.</p>
        </div>
    `;

    const relatedProductsDiv = document.getElementById('related-products-container');
    relatedProductsDiv.innerHTML = '';
    product.relatedProducts.forEach(products => {
        relatedProductsDiv.innerHTML += `
            <div class="product-card" onclick="setprodID(${products.id})">
                <div class="contenedor-foto">
                    <img src="${products.image}" alt="${products.name}">
                </div>
                <br>
                <h2 class="modelo">${products.name}</h2>
            </div>
        `;
    }); 
    
}

function setprodID(id) {
        localStorage.setItem("prodID", id);
        window.location = "product-info.html";
}

function showComments(comments){
    const comentariosDiv = document.getElementById('calificaciones-container');
    comentariosDiv.innerHTML = '';
    comments.forEach(comment => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        comentariosDiv.innerHTML += `
        <div class="d-flex pt-3">
            <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"> 
                <title>Placeholder</title> 
                <rect width="100%" height="100%" fill="#${randomColor}"></rect>
                <text x="50%" y="50%" fill="#${randomColor}" dy=".3em">32x32</text>
            </svg>
            <div class="pb-3 mb-0 small lh-sm border-bottom w-100">
                <div class="d-flex justify-content-between">
                    <strong>${comment.user}</strong>
                    <a class="fecha text-muted">${comment.dateTime}</a>
                    <a>
                        ${Array.from({ length: 5 }, (_, i) => `<span class="star ${i < comment.score ? 'filled' : ''}">★</span>`) .join('')}
                    </a>
                </div>
                <span class="d-block text-gray-dark">${comment.description}</span>
            </div>
        </div>
        <hr>
        `;
    }); 
}

document.getElementById("ratingForm").addEventListener("submit", function(event){
    event.preventDefault();
    if (localStorage.getItem('loggedIn') && localStorage.getItem('userName')) {
        var userName = localStorage.getItem('userName');
        const descripcion = document.getElementById('comment').value;
        const rate = document.querySelector('input[name="rating"]:checked')?.value; // Captura el valor de la calificación
         // Captura la fecha y hora actual
        const currentDate = new Date(); // Obtiene la fecha y hora actuales
         const year = currentDate.getFullYear(); // Obtiene el año
         const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Obtiene el mes (0-11), por eso sumamos 1 y formateamos con dos dígitos
         const day = String(currentDate.getDate()).padStart(2, '0'); // Obtiene el día del mes y formatea con dos dígitos
         const dateString = `${year}-${month}-${day}`; // Formatea la fecha con guiones
        const timeString = currentDate.toLocaleTimeString(); // Formato de hora (hh:mm:ss AM/PM)
        const newComment = {
            product : localStorage.getItem('prodID'),
            score: rate,
            description: descripcion,
            user: userName,
            dateTime: `${dateString} ${timeString}`
        };

        // Añadir el nuevo comentario a los datos ya cargados
        commentsData.push(newComment);
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Agregaste un comentario!",
            showConfirmButton: false,
            timer: 1500
        });

        // Llamar a showComments para actualizar la vista
        showComments(commentsData);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Debes iniciar sesión para realizar un comentario.",
        });
    }
});

document.addEventListener("DOMContentLoaded", function(e){
    const productId = localStorage.getItem('prodID');
    getJSONData(`${PRODUCT_INFO_URL}${productId}.json`).then(function(resultObj){
        if (resultObj.status === "ok"){
            showData(resultObj.data)
        }
    });
    getJSONData(`${PRODUCT_INFO_COMMENTS_URL}${productId}.json`).then(function(resultObj){
        if (resultObj.status === "ok"){
            commentsData = resultObj.data;
            showComments(commentsData)
        }
    });
});

//sección de compra
const btnComprar = document.getElementById('btnComprar');
const btnMenos = document.getElementById('btnMenos');
const btnMas = document.getElementById('btnMas');
const cantidadInput = document.getElementById('cantidad');


btnComprar.addEventListener('click', () => {
    const cantidad = parseInt(cantidadInput.value);
    
    if (isNaN(cantidad) || cantidad <= 0) {

        Swal.fire({
            icon: "error",
            title:"Oops...",
            text: 'Por favor, ingresa una cantidad válida.',
        });
        return;
    }
    
    const producto = {
    id: parseInt(localStorage.getItem('prodID')),
    nombre: document.getElementById('product-info').querySelector('.modelo').textContent.trim(),
    precio: parseFloat(document.getElementById('product-info').querySelector('.precio').textContent.split('$')[1]),
    moneda: document.getElementById('product-info').querySelector('.precio').textContent.split(' ')[1], // Guarda la moneda
    imagen: document.getElementById('carouselExampleControls').querySelector('.active img').src,
    cantidad: cantidad
    };

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    // Redirigir al carrito
    window.location.href = 'cart.html';
});

btnMenos.addEventListener('click', () => {
    let cantidad = parseInt(cantidadInput.value);
    if (cantidad > 1) {
        cantidad--;
        cantidadInput.value = cantidad;
    }
});

btnMas.addEventListener('click', () => {
    let cantidad = parseInt(cantidadInput.value);
    cantidad++;
    cantidadInput.value = cantidad;
});
