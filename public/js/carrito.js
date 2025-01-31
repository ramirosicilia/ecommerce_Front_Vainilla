let productosEncarrito = JSON.parse(localStorage.getItem('productos')) || [];


let botonVaciar=document.getElementById("boton-vaciar") 


botonVaciar.addEventListener('click', () => { 
    
        
    if (productosEncarrito.length === 0) return;
     
    const confirmar = confirm('¿Estás seguro de que deseas vaciar el carrito?');


    if (confirmar) {
        localStorage.removeItem('productos'); // Borra solo 'productos' del localStorage
        productosEncarrito = []; // Vacía el array correctamente 
       
        Swal.fire({
            title: `Fue Vaciado con exicto el carrito`,
            showClass: {
              popup: `
                animate__animated
                animate__fadeInUp
                animate__faster
              `
            },
            hideClass: {
              popup: `
                animate__animated
                animate__fadeOutDown
                animate__faster
              `
            }
          }); 

    } 

    setTimeout(() => { 
        window.location.reload()
        
    }, 1500);
});







  function mostrarProductosCarrito() { 
    let carritoItem = document.getElementById("carrito-items"); 
    carritoItem.innerHTML = "";

    if (productosEncarrito.length > 0) { 
        productosEncarrito.forEach(producto => { 
            carritoItem.innerHTML += ` 
                <div class="item">
                    <img src="${producto.imagenes}" alt="">
                    <div class="info">
                        <p class="name">${producto.nombre_producto}</p>
                        <div class="actions">
                            <span class="delete">Eliminar</span>
                            <span class="buy-now">Agregar</span>
                        </div>
                        <div class="quantity">
                            <button class="boton_eliminar" data-id="${producto.producto_id}">-</button>
                            <span class="cantidad" data-id="${producto.producto_id}">${producto.cantidad}</span>
                            <button class="boton_agregar" data-id="${producto.producto_id}">+</button>
                        </div>
                        <p class="stock cantidad-texto" data-id="${producto.producto_id}">Cantidad: ${producto.cantidad}</p>
                        <p class="stock">Stock: ${producto.stock}</p>
                        <p class="price">Precio: $${producto.precio}</p>
                    </div>
                </div>`; 
        });

        let botonesAgregar = [...document.querySelectorAll(".boton_agregar")]; 
        let botonesEliminar = [...document.querySelectorAll(".boton_eliminar")];

        console.log(botonesAgregar, botonesEliminar); 

        activarBotonAgregar(botonesAgregar);
    } 
} 

mostrarProductosCarrito();

function activarBotonAgregar(botones) { 
    botones.forEach(boton => {
        boton.addEventListener('click', agregarProductoAlCarrito);
    });
} 

function iconoProductosSumados() {
  let iconCart = document.getElementById("cart-count"); 
  iconCart.innerHTML = productosEncarrito.reduce((acc, produc) => acc + produc.cantidad, 0);
}

function agregarProductoAlCarrito(e) { 
    const idBoton = e.target.dataset.id; 
    let primerProducto = productosEncarrito.find(producto => producto.producto_id === idBoton); 

    if (primerProducto) {
        primerProducto.cantidad++; // Aumentamos la cantidad
        localStorage.setItem("productos", JSON.stringify(productosEncarrito)); // Guardamos el cambio

        // Seleccionamos los elementos correctos dentro del producto modificado
        let cantidadActualizada = document.querySelector(`.cantidad[data-id="${idBoton}"]`);
        let cantidadTextoActualizada = document.querySelector(`.cantidad-texto[data-id="${idBoton}"]`);

        if (cantidadActualizada) cantidadActualizada.innerHTML = primerProducto.cantidad;
        if (cantidadTextoActualizada) cantidadTextoActualizada.innerHTML = `Cantidad: ${primerProducto.cantidad}`; 

        iconoProductosSumados()
    }
}
  iconoProductosSumados()