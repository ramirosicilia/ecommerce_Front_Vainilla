import { obtenerCategorys, obtenerUsuarios } from "./api/productos.js";
import { obtenerProductos } from "./api/productos.js";
import { reendedizarDetallesProducto } from "./detallesProductos.js";


let categoriasFiltrada = [];

const selector = document.getElementById("categorySelector");
const listaProductos = document.getElementById("productos_lista");
const userIngresado=document.querySelector('.user__ingresado') 

const usuarioNombre=JSON.parse(localStorage.getItem('usuario')) 
    console.log(usuarioNombre) 



    userIngresado.innerHTML = `
    Ingreso: 
    <span style="
      margin-left: 10px;
      padding: 2px 6px;
      background-color: #e0f7fa;
      color: #00796b;
      border-radius: 5px;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
    ">
      ${usuarioNombre}
    </span>
  `;
  
  (async () => {
  await selectorCategorys(); // Llamar a la función para cargar las categorías
  await mostrarProductosVenta(); // Llamar a la función para mostrar los productos
})();



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
    const imagen = Array.isArray(producto.imagenes?.[0]?.urls)
  ? producto.imagenes[0].urls[0]
  : producto.imagenes?.[0]?.urls || "img/default.png";

      const stock = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;

      return `
        <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
          <div class="card">
            <img src="${imagen}" class="card-img-top" alt="">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre_producto || ""}</h5>
              <p class="card-text">$${producto.precio || 0}</p>
              <p class="card-text">Stock: ${stock}</p>
              <button class="btn btn-agregar btn-primary add-to-cart" data-img="${imagen}" data-productos="${producto.producto_id}">
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
        console.log(imagen)
        const stock = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;
        const tallesID = producto.productos_variantes?.find(v=>v.producto_id===producto.producto_id)?.talles?.talle_id || 0;
        const colorID = producto.productos_variantes?.find(v=>v.producto_id===producto.producto_id)?.colores?.color_id || 0;
           
        console.log(tallesID)
        console.log(colorID)
        listaProductos.insertAdjacentHTML("beforeend", `
          <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
            <div class="card">
              <img src="${imagen}"data-imagen-producto="${producto.producto_id}" data-talle="${tallesID}" data-color="${colorID}" class="card-img-top imagen" alt="">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre_producto}</h5>
                <p class="card-text">$${producto.precio}</p>
                <p class="card-text">Stock: ${stock}</p>
                <button class="btn btn-agregar btn-primary add-to-cart" data-img="${imagen}" data-productos="${producto.producto_id}">
                  Agregar al carrito
                </button>
              </div>
            </div>
          </section>
        `);
        let imagenDom=document.querySelectorAll(".imagen")
      
        stockAgotado(stock, producto.producto_id);
        recuperarImagenes( imagenDom)

      });
  
      agregarBotonesAlCarrito([...document.querySelectorAll(".btn-agregar")]);
    } else {
      listaProductos.innerHTML = `<p>No hay productos disponibles para mostrar.</p>`;
    }
  } 

    

   function recuperarImagenes(imagen, ) {  

    imagen.forEach((img) => {
      img.addEventListener('click', async (e) => { 
   
        let imagenId = e.currentTarget.getAttribute('data-imagen-producto')
        let talleId= e.currentTarget.getAttribute('data-talle')
        let colorId= e.currentTarget.getAttribute('data-color')
      
        
        console.log(imagenId)  
        console.log(talleId)
        console.log(colorId)
       reendedizarDetallesProducto(imagenId, talleId, colorId)
        setTimeout(() => {
         
          window.location.href ="./descripcionProducto.html";
        }, 1000);
       
      })
    })

   
    
    
    
   } 



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

  restaurarCarrito();
  stockAgotado();



 function agregarBotonesAlCarrito(botones){ 


  botones.forEach((btn)=>{

   console.log(btn,'btn')

    btn.addEventListener('click',async()=>{ 
   
      let imagenId=btn.getAttribute('data-productos') 
      let imagenURL = btn.getAttribute('data-img'); // ✅ imagen del botón
      
      agregarProducto(imagenId,imagenURL)


    })
  })

 } 

 let carritoStorage=localStorage.getItem('productos') 
 
 let carritoCompras=carritoStorage?JSON.parse(carritoStorage):[]



 async function agregarProducto(imgID,imagen) { 

  const productos = await obtenerProductos(); 
  const usuarios=await obtenerUsuarios()
  console.log('user:',usuarios)
  console.log(productos); // Debería ser un array
  console.log(imgID);



  // 🔍 Buscar en todos los productos la variante que coincida con el producto_id
  let primerProducto;
  let nombre_producto = ''; // Inicializamos el nombre del producto 
  let precio=""
  let producto_id=""
  
  const usuario=usuarios.user.find(user=>user.usuario===usuarioNombre)  



  console.log(usuario,'usuario') 

  const userData={
     usuario_id:usuario.usuario_id,
      usuario:usuarioNombre,
      
  } 
  console.log(userData,'userData')

  for (let producto of productos) {
    primerProducto = producto.productos_variantes.find(v => v.producto_id === imgID);
    if (primerProducto) { 
      nombre_producto = producto.nombre_producto; // Guardamos el nombre
      precio=producto.precio; // Guardamos el precio
      producto_id=producto.producto_id // Guardamos el id del producto
      break; // Salimos del bucle si ya encontramos la variante
    }
  }

  console.log(primerProducto, '44');

  // ✅ Validación segura por si no existe o no tiene stock
  if (!primerProducto || primerProducto.stock === 0) {
    return;
  }

  // ✅ Buscar en el carrito si ya está
  let primerProductoStorage = carritoCompras.find(item => item.variante.producto_id === imgID);
  console.log(primerProductoStorage, '55'); 
   console.log(imagen)

  if (primerProductoStorage) {
    primerProductoStorage.cantidad++;
    primerProductoStorage.usuario_id = userData.usuario_id;
    primerProductoStorage.usuario = userData.usuario;
  }
  
  else {
    primerProductoStorage = {
      variante: primerProducto,
      nombre:nombre_producto,
      precio: precio,
      producto_id: producto_id,
      cantidad: 1,
      usuario_id: userData.usuario_id,
      usuario: userData.usuario,
      urls:imagen // 
    
    };
    carritoCompras.push(primerProductoStorage);
  } 


  let carritoComprasStock = carritoCompras.filter(producto => 
    producto.variante?.stock > 0 &&
    producto.nombre &&
    producto.usuario_id === userData.usuario_id &&
    producto.usuario === userData.usuario
  );
  
  
  console.log(carritoCompras);
  console.log('El carrito de compras', carritoComprasStock);
  sumarCarrito(carritoComprasStock);

  if (carritoComprasStock.length > 0) {
    Toastify({
      text: "Producto agregado",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #4b33a8, #785ce9)",
        borderRadius: "2rem",
        textTransform: "uppercase",
        fontSize: ".75rem"
      },
      offset: {
        x: '1.5rem',
        y: '1.5rem'
      },
      onClick: function () {}
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
