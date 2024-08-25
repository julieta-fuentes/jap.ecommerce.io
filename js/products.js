const API_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

// Función para mostrar los datos en el DOM
function showData(data) {
    const fila = document.getElementById("fila");
    fila.innerHTML = '';

data.products.forEach(product => {
    fila.innerHTML += `
    <div class="card col-3" onclick="cargar(this)">
    <div class="card-body">
        <div class="contenedor-foto">
            <img src="${product.image}" alt="${product.name}">
        </div>
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

function getAPIData(url) {
    return fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        showData(data);
    })
    .catch(error => {
        console.error('Hubo un problema con el fetch:', error);
    });
}

getAPIData(API_URL);


let mostrador = document.getElementById("mostrador");
let seleccion = document.getElementById("seleccion");
let imgSeleccionada = document.getElementById("img");
let modeloSeleccionado = document.getElementById("modelo");
let descripSeleccionada = document.getElementById("descripcion");
let precioSeleccionado = document.getElementById("precio");
let vendidoSeleccionado = document.getElementById("vendidos");


function cargar(item){
    quitarBordes();
    mostrador.style.width = "80%"
    mostrador.style.transform ='translateX(-3vw)';
    seleccion.style.width = "30%";
    seleccion.style.opacity = "1";
    seleccion.style.border = "1px solid black";
    item.style.border = "1px solid black";
/*Aparezca la imagen seleccionada en el recuadro*/
    imgSeleccionada.src = item.getElementsByTagName("img")[0].src;

    modeloSeleccionado.innerHTML =  item.getElementsByTagName("h2")[0].innerHTML;

    precioSeleccionado.innerHTML =  item.getElementsByTagName("span")[0].innerHTML;

    descripSeleccionada.innerHTML = item.getElementsByTagName("p")[0].innerHTML;

    vendidoSeleccionado.innerHTML = item.getElementsByClassName("vendidos")[0].innerHTML;
}

function cerrar(){
    mostrador.style.width = "100%"
    mostrador.style.transform ='translateX(0vw)';
    seleccion.style.width = "0%";
    seleccion.style.opacity = "0";

    quitarBordes();
}

function quitarBordes(){
    var items = document.getElementsByClassName("card");
    for(i=0;i <items.length; i++){
        items[i].style.border = "1px solid lightgray";
    }
}
