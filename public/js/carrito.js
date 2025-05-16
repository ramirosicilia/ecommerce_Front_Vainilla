import { enviarCompra } from "./comprar.js"; 




let productosEncarrito = JSON.parse(localStorage.getItem('productos')) || []; 
let summary=document.getElementById("summary") 

   


    
  async function mostrarProductosCarrito() {  

   // Obtener el último número para re-renderizar
    let stockGuardados = JSON.parse(localStorage.getItem('stocks')) || [];
    
    console.log(stockGuardados,"el stock"); // Usar este para renderizar la tarjeta
    
    let cantidad=0


    let carritoItem = document?.getElementById("carrito-items"); 

  
  
  if(carritoItem) { 

    carritoItem.innerHTML = "";
    summary.innerHTML="" 


    if (productosEncarrito.length > 0) { 
      productosEncarrito.forEach((producto,index )=> {  
        

      
          carritoItem.innerHTML += ` 
              <div class="item">
                  <img src="${producto.imagen}" alt="">
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
                      <div class="detalles">
                       <p class="talle">Talle:${producto.talle} </p>
                       <p class="color">Color:${producto.color}  </p>
                       <p class="stock cantidad-texto" data-id="${producto.producto_id}">Cantidad: ${producto.cantidad}</p>
                      </div>
                      <span class="stock">maximo permitido: ${stockGuardados[index]} unidades </span>
                      <span class="price">Precio: $${producto.precio_producto}</span>
                     
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
           <p>Productos (${cantidad})<span>$${cantidad.toFixed(2)}</span></p>
           <p class="shipping">Calcular costo de envío</p>
           <hr>
           <p>Total <span class="total-price"></span></p>
           <button class="checkout" id="comprar">Continuar compra</button>
           <p class="shipping-info">El envío gratis está sujeto al peso, precio y distancia.</p>
          <button type="button" class="boton_vaciar btn" id="boton-vaciado">Vaciar Carrito</button> 

              
    `

  }

  }

   
} 

(async()=>{ 
     await mostrarProductosCarrito();
   

})() 




function activarBotonAgregar(botones) { 
    botones.forEach(boton => {
        boton.addEventListener('click', agregarProductoAlCarrito);
    });
}  

function checkout() { 

  
  let cantidadTotal = productosEncarrito.length; // Contar productos únicos
  let total = productosEncarrito.reduce((acc, prod) => acc + (prod.cantidad * prod.precio_producto), 0);
  let tieneRepetidos = productosEncarrito.some(prod => prod.cantidad > 1);
     console.log(summary) 
      const button=document.createElement("button")
      button.id="boton-vaciado"
  summary.innerHTML = ` 
      <h3>Resumen de compra</h3>
      <p>Productos totales (${cantidadTotal}) ${tieneRepetidos ? "" : ""} <span>$ ${total.toFixed(2)}</span></p>
      <p class="shipping">Calcular costo de envío</p>
      <hr>
      <p>Total <span class="total-price">$${total.toFixed(2)}</span></p>
      <button class="checkout" id="comprar">Continuar compra</button>
      <p class="shipping-info">El envío gratis está sujeto al peso, precio y distancia.</p>
      <button type="button" class="boton_vaciar btn" 
      id="boton-vaciado">Vaciar Carrito</button>
  `; 
  
  let botonVaciar=document.querySelector("#boton-vaciado")

  vaciarCarrito(botonVaciar)

}


 function vaciarCarrito(botonVaciar){
  
console.log(botonVaciar)


botonVaciar.addEventListener('click',() => { 
    
        
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
})

 }



function iconoProductosSumados() {
  let iconCart = document.getElementById("cart-count"); 
  iconCart.innerHTML = productosEncarrito.reduce((acc, produc) => acc + produc.cantidad, 0);
}

function agregarProductoAlCarrito(e) { 
    const idBoton = e.target.dataset.id; 
    console.log(idBoton)
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
    let primerProducto = productosEncarrito?.find(producto => producto.producto_id === botonID);
    console.log(primerProducto)


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




 const botonComprar=document.getElementById("comprar") 

 
 botonComprar.addEventListener("click",async(e)=>{ 
  e.target.style.opacity="0" 

  setTimeout(() => { 
      enviarCompra(e.target)
    
  }, 500);
  


 })




