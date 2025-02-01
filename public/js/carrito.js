let productosEncarrito = JSON.parse(localStorage.getItem('productos')) || []; 
let summary=document.getElementById("sumary") 



  function mostrarProductosCarrito() { 
    let carritoItem = document.getElementById("carrito-items"); 
    carritoItem.innerHTML = "";
    summary.innerHTML=""

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
                checkout()
        }); 

        
        let botonesAgregar = [...document.querySelectorAll(".boton_agregar")]; 
        let botonesEliminar = [...document.querySelectorAll(".boton_eliminar")];

        console.log(botonesAgregar, botonesEliminar); 

        activarBotonAgregar(botonesAgregar);

        activarBotonEliminar(botonesEliminar)   
    } 

    else{ 
      summary.innerHTML=` 
      <h3>Resumen de compra</h3>
             <p>Productos (0) <span>$ 00.00</span></p>
             <p class="shipping">Calcular costo de envío</p>
             <hr>
             <p>Total <span class="total-price">$0.0</span></p>
             <button class="checkout">Continuar compra</button>
             <p class="shipping-info">El envío gratis está sujeto al peso, precio y distancia.</p>
             <a class="boton_vaciar" id="boton-vaciar">Vaciar Carrito</a>
      `

    }
} 

mostrarProductosCarrito();

function activarBotonAgregar(botones) { 
    botones.forEach(boton => {
        boton.addEventListener('click', agregarProductoAlCarrito);
    });
}  

function checkout() { 

  
  let cantidadTotal = productosEncarrito.length; // Contar productos únicos
  let total = productosEncarrito.reduce((acc, prod) => acc + (prod.cantidad * prod.precio), 0);
  let tieneRepetidos = productosEncarrito.some(prod => prod.cantidad > 1);

  summary.innerHTML = ` 
      <h3>Resumen de compra</h3>
      <p>Productos totales (${cantidadTotal}) ${tieneRepetidos ? "" : ""} <span>$ ${total.toFixed(2)}</span></p>
      <p class="shipping">Calcular costo de envío</p>
      <hr>
      <p>Total <span class="total-price">$${total.toFixed(2)}</span></p>
      <button class="checkout">Continuar compra</button>
      <p class="shipping-info">El envío gratis está sujeto al peso, precio y distancia.</p>
      <a class="boton_vaciar" id="boton-vaciar">Vaciar Carrito</a>
  `;
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
        checkout()
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


  function activarBotonEliminar(boton){ 

    boton.forEach(boton=>{
      boton.addEventListener("click",()=>{
        let botonEliminado=boton.dataset.id 

        eliminarDelCarrito(botonEliminado)
      })
    })

  } 

  function eliminarDelCarrito(botonID) { 
    let primerProducto = productosEncarrito.find(producto => producto.producto_id === botonID);

    if (primerProducto.cantidad > 0) { 
        primerProducto.cantidad--; 
        checkout()
        localStorage.setItem("productos", JSON.stringify(productosEncarrito)); 

        let cantidadActualizada = document.querySelector(`.cantidad[data-id="${botonID}"]`);
        let cantidadTextoActualizada = document.querySelector(`.cantidad-texto[data-id="${botonID}"]`);

        if (cantidadActualizada) cantidadActualizada.innerHTML = primerProducto.cantidad;
        if (cantidadTextoActualizada) cantidadTextoActualizada.innerHTML = `Cantidad: ${primerProducto.cantidad}`; 

        console.log(primerProducto);

        if (primerProducto.cantidad === 0) {
            productosEncarrito = productosEncarrito.filter(producto => producto.producto_id != botonID);
            localStorage.setItem("productos", JSON.stringify(productosEncarrito)); 
            mostrarProductosCarrito()
          
        }

        iconoProductosSumados();
    }
}


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

