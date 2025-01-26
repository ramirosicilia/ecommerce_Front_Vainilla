

async function obtenerProductosVenta() { 

    try{ 
        const response = await fetch("http://localhost:1200/obtener-productos-venta") 
        if(!response.ok){
            throw new Error("Error en la petición")
        } 

        const data = await response.json() 

       return data

        

    } 

    catch(error){
        console.log(error)
    }
    
} 

 async function mostrarProductosVenta(){ 

    const productos= await obtenerProductosVenta() 
     const listaProductos=document.getElementById("product-list") 
     console.log(listaProductos)

     listaProductos.innerHTML="" 

     let productosFiltrados = productos.filter(
        producto => producto.activacion === true && producto.categorias.activo === true
      );
     

     if(productosFiltrados.length>0){ 

        productosFiltrados.forEach(producto => {  

            listaProductos.innerHTML+=` 
            <div class="col-md-3 product-card" data-category="tapados">
                  <div class="card">
                    <img src="${producto.imagenes}" class="card-img-top" alt="${producto.categorias.nombre_categoria}">
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre_producto}</h5>
                      <p class="card-text">${producto.precio}</p>
                      <button class="btn btn-primary add-to-cart">Agregar al carrito</button>
                    </div>
                  </div>
                </div>
    
    
              
            ` 
         });
    
     } 

     else {
        listaProductos.innerHTML = `<p>No hay productos disponibles para mostrar.</p>`;
      }


 }

    mostrarProductosVenta()