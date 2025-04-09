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
  listaProductos.innerHTML = ""; // Limpiar lista

  let productos = await obtenerProductos();
  let productosActivos = productos.filter(p => p.activacion === true);

  let productosMostrados = categoriaSeleccionada !== "todas"
    ? productosActivos.filter(producto =>
        categoriasFiltrada.some(cat =>
          cat.nombre_categoria === categoriaSeleccionada &&
          cat.categoria_id === producto.categoria_id
        )
      )
    : productosActivos;

  if (productosMostrados.length > 0) {
    listaProductos.innerHTML = productosMostrados.map(producto => {
      const imagen = producto.imagenes?.[0]?.urls?.[0] || "img/default.png";
      const stock = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;

      return `
        <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
          <div class="card">
            <img src="${imagen}" class="card-img-top" alt="">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre_producto || ""}</h5>
              <p class="card-text">$${producto.precio || 0}</p>
              <p class="card-text">Stock: ${stock}</p>
              <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">
                Agregar al carrito
              </button>
            </div>
          </div>
        </section>
      `;
    }).join("");

    productosMostrados.forEach(producto => {
      const stock = producto.productos_variantes?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
      stockAgotado(stock, producto.producto_id);
    });

    agregarBotonesAlCarrito([...document.querySelectorAll(".btn-agregar")]);
  } else {
    listaProductos.innerHTML = `<p>No hay productos en esta categoría.</p>`;
  }
});

 

 
  let productosFiltrados =[]

  
  async function mostrarProductosVenta() {
    const productos = await obtenerProductos();
    const listaProductos = document.getElementById("productos_lista");
    listaProductos.innerHTML = "";
  
    const productosFiltrados = productos.filter(p => p.activacion === true);
  
    const filtradoCategoryYProduct = productosFiltrados.filter(producto => 
      categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
    );
  
    if (filtradoCategoryYProduct.length > 0) {
      filtradoCategoryYProduct.forEach(producto => {
        const imagen = producto.imagenes?.[0]?.urls?.[0] || "img/default.png";
        const stock = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;
  
        listaProductos.insertAdjacentHTML("beforeend", `
          <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
            <div class="card">
              <img src="${imagen}" class="card-img-top imagenes" alt="">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre_producto}</h5>
                <p class="card-text">$${producto.precio}</p>
                <p class="card-text">Stock: ${stock}</p>
                <button class="btn btn-agregar btn-primary add-to-cart" data-productos="${producto.producto_id}">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </section>
        `);
  
        stockAgotado(stock, producto.producto_id);
      });
  
      agregarBotonesAlCarrito([...document.querySelectorAll(".btn-agregar")]);
    } else {
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
document.addEventListener("DOMContentLoaded", () => {
  restaurarCarrito();
  stockAgotado();
});






 function agregarBotonesAlCarrito(){ 

  let imagenes=document.querySelectorAll("img[data-imagen]")
   


 imagenes.forEach((img)=>{
    img.addEventListener('click',async()=>{ 



      let imagenId=img.getAttribute('data-imagen')
      agregarProducto(imagenId)


    })
  })

 } 

 let carritoStorage=localStorage.getItem('productos') 
 
 let carritoCompras=carritoStorage?JSON.parse(carritoStorage):[]


 async function agregarProducto(imgID) { 
  const productos = await obtenerProductos(); 
  let primerProducto = productos.find(id => id.producto_id === imgID);
  
  if (primerProducto.stock === 0) {  
    
    return; // Sale de la función si el producto no tiene stock
  }

  let primerProductoStorage = carritoCompras.find(id => id.producto_id === imgID);

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
