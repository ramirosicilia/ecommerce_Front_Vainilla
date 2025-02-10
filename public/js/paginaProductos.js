import { obtenerCategorys } from "./api/productos.js";
import { obtenerProductos } from "./api/productos.js";

let categoriasFiltrada = [];

const selector = document.getElementById("categorySelector");
const listaProductos = document.getElementById("productos_lista");

async function selectorCategorys() {
  let categoria = await obtenerCategorys();
  categoriasFiltrada = categoria.filter(category => category.activo === true);

  // Asegurar que el selector tenga una opción "Todas"
  selector.innerHTML = `<option value="todas">Todas</option>`;
  console.log(categoriasFiltrada);

  if (categoriasFiltrada.length > 0) {
    categoriasFiltrada.forEach(categoria => {
      selector.innerHTML += `
        <option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>
      `;
    });
  } else {
    console.warn("No hay categorías activas disponibles.");
  }
}

selectorCategorys();

selector.addEventListener("change", async (e) => {
  const categoriaSeleccionada = e.target.value;
  listaProductos.innerHTML = ""; // Limpiar la lista antes de renderizar

  let productos = await obtenerProductos();

  // Filtrar solo productos activos
  let productosFiltrados = productos.filter(producto => producto.activacion === true);

  // Aplicar filtro de categoría si no es "todas"
  let productosMostrados = categoriaSeleccionada !== "todas"
    ? productosFiltrados.filter(producto =>
        categoriasFiltrada.some(categoria =>
          categoria.nombre_categoria === categoriaSeleccionada &&
          categoria.categoria_id === producto.categoria_id
        )
      )
    : productosFiltrados;

  if (productosMostrados.length > 0) {
    // Usar map y join para mejorar rendimiento en manipulación del DOM
    listaProductos.innerHTML = productosMostrados.map(producto => `
      <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
        <div class="card">
          <img src="${producto.imagenes}" class="card-img-top" alt="">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre_producto}</h5>
            <p class="card-text">$${producto.precio}</p>
            <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">
              Agregar al carrito
            </button>
          </div>
        </div>
      </section>
    `).join("");

    // Llamar funciones adicionales
    productosMostrados.forEach(producto => stockAgotado(producto.stock, producto.producto_id));
    agregarBotonesAlCarrito([...document.querySelectorAll(".btn-agregar")]);
  } else {
    listaProductos.innerHTML = `<p>No hay productos en esta categoría.</p>`;
  }
});


 

 
  let productosFiltrados =[]

  
  async function mostrarProductosVenta() { 
    const productos = await obtenerProductos();  
    console.log(productos, "user");

    const listaProductos = document.getElementById("productos_lista");
    console.log(listaProductos);

    // Limpiar lista antes de agregar productos nuevos
    listaProductos.innerHTML = "";

    // Filtrar productos activados
    let productosFiltrados = productos.filter(producto => producto.activacion === true);

    // Filtrar por categoría antes del forEach
    let filtradoCategoryYProduct = productosFiltrados.filter(producto => 
        categoriasFiltrada.some(category => category.categoria_id === producto.categoria_id)
    );

    console.log(filtradoCategoryYProduct);

    if (filtradoCategoryYProduct.length > 0) {
        filtradoCategoryYProduct.forEach(producto => {
            listaProductos.insertAdjacentHTML("beforeend", `
                <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
                    <div class="card">
                        <img src="${producto.imagenes}" class="card-img-top" alt="">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre_producto}</h5>
                            <p class="card-text">$${producto.precio}</p>
                            <p class="card-text">Stock: ${producto.stock}</p>
                            <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">Agregar al carrito</button>
                        </div>
                    </div>
                </section>
            `);

            stockAgotado(producto.stock, producto.producto_id);
        });

        // Agregar funcionalidad a los botones después de haber insertado los productos en el DOM
        let botonesAgregarCarrito = [...document.querySelectorAll(".btn-agregar")];
        agregarBotonesAlCarrito(botonesAgregarCarrito);
        
    } else {
        listaProductos.innerHTML = `<p>No hay productos disponibles para mostrar.</p>`;
    }
}    

mostrarProductosVenta();





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
document.addEventListener("DOMContentLoaded", () => {
  restaurarCarrito();
  stockAgotado();
});






 function agregarBotonesAlCarrito(botones){ 
 

  botones.forEach((btn)=>{
    btn.addEventListener('click',async()=>{ 

      const productos= await pedirProductos() 

      let botonId=btn.getAttribute('data-productos')
      agregarProducto(botonId)


    })
  })

 } 

 let carritoStorage=localStorage.getItem('productos') 
 
 let carritoCompras=carritoStorage?JSON.parse(carritoStorage):[]


 async function agregarProducto(btnID) { 
  const productos = await pedirProductos(); 
  let primerProducto = productos.find(id => id.producto_id === btnID);
  
  if (primerProducto.stock === 0) {  
    
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
 
function restaurarCarrito() {
  let carritoStorage = localStorage.getItem('productos');
  let carritoCompras = carritoStorage ? JSON.parse(carritoStorage) : [];

  let iconCart = document.getElementById("cart-count");
  iconCart.innerHTML = carritoCompras.reduce((acc, producto) => acc + producto.cantidad, 0);
}

// Ejecutar la función al cargar la página
document.addEventListener("DOMContentLoaded", restaurarCarrito);
