

let productosEncarrito=localStorage.getItem('productos')?JSON.parse(localStorage.getItem('productos')):[] 


function mostrarProductosCarrito(){ 

    let carritoItem=document.getElementById("carrito-items") 

    if(productosEncarrito.length>0){ 

        productosEncarrito.forEach(producto => { 

            carritoItem.innerHTML+=` 

            <div class="item">
                    <img src="${producto.imagenes}" alt="Campera Marron">
                    <div class="info">
                        <p class="name">${producto.nombre_producto}</p>
                        <div class="actions">
                            <span class="delete">Eliminar</span>
                            <span class="buy-now">Comprar ahora</span>
                        </div>
                        <div class="quantity">
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                        </div>
                        <p class="stock">Stock:${producto.stock}</p>
                        <p class="price">precio: $${producto.precio}</p>
                    </div>
                </div> 


            `
            
        });

    }

} 


mostrarProductosCarrito()