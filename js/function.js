// Agregar productos al catalogo
function renderizarProds (productos) {

    for (const prod of productos){
        if (prod.marca === 'ADIDAS'){
        containerAdidas.innerHTML += `
        <div class="card m-3" >
            <img class="card-img-top" src="${prod.foto}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title"> ${prod.marca} ${prod.modelo}</h5>
                <p class="card-text"> $ ${prod.precio.toLocaleString('es-ES')}</p>
                <button class="btn btn-primary addCarrito" id="${prod.id}">Añadir al carrito</button>
        </div>
        `;
    } else if (prod.marca === 'NIKE'){
        containerNike.innerHTML += `
        <div class="card m-3" >
            <img class="card-img-top" src="${prod.foto}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title"> ${prod.marca} ${prod.modelo}</h5>
                <p class="card-text"> $ ${prod.precio.toLocaleString('es-ES')}</p>
                <button class="btn btn-primary addCarrito" id="${prod.id}">Añadir al carrito</button>
            </div>
        </div>
        `;
    } else if (prod.marca === 'PUMA'){
        containerPuma.innerHTML += `
        <div class="card m-3" >
            <img class="card-img-top" src="${prod.foto}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title"> ${prod.marca} ${prod.modelo}</h5>
                <p class="card-text"> $ ${prod.precio.toLocaleString('es-ES')}</p>
                <button class="btn btn-primary addCarrito" id="${prod.id}">Añadir al carrito</button>
            </div>
        </div>
        `;
    }
    }
    // evento para addCarrito
    let botones = document.getElementsByClassName('addCarrito');  

    for (const boton of botones){
        boton.addEventListener('click', () =>{
            const prodAgregado = productos.find ((producto) => producto.id == boton.id);
            agregarACarrito (prodAgregado);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
                Toast.fire({
                icon: 'success',
                title: `Agregaste ${prodAgregado.marca} ${prodAgregado.modelo}`
            })
        })
    }
}


//Guardar en el carrito
function guardarCarritoLS(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

//Cargar el carrito
function cargarCarritoLS() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

//Agregar productos al carrito
function agregarACarrito (producto){
    //cargo lo que tengo en el carrito    
    carrito = cargarCarritoLS();
    //agrego el producto nuevo al carrito
    carrito.push (producto); 
    // Guardar el carrito en localStorage
    guardarCarritoLS (carrito);
    //Actualizo el contador
    contador = carrito.length;
    mostrarContador(contador);
}

// Renderizar carrito
function renderizarCarrito(carrito) {
    totalCompra = 0; 
    cantidad = 1;
    tablaBody.innerHTML = "";

    for (const prod of carrito) {
        const subTotal = prod.precio * cantidad; 
        totalCompra += subTotal;

        tablaBody.innerHTML += `
        <tr>
            <td>
                <button type="button" class="btnDelete" id="${prod.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </button>
            <td>
                <img class="imgEnCarrito" src=".${prod.foto}" alt="Card image cap" style="width: 100px; margin:10px;">
                ${prod.marca}
                ${prod.modelo}
            </td>
            <td>$${prod.precio.toLocaleString('es-ES')}</td>
            <td>
                <div class="inputCantidad"><input step="1" value="${cantidad}" min="1" type="number" id="cantidadAgregada" class="form-control cantidadProds"/></div>
            </td>
            <td class="subtotal">$${subTotal.toLocaleString('es-ES')}</td>
        </tr>
    `;
    }

    //Agrego el total
    totalCarrito.innerText = '$' + totalCompra.toLocaleString('es-ES');

    //agrego el evento al boton de eliminar
    let btnDelete = document.querySelectorAll('.btnDelete');
    for (const boton of btnDelete) {
        boton.addEventListener ('click', () => {
            const prodAEliminar = carrito.find ((prod) => prod.id == boton.id);
            eliminarProducto (prodAEliminar);
            Toastify({

                text: "Producto eliminado",
                duration: 1000,
                style: {
                    background: "red",
                },                
                }).showToast();
        })
    }

    return totalCompra;
}

// Eliminar producto del carrito
function eliminarProducto (prodAEliminar) {
    //Busco el indice del producto en el array
    const index = carrito.findIndex((prod) => prod.id == prodAEliminar.id);
    //Lo comparo con -1 porque el indice de un array arranca desde 0
    if (index > -1) {
        carrito.splice (index, 1);
    }
    //vuelvo a renderizar el carrito
    renderizarCarrito(carrito);
    //Elimino el producto del localStorage y lo vuelvo a guardar
    localStorage.removeItem('carrito');
    guardarCarritoLS(carrito);
}

//Finalizar compra
function finalizarCompra (carrito){
    let btnFinalizar = document.getElementById('finalizarCompra');
    let finalizar = new bootstrap.Modal(document.getElementById('modalValidacion'));

    btnFinalizar.onclick = () => {
        if (carrito.length === 0) {
            finalizar.hide();
            Swal.fire('El carrito está vacío');
        } else {
            finalizar.show();
            titleModal.innerText = 'El total de tu compra es $' + totalCompra.toLocaleString('es-ES');;
        }
    }
}

// Borrar LS
function borrarLS (){
    let compraFinalizada = document.getElementById('compraFinalizada');
    compraFinalizada.addEventListener('click', () =>{
    localStorage.clear();
    location.reload();
    })
}

// Variable contador actualizada 
function contadorCarro (carrito) {
    carrito = cargarCarritoLS();
    let contador = carrito.length;
    return contador;
}

function mostrarContador (contador){
    if (contador > '0'){
        contadorCarrito.style.display = 'block'
        contadorCarrito.innerText = contador;
}
}