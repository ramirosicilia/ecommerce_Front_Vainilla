 const selector=document.getElementById("categorySelector")
  let combinadas=[]
  let productosFiltrados =[]

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

        productosFiltrados = productos.filter(
        producto => producto.activacion === true && producto.categorias.activo === true
      );
     

     if(productosFiltrados.length>0){ 

        productosFiltrados.forEach(producto => {  

          listaProductos.innerHTML += ` 
          <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
            <div class="card">
              <img src="${producto.imagenes}" class="card-img-top" alt="${producto.categorias.nombre_categoria}">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre_producto}</h5>
                <p class="card-text">$${producto.precio}</p>
                <p class="card-text">Stock: ${producto.stock}</p>
                <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">Agregar al carrito</button>
              </div>
            </div>
          </section>
        `; 
        
            stockAgotado(producto.stock,producto.producto_id)

         });  

         let botonesAgregarCarrito=[...document.querySelectorAll(".btn-agregar")]
      
         agregarBotonesAlCarrito(botonesAgregarCarrito) 
         /*obtenerAgotados()*/

         
    
     } 

     else {
        listaProductos.innerHTML = `<p>No hay productos disponibles para mostrar.</p>`;
      }


 }   


    mostrarProductosVenta()  



    function stockAgotado(stock, idAgotado) { 
      let producto = document.querySelector(`[data-productos="${idAgotado}"]`);
      
      
      if (stock === 0 && producto) { 
          producto.classList.add("agotado");
  
          // Quita el botón "Agregar al carrito"
          let botonAgregar = producto.querySelector(".btn-agregar");
          if (botonAgregar) {
              botonAgregar.remove();
          }
  
          // Guardar en localStorage
          let productosAgotados = JSON.parse(localStorage.getItem("productosAgotados")) || [];
          if (!productosAgotados.includes(idAgotado)) {
              productosAgotados.push(idAgotado);
              localStorage.setItem("productosAgotados", JSON.stringify(productosAgotados));
          }
      } 

      
  } 

  
// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded",stockAgotado);

  

async function selectorCategorys() { 
  let productos = await obtenerProductosVenta(); 

  if (!productos || productos.length === 0) {
      console.warn("No se encontraron productos.");
      return;
  }

  let categorias = productos
      .filter(producto => producto.categorias) // Solo productos con categorías definidas
      .map(producto => ({
          nombre: producto.categorias.nombre_categoria,
          activo: producto.categorias.activo
      }));

  let categoriasUnicas = [
      ...new Map(categorias.map(categoria => [categoria.nombre, categoria])).values()
  ];

  let categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];
  let filtradaStorage = categoriasLocales.filter(categoria => categoria.activo === true);

  let categoriasActivas = categoriasUnicas.filter(categoria => categoria.activo === true);

  // Combinar categorías de LocalStorage y de productos, eliminando duplicados
  combinadas = [...filtradaStorage, ...categoriasActivas];
  combinadas = [...new Map(combinadas.map(categoria => [categoria.nombre, categoria])).values()];

  // Asegurar que el selector tenga una opción "Todas"
  selector.innerHTML = `<option value="todas">Todas</option>`;

  if (combinadas.length > 0) {
      combinadas.forEach(categoria => {
          selector.innerHTML += `
              <option value="${categoria.nombre}">${categoria.nombre}</option>
          `;
      });
  } else {
      console.warn("No hay categorías activas disponibles.");
  }
}

selectorCategorys();



selector.addEventListener("change", async (e) => {
  const listaProductos = document.getElementById("product-list");
  const categoriaSelector = e.target.value;

  listaProductos.innerHTML = ""; // Limpiar la lista antes de volver a renderizar

  let productos = await obtenerProductosVenta();
  
  productosFiltrados = productos.filter(
      producto => producto.activacion === true && producto.categorias.activo === true
  );

  let productosMostrados = categoriaSelector !== "todas"
      ? productosFiltrados.filter(producto => producto.categorias.nombre_categoria === categoriaSelector)
      : productosFiltrados;

  if (productosMostrados.length > 0) {
      productosMostrados.forEach(producto => {
          listaProductos.innerHTML += `
              <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
                  <div class="card">
                      <img src="${producto.imagenes}" class="card-img-top" alt="${producto.categorias.nombre_categoria}">
                      <div class="card-body">
                          <h5 class="card-title">${producto.nombre_producto}</h5>
                          <p class="card-text">$${producto.precio}</p>
                          <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">Agregar al carrito</button>
                      </div>
                  </div>
              </section>
          `;
      });

      let botonesAgregarCarrito = [...document.querySelectorAll(".btn-agregar")];
      agregarBotonesAlCarrito(botonesAgregarCarrito); 

    
        aplicarEstilosAgotados();
  } else {
      listaProductos.innerHTML = `<p>No hay productos en esta categoría.</p>`;
  }
});



 function agregarBotonesAlCarrito(botones){ 
 

  botones.forEach((btn)=>{
    btn.addEventListener('click',async()=>{ 

      const productos= await obtenerProductosVenta() 

      let botonId=btn.getAttribute('data-productos')
      agregarProducto(botonId)


    })
  })

 } 

 let carritoStorage=localStorage.getItem('productos') 
 
 let carritoCompras=carritoStorage?JSON.parse(carritoStorage):[]


 async function agregarProducto(btnID) { 
  const productos = await obtenerProductosVenta(); 
  let primerProducto = productos.find(id => id.producto_id === btnID);
  
  if (primerProducto.stock === 0) {  
    
    aplicarEstilosAgotados()
    return; // Sale de la función si el producto no tiene stock
  }

  let primerProductoStorage = carritoCompras.find(id => id.producto_id === btnID);

  if (primerProductoStorage) {
    primerProductoStorage.cantidad++;
  } else {
    primerProductoStorage = { ...primerProducto, cantidad: 1 }; // Copia el producto y asigna cantidad
    carritoCompras.push(primerProductoStorage);
  }

  // Filtra los productos con stock mayor a 0
  let carritoComprasStock = carritoCompras.filter(producto => producto.stock > 0);

  console.log(carritoCompras);
  console.log('El carrito de compras', carritoComprasStock);
  sumarCarrito(carritoComprasStock);

  if (carritoComprasStock.length > 0) {
    Toastify({
      text: "Producto agregado",
      duration: 3000,
      close: true,
      gravity: "top", // `top` o `bottom`
      position: "right", // `left`, `center` o `right`
      stopOnFocus: true, // Impide que el toast se cierre al poner el ratón sobre él
      style: {
        background: "linear-gradient(to right, #4b33a8, #785ce9)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem"
      },
      offset: {
        x: '1.5rem', // Eje horizontal
        y: '1.5rem'  // Eje vertical
      },
      onClick: function() {} // Callback después de hacer clic
    }).showToast();

    localStorage.setItem('productos', JSON.stringify(carritoComprasStock));
  }
}

function sumarCarrito(carrito) {
  let iconCart = document.getElementById("cart-count");
  iconCart.innerHTML = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
}
