const API_URL = "https://japceibal.github.io/emercado-api/cats_products";

function setProdId(id) {
    localStorage.setItem("prodID", id);
}

function filterByPrice(products) {
    const minPrice = document.getElementById('rangeFilterCountMin').value;
    const maxPrice = document.getElementById('rangeFilterCountMax').value;

    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || Infinity;

    return products.filter(product => product.cost >= min && product.cost <= max);
}

function sortProducts(products) {
    const sortAscPrice = document.getElementById('sortAscPrice').checked;
    const sortDescPrice = document.getElementById('sortDescPrice').checked;
    const sortByCount = document.getElementById('sortByCount').checked;

    if (sortAscPrice) {
        products.sort((a, b) => a.cost - b.cost); // Ordenar por precio ascendente
    } else if (sortDescPrice) {
        products.sort((a, b) => b.cost - a.cost); // Ordenar por precio descendente
    } else if (sortByCount) {
        products.sort((a, b) => b.soldCount - a.soldCount); // Ordenar por relevancia
    }

    return products;
}

function applyFiltersAndShowData() {
    let filteredProducts = filterByPrice(allProducts);
    let sortedProducts = sortProducts(filteredProducts);
    showData(sortedProducts);
}


document.getElementById('rangeFilterCount').addEventListener('click', applyFiltersAndShowData);
document.getElementById('sortAscPrice').addEventListener('change', applyFiltersAndShowData);
document.getElementById('sortDescPrice').addEventListener('change', applyFiltersAndShowData);
document.getElementById('sortByCount').addEventListener('change', applyFiltersAndShowData);

document.getElementById('clearRangeFilter').addEventListener('click', function () {
    document.getElementById('rangeFilterCountMin').value = '';
    document.getElementById('rangeFilterCountMax').value = '';
    
    showData(allProducts); // Mostrar todos los productos
});

document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const filteredProducts = allProducts.filter(product => {
        const name = product.name ? product.name.toLowerCase() : '';
        const description = product.description ? product.description.toLowerCase() : '';
        return name.includes(searchTerm) || description.includes(searchTerm);
    });
    showData(filteredProducts);
});    
    
// Función para mostrar los datos en el DOM

function showData(products) {
    document.getElementById('title').textContent = categoria;
    let desc = "Verás aquí los/as " +  categoria.toLowerCase() + " disponibles actualmente.";
    document.getElementById('descrip').textContent = desc;    
    const fila = document.getElementById("fila");
    fila.innerHTML = '';
    products.forEach(product => {
        fila.innerHTML += `
        <div class="card col-3" onclick="setProdId(${product.id}); cargar(this)">
        <div class="card-body">
            <div class="contenedor-foto">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <br>
            <h2 class="modelo">${product.name}</h2>
            <span class="precio">${product.cost} ${product.currency}</span><br>
            <br>
            <p class="descripcion">${product.description}</p>
            <p class="vendidos">Vendidos: ${product.soldCount}</p>
        </div>
        </div>
        `;
    }); 
}

let categoria = '';
let allProducts = [];

document.addEventListener("DOMContentLoaded", function(e){
    const categoriaId = localStorage.getItem("catID");
    getJSONData(`${PRODUCTS_URL}/${categoriaId}.json`).then(function(resultObj){
        if (resultObj.status === "ok"){
            categoria = resultObj.data.catName;
            allProducts = resultObj.data.products; // Guardamos los productos en la variable global
            showData(allProducts); // Mostramos los productos sin filtrar
        }
    });
});

let mostrador = document.getElementById("mostrador");
let seleccion = document.getElementById("seleccion");
let imgSeleccionada = document.getElementById("img");
let modeloSeleccionado = document.getElementById("modelo");
let descripSeleccionada = document.getElementById("descripcion");
let precioSeleccionado = document.getElementById("precio");
let vendidoSeleccionado = document.getElementById("vendidos");
let boton = document.getElementById("botón");

function cargar(item){ 
    if (window.innerWidth > 1000){  
        quitarBordes();
        mostrador.style.width = "80%"
        mostrador.style.transform ='translateX(-6vw)';
        seleccion.style.width = "30%";
        seleccion.style.opacity = "1";
        if(localStorage.getItem('theme') === 'night'){
            seleccion.style.border = "1px solid white";
            item.style.border = "1px solid white"; 
        } else {
            seleccion.style.border = "1px solid black";
            item.style.border = "1px solid black"; 
        }
        seleccion.style.zIndex = "10"; 
        /*Aparezca la imagen seleccionada en el recuadro*/
        imgSeleccionada.src = item.getElementsByTagName("img")[0].src;
        modeloSeleccionado.innerHTML =  item.getElementsByTagName("h2")[0].innerHTML;
        precioSeleccionado.innerHTML =  item.getElementsByTagName("span")[0].innerHTML;
        descripSeleccionada.innerHTML = item.getElementsByTagName("p")[0].innerHTML;
        vendidoSeleccionado.innerHTML = item.getElementsByClassName("vendidos")[0].innerHTML;

        boton.addEventListener('click', () => {
            const productId = localStorage.getItem('prodID');
            window.location = "product-info.html"
        });
    } else {
        const productId = localStorage.getItem('prodID');
        window.location = "product-info.html"
    }
}

function cerrar() {
    mostrador.style.width = "100%";
    mostrador.style.transform = "translateX(0vw)";
    seleccion.style.width = "0%";
    seleccion.style.opacity = "0";
    quitarBordes();
}

function quitarBordes() {
    var items = document.getElementsByClassName("card");
    if (localStorage.getItem('theme') === 'night') {
        for (i = 0; i < items.length; i++) {
            items[i].style.border = "1px solid #444444";
        }
    } else {
        for (i = 0; i < items.length; i++) {
            items[i].style.border = "1px solid lightgray";
        }
    }
    
}
