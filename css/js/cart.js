// Función para cargar los productos desde localStorage y mostrarlos en la tabla
function cargarCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let tabla = document.getElementById('cart-items');

    // Limpiar la tabla antes de agregar los productos
    tabla.innerHTML = '';

    if (carrito.length === 0) {
        // Si el carrito está vacío, mostrar mensaje
        tabla.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">Aún no tienes productos en el carrito</td>
            </tr>
        `;
    } else {
        carrito.forEach(producto => {
            agregarFilaProducto(producto);
        });
    }
    document.getElementById("checkout-btn").disabled = !(carrito.length > 0);
    calcularTotal();
}

// Función para agregar una fila para un producto en la tabla
function agregarFilaProducto(producto) {
    let tabla = document.getElementById('cart-items');

    let fila = document.createElement('tr');
    fila.id = `fila-${producto.id}`;
    fila.innerHTML = `
        <td><img src="${producto.imagen}" alt="${producto.nombre}" class="product-img"></td>
        <td>${producto.nombre}</td>
        <td>${producto.moneda} ${producto.precio}</td>
        <td>
            <div class="input-group me-2">
                <button id="btnMenos-${producto.id}" class="quantity-btn">-</button>
                <input type="text" value="${producto.cantidad}" id="quantity-${producto.id}" readonly>
                <button id="btnMas-${producto.id}" class="quantity-btn">+</button>
            </div>
        </td>
        <td id="total-${producto.id}">${producto.moneda} ${producto.precio * producto.cantidad}</td>
        <td><button id="delete-${producto.id}" class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </button></td>
    `;

    tabla.appendChild(fila);

    // Evento para incrementar o decrementar cantidad
    document.getElementById(`btnMenos-${producto.id}`).addEventListener('click', function() {
        if (producto.cantidad > 1) {
            producto.cantidad--;
            actualizarCantidad(producto);
        }
    });

    document.getElementById(`btnMas-${producto.id}`).addEventListener('click', function() {
        producto.cantidad++;
        actualizarCantidad(producto);
    });

    // Evento para eliminar el producto
    document.getElementById(`delete-${producto.id}`).addEventListener('click', function() {
        eliminarProducto(producto.id);
    });
   
}

// Función para actualizar cantidad y total
function actualizarCantidad(producto) {
    // Actualizar la cantidad en el input
    document.getElementById(`quantity-${producto.id}`).value = producto.cantidad;

    // Actualizar el precio total del producto
    document.getElementById(`total-${producto.id}`).innerText = `${producto.moneda} ${producto.precio * producto.cantidad}`;

    // Guardar cambios en el localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let index = carrito.findIndex(item => item.id === producto.id);
    if (index !== -1) {
        carrito[index].cantidad = producto.cantidad;
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotal();
    updateCartBadge();
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Filtrar el carrito para eliminar el producto con el ID especificado
    carrito = carrito.filter(producto => producto.id !== id);

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    calcularTotal();

    // Eliminar la fila del producto en el DOM
    let fila = document.getElementById(`fila-${id}`);
    if (fila) {
        fila.remove();
    }
    
    // Si el carrito queda vacío, mostrar el mensaje de carrito vacío
    if (carrito.length === 0) {
        cargarCarrito();
    }
    updateCartBadge();
}

// Cargar los productos al cargar la página
window.onload = function() {
    let monedaSeleccionada = localStorage.getItem('monedaSeleccionada') || 'USD';
    document.getElementById(monedaSeleccionada === 'USD' ? 'dolares' : 'pesos').checked = true;
    cargarCarrito();
    document.querySelectorAll('input[name="opcion"]').forEach((input) => {
        input.addEventListener('change', calcularTotal);
    });
    let selecEnvio = document.getElementById('envio');
    selecEnvio.addEventListener('change', calcularTotal);
};


document.getElementById("continue-btn").addEventListener("click", function(){
    window.location.href = "categories.html";
});


function calcularTotal(){
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let moneda = document.getElementById('dolares').checked ? 'USD' : 'UYU';
    localStorage.setItem('monedaSeleccionada', moneda);
    let envio = document.getElementById('envio');
    if (document.getElementById('pesos').checked) {
        let subtotal = 0;
        carrito.forEach(producto => {
            let precio = producto.precio;
            if (producto.moneda != 'UYU'){
                precio *= 41;
            }
            let subtotalProducto = precio * producto.cantidad;
            subtotal += subtotalProducto;
        });
        let costo = envio.options[envio.selectedIndex].value * subtotal;
        document.getElementById('subtotal').value = 'UYU ' + subtotal;
        document.getElementById('costoEnv').value = 'UYU ' + costo;
        document.getElementById('total').value = "UYU " + (subtotal + costo)
    }
    else{
        document.getElementById('dolares').checked = true;
        let subtotal = 0;
        carrito.forEach(producto => {
            let precio = producto.precio;
            if (producto.moneda != 'USD'){
                precio *= 0.02;
            }
            let subtotalProducto = precio * producto.cantidad;
            subtotal += subtotalProducto;
        });
        let costo = envio.options[envio.selectedIndex].value * subtotal;
        document.getElementById('subtotal').value = 'USD ' + subtotal;
        document.getElementById('costoEnv').value = 'USD ' + costo;
        document.getElementById('total').value = "USD " + (subtotal + costo)
    }
    
};

//Segunda fase del modal, forma de pago
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionamos los elementos que vamos a manejar
    const creditCardOption = document.getElementById('creditCard');
    const debitCardOption = document.getElementById('debitCard');
    const cashOption = document.getElementById('cash');
    const cardDetailsForm = document.getElementById('card-details-form');

    // Función para mostrar/ocultar el formulario de la tarjeta
    function toggleCardDetails() {
        if (creditCardOption.checked || debitCardOption.checked) {
            cardDetailsForm.style.display = 'block'; // Mostramos el formulario
        } else {
            cardDetailsForm.style.display = 'none';  // Ocultamos el formulario
        }
    }

    // Agregamos eventos a los radio buttons para controlar la visibilidad
    creditCardOption.addEventListener('change', toggleCardDetails);
    debitCardOption.addEventListener('change', toggleCardDetails);
    cashOption.addEventListener('change', toggleCardDetails);
});

// Boton de finalizar compra
document.addEventListener("DOMContentLoaded", function () {
    const btnFinalizar = document.getElementById("btn-finalizar");
    btnFinalizar.addEventListener("click", function (event) {
        event.preventDefault(); 

        let valid = true; 
        let errorMessages = []; 
        const departamento = document.getElementById("departamento");
        const localidad = document.getElementById("localidad");
        const calle = document.getElementById("calle");
        const numero = document.getElementById("numero");
        const esquina = document.getElementById("esquina");
        [departamento, localidad, calle, numero, esquina].forEach(field => {
            field.classList.remove('is-invalid');
        });

        // Datos de direccion
        if (!departamento.value.trim()) {
            departamento.classList.add("is-invalid");
            valid = false;
        }
        if (!localidad.value.trim()) {
            localidad.classList.add("is-invalid");
            valid = false;
        }
        if (!calle.value.trim()) {
            calle.classList.add("is-invalid");
            valid = false;
        }
        if (!numero.value.trim()) {
            numero.classList.add("is-invalid");
            valid = false;
        }
        if (!esquina.value.trim()) {
            esquina.classList.add("is-invalid");
            valid = false;
        }

        // Validacion de forma de pago
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
        if (!paymentMethod) {
            errorMessages.push("Por favor, seleccione un método de pago.");
            valid = false;
        }

        // Validacion: credito y debito
        if (paymentMethod && (paymentMethod.value === "creditCard" || paymentMethod.value === "debitCard")) {
            const cardNumber = document.getElementById("cardNumber");
            const cardName = document.getElementById("cardName");
            const expirationDate = document.getElementById("expirationDate");
            const cvv = document.getElementById("cvv");
            [cardNumber, cardName, expirationDate, cvv].forEach(field => {
                field.classList.remove('is-invalid');
            });

            // Validar campos de tarjeta
            if (!cardNumber.value.match(/^\d{16}$/)) {
                cardNumber.classList.add("is-invalid");
                valid = false;
            }
            if (!cardName.value.trim()) {
                cardName.classList.add("is-invalid");
                valid = false;
            }
            
            if (!expirationDate.value.match(/^\d{2}\/\d{2}$/)) {
                expirationDate.classList.add("is-invalid");
                valid = false;
            } else {
                // Fecha valida
                const [month, year] = expirationDate.value.split("/").map(num => parseInt(num, 10));
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; 
                const currentYear = currentDate.getFullYear() % 100; 
                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    expirationDate.classList.add("is-invalid");
                    valid = false;
                    errorMessages.push("La tarjeta ha expirado.");
                }
                if (month < 1 || month > 12) {
                    expirationDate.classList.add("is-invalid");
                    valid = false;
                    errorMessages.push("El mes de expiración no es válido.");
                }
            }
            if (!cvv.value.match(/^\d{3}$/)) {
                cvv.classList.add("is-invalid");
                valid = false;
            }
        }

        // Mensajes de exito o de error
        if (valid) {
            localStorage.removeItem("carrito");
            cargarCarrito();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Compra realizada con éxito!",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // Cierre del modal 
                const modalElement = document.getElementById("staticBackdrop"); 
                const modal = bootstrap.Modal.getInstance(modalElement); 
                modal.hide(); 
            });
        } else {
            // Alertas iguales pare errores 
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Por favor, complete todos los campos correctamente.",
                text: errorMessages.length > 0 ? errorMessages.join("\n") : '', 
                showConfirmButton: true
            });
        }
    });
});