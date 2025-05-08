import { obtenerCategorys, obtenerProductos, obtenerUsuarios } from "./api/productos.js";






let categoriasFiltrada = [];
let filtradoCategoryYProduct=[]

const selector = document.getElementById("categorySelector");
const listaProductos = document.getElementById("productos_lista");
const userIngresado=document.querySelector('.user__ingresado') 

  const usuarioNombre=JSON.parse(localStorage.getItem('usuario'))||[]
      console.log(usuarioNombre) 



      usuarios()


   async function usuarios() { 
    const usuario=await obtenerUsuarios() 

    reendedizarUsuario(usuario)

   }  



 function reendedizarUsuario(usuario) {  
  const obtenerUSer =usuario.user?.find(user => usuarioNombre.includes(user.usuario)); 

  
   if(obtenerUSer){ 
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
      ${obtenerUSer
        .usuario}
    </span>
  `;
    return


   }  


   localStorage.setItem('usuario', obtenerUSer.usuario);

   // Mostramos el nuevo usuario
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
       ${obtenerUSer.usuario}
     </span>
   `;

  
 }

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
  
     filtradoCategoryYProduct = productosFiltrados.filter(producto => 
      categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
    );
  
    if (filtradoCategoryYProduct.length > 0) {
      filtradoCategoryYProduct.forEach(producto => {
        const imagen = producto.imagenes?.[0]?.urls?.[0] || "img/default.png";
        console.log(imagen)
        const stock = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;
      
           
       
        listaProductos.insertAdjacentHTML("beforeend", `
          <section class="col-md-3 product-card lista" data-productos="${producto.producto_id}">
            <div class="card">
              <img src="${imagen}"data-imagen-producto="${producto.producto_id}" " class="card-img-top imagen" alt="">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre_producto}</h5>
                <p class="card-text">$${producto.precio}</p>
                <button class="btn btn-agregar btn-primary add-to-cart"data-productos="${producto.producto_id}">
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

        localStorage.setItem('id-imagen', JSON.stringify(imagenId))
        localStorage.setItem('id-talle', JSON.stringify(talleId))
        localStorage.setItem('id-color', JSON.stringify(colorId))
        
      
        
        console.log(imagenId)  
        console.log(talleId)
        console.log(colorId)
    
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

  /*restaurarCarrito();*/
  stockAgotado();



 function agregarBotonesAlCarrito(botones){ 


  botones.forEach((btn)=>{

   console.log(btn,'btn')

    btn.addEventListener('click',async()=>{ 
   
      let producto_ID=btn.getAttribute('data-productos') 
     


      
      opcionesProducto(producto_ID)
      

    })
  })

 } 

 

 document.querySelector('.modal')

   
  

 


 async function opcionesProducto(producto_ID) { 
  
  let carritoCompras=JSON.parse(localStorage.getItem('productos'))||[]

    let sizesTexto=""
    let colorTexto=""


    const usuarios=await obtenerUsuarios()
    console.log('user:',usuarios)
    console.log(productos); // Debería ser un array
    console.log( producto_ID); 

    const obtenerUSer = usuarios.user?.find(user => usuarioNombre.includes(user.usuario));

            const {usuario,usuario_id}=obtenerUSer

  
    console.log(filtradoCategoryYProduct) 

    let imagenSeleccionada;
    

    for (const producto of filtradoCategoryYProduct) { 
      imagenSeleccionada = producto.imagenes.find(imagen => imagen.producto_id === producto_ID);
      if (imagenSeleccionada) {
        break;  // Solo cuando ENCUENTRES la imagen cortas el bucle
      }
    } 

   // Buscar color en las variantes de productos

   


   const nombre=filtradoCategoryYProduct.find(producto=>producto.producto_id===producto_ID)?.nombre_producto 
   const detalles=filtradoCategoryYProduct.find(producto=>producto.producto_id===producto_ID)?.detalles
   const precio=filtradoCategoryYProduct.find(producto=>producto.producto_id===producto_ID)?.precio 

  
   const imagenOpciones=imagenSeleccionada?.urls[0] 

    const varianteSeleccionada=filtradoCategoryYProduct.find(variante=>variante.producto_id===producto_ID)

   const talles=varianteSeleccionada.productos_variantes.map(talles=>{
    const varianteTalle=talles.talles.insertar_talle 
    return `  
     <button class="sizes-box" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">${varianteTalle}</button>
     
    `
    }).join("")
  console.log(talles)  

   
  const colores=varianteSeleccionada.productos_variantes.map(colores=>{
    const varianteColor=colores.colores.insertar_color 
    return `   
     <button class="colors-box" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">${varianteColor}</button>
  
    `
  }).join("")
  console.log(colores)




 const div=document.createElement("div")
 


              div.innerHTML=`

    <div id="modal" style="position: fixed; top: 50%; left: 50%; width: 600px; height:auto; display: flex; flex-direction:column; gap:1rem;  transform: translate(-50%, -50%); z-index: 9999; width: 500px; background: white; border-radius: 12px; padding: 24px; margin: 50px auto; box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);">
      <div class="modal-header" style="font-weight: bold; opacity:1; font-size: 16px; color: #444; display: flex; gap:1rem; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <span style="opacity:1;"  >Selecciona tus opciones para agregar el producto al carro</span>
        <span class="close" id="close" style="cursor: pointer; font-size: 20px;">&times;</span>
      </div>
      <div class="product-info" style="display: flex; align-items: center; gap: 10px;">
        <img src="${imagenOpciones}" alt="Botín Mujer Negro" style="width: 90px; height: auto;">
        <div class="details" style="font-size: 14px; color: #333;  display: flex;flex-direction:column; gap:10px;">
          <div>Nombre:${nombre}</div>
          <div>Detalles:${detalles}</div>
          <div class="price" style="font-size: 18px; font-weight: bold; color: #333;">Precio:$${precio}</div>
        </div>
      </div>
      <div class="section" style="margin-bottom: 16px;">
        <label for="talla" style="display: block;  font-weight: bold;">Talla:</label>
        <div class="sizes" style="display: flex; flex-wrap: wrap; gap: 10px;"> 
        ${talles} 

        </div>

        
      </div>
      <div class="section" style="margin-bottom: 16px;">
        <label for="color" style="display: block; margin-bottom: 8px; font-weight: bold;">Color:</label>
        <div class="colors" style="display: flex; flex-wrap: wrap; gap: 10px;"> 
        ${colores}
          
        </div>
      </div>
      <div class="footer" style="display: flex; justify-content: space-between; margin-top: 20px;">
        <button class="close-btn btn-cerrar" style="padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; background: #e0e0e0;">Cerrar</button>
        <button type="button" class="select-btn btn__opciones" style="padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; background: #444; color: white;">Elige tus opciones</button>
      </div>
    </div>

 `

  
    console.log(div)
   document.body.append(div) 

   document.getElementById("close").addEventListener("click", () => {
    document.getElementById("modal").remove();
  });

  document.querySelector(".btn-cerrar").addEventListener("click", () => {
    document.getElementById("modal").remove();
  }); 


    const sizes=document.querySelectorAll('.sizes-box') 
    const colors=document.querySelectorAll('.colors-box') 
    const btnOpciones=document.querySelector(".btn__opciones") 
    btnOpciones.disabled=true


  sizes.forEach(size=>{
   
    size.addEventListener('click',(e)=>{  


      sizes.forEach(s => s.classList.remove("seleccion_opciones_talles"));

      size.classList.add("seleccion_opciones_talles") 

      if(size.classList.contains("seleccion_opciones_talles")){ 
        
      btnOpciones.textContent="Comprar"
      btnOpciones.disabled=false
      sizesTexto=size.textContent  

       
      }
    
    })  

    
  }) 
 
 
   colors.forEach(color=>{
   
    color.addEventListener('click',(e)=>{   



      colors.forEach(c => c.classList.remove("seleccion_opciones_colores"));

      color.classList.add("seleccion_opciones_colores") 

      if(color.classList.contains("seleccion_opciones_colores")){ 
        
      btnOpciones.textContent="Agregar al Carrito"
      btnOpciones.disabled=false
      colorTexto=color.textContent 
    
      console.log(colorTexto)

      }
   
       
    }) 
    
  })  

  console.log(btnOpciones)



    btnOpciones.addEventListener("click",async()=>{   


      if(!sizes.length || !colors.length){
        return

      }

 


      let objectoStorage={
        
        user:usuario,
        user_id:usuario_id,
        producto_id:producto_ID,
        nombre_producto:nombre,
        precio_producto:precio,
        cantidad:1,
        detalles:detalles,
        imagen:imagenOpciones,
        color:colorTexto || "",
        talle:sizesTexto || ""

       } 
     

       console.log(objectoStorage) 

      /* BUSCAMOS QUE LAS VARIANTES COINCIDAN CON LOS TALLES Y COLORES SELECCIONADOS GRACIAS A LAS VARIANTES */


       const combinacionExiste = varianteSeleccionada.productos_variantes.some(variacion => {
        console.log('Comparando:');
        console.log('Talle del botón seleccionado:', sizesTexto);
        console.log('Color del botón seleccionado:', colorTexto);
        console.log('Talle de la variante actual:', variacion.talles.insertar_talle);
        console.log('Color de la variante actual:', variacion.colores.insertar_color);
        
        const resultadoComparacion = 
          variacion.talles.insertar_talle === sizesTexto &&
          variacion.colores.insertar_color === colorTexto;
      
        console.log('¿Coincide esta variante?', resultadoComparacion);
        console.log('------------------------------');
      
        return resultadoComparacion;
      });
      
      console.log('¿Existe la combinación talle+color?', combinacionExiste);
      
    
      if (!combinacionExiste) { 
        
        alert("Esta combinación de talle y color no está disponible, combinaciones unicas de talle abajo el color.");
        return; // No continúa
      }


       let primerProductoCarrito = carritoCompras.find(producto => 
        
        producto.color === colorTexto &&
        producto.talle === sizesTexto
      );
      

      if (primerProductoCarrito) {
        console.log('Coincidencia encontrada:', primerProductoCarrito);
        primerProductoCarrito.cantidad++;
        
      } else {
        console.log('No encontrado, se agrega nuevo:', objectoStorage);
        carritoCompras.push(objectoStorage);
      }
      


       localStorage.setItem("productos",JSON.stringify(carritoCompras))  

       
       await manejarCantidades(producto_ID,sizesTexto,colorTexto)
        actualizarCarrito()
      

    })

  } 
 



   async function manejarCantidades(productoID,sizes,color){  

    let talleID=null
    let colorID=null
    let stock=null
   
    
    const productos = await obtenerProductos();

    const productoSeleccionado=productos.find(producto=>producto.producto_id===productoID) 

     for (const element of productoSeleccionado.productos_variantes) { 

      
      
       if(element.talles.insertar_talle===sizes && element.colores.insertar_color===color){ 

        talleID=element.talles.talle_id || null
        colorID=element.colores.color_id || null 
        stock=element.stock
        break

       } 

     } 

     if(talleID===null || colorID===null){ 
      Swal.fire({
        title: `No hay ese talle con ese color ingrese el talle con el color de abajo, unica opcion disponible en stock`,
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

      return
     }
     


  
    document.getElementById("modal").remove(); 

    let carritoCompras=JSON.parse(localStorage.getItem('productos'))?JSON.parse(localStorage.getItem('productos')):[]

         const primerProducto=carritoCompras.find(p=>p.producto_id===productoID) 
        
         
         document.querySelector('.modal-2')?.remove()

        const div=document.createElement("div") 


    // Crear el contenido del modal
div.innerHTML = `
<div style="background: white; border-radius: 12px; width: 640px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="modal-2">
  <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #ddd;" class="modal-header">
    <h2 style="font-size: 18px; margin: 0; display: flex; align-items: center;">
      <span style="color: green; font-size: 24px; margin-right: 10px;" class="icon-check">✔</span>Producto agregado a tu Carro
    </h2>
    <button type="button" style="font-size: 24px; cursor: pointer; border: none;background: none;" id="close-x" class="modal_close">x</button>
  </div>
  <div style="display: flex; padding: 16px;" class="modal-content">
    <img style="width: 80px; height: auto; margin-right: 16px;" src="${primerProducto.imagen}" alt="Producto" />
    <div style="flex-grow: 1;" class="product-info">
      <h3 style="font-size: 14px; margin: 0; font-weight: normal;">${primerProducto.nombre_producto}</h3>
      <strong style="display: block; margin: 4px 0;">${primerProducto.detalles}</strong>
      <p style="color: red;">talle:${sizes}</p>
      <p style="color: red;">color:${color}</p>
      <p style="color: red;">el maximo permitido:${stock}  unidades</p>
      <div style="font-size: 18px; font-weight: bold;" class="product-price">Precio:$${primerProducto.precio_producto}</div>
      <div style="display: flex; align-items: center; margin-top: 8px;" class="quantity-selector">
        <button  class="boton-eliminar" id="btn-eliminar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
        <span class="quantity-selector" style="width: 30px; text-align: center;">${primerProducto.cantidad}</span>
        <button  class="boton-agregar" id="btn-agregar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
      </div>
    </div>
  </div>
  <div style="padding: 16px; display: flex; justify-content: space-between; border-top: 1px solid #ddd;" class="modal-footer">
    <a style=" font-weight: bold; color: #0046be;" class="seguir_comprando" href="#">Seguir comprando</a>
    <a id="carrito" href="./carrito.html" style="background: #3a3f4c; text-decoration:none; color: white; padding: 8px 24px; border: none; border-radius: 20px; font-size: 16px; cursor: pointer;" class="btn-carro">Ir al Carro</a>
  </div>
</div>
`;

let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];
stockStorage.push(stock);
localStorage.setItem('stocks', JSON.stringify(stockStorage));

console.log(div);
document.body.append(div);

// Delegación de eventos
div.addEventListener('click', (e) => {
const cantidadSpan = div.querySelector(".quantity-selector span"); // referencia al <span>

// Cerrar el modal
if (e.target.matches(".modal_close")) {
  const modal = div.querySelector(".modal-2");
  modal.remove();
}

// Seguir comprando (recargar la página)
if (e.target.matches(".seguir_comprando")) {
  window.location.reload();
}

// Botón de agregar cantidad
if (e.target.matches(".boton-agregar")) {
  e.preventDefault();
  if (primerProducto.cantidad < stock) {
    primerProducto.cantidad++;
    cantidadSpan.textContent = primerProducto.cantidad;
    localStorage.setItem('productos', JSON.stringify(carritoCompras));
  }
}

// Botón de eliminar cantidad
if (e.target.matches(".boton-eliminar")) {
  e.preventDefault();
  if (primerProducto.cantidad > 0) {
    primerProducto.cantidad--;
    cantidadSpan.textContent = primerProducto.cantidad || 0;
    localStorage.setItem('productos', JSON.stringify(carritoCompras));
  }
}
});

actualizarCarrito();

  
   } 


    

function actualizarCarrito() { 
 
  const carrito=JSON.parse(localStorage.getItem("productos"))?JSON.parse(localStorage.getItem("productos")):[]
  console.log(carrito)

  let iconCart = document.getElementById("cart-count");
  console.log(iconCart)

  iconCart.innerHTML = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

}




 
function restaurarCarrito() {
  let carritoStorage = localStorage.getItem('productos');
  let carritoCompras = carritoStorage ? JSON.parse(carritoStorage) : [];

  let iconCart = document.getElementById("cart-count");
  iconCart.innerHTML = carritoCompras.reduce((acc, producto) => acc + producto.cantidad, 0);
}

// Ejecutar la función al cargar la página
 restaurarCarrito()




































