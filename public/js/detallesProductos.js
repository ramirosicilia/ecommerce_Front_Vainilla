import { obtenerCategorys, obtenerProductos, obtenerUsuarios } from "./api/productos.js";
import { actualizarCarrito } from "./paginaProductos.js";


  let categorias=[]
  let productos=[] 

  const container=document.querySelector(".container")

 async function obtenerDatos(){  
    
     categorias= await obtenerCategorys();
     productos= await obtenerProductos() 
    
}

const imgID= JSON.parse(localStorage.getItem("id-imagen"));

async function reendedizarDetallesProductos() {
    await obtenerDatos();
  
  
    
    const productosActivos= productos.filter(producto => producto?.activacion === true);
    const categoriasFiltradas= categorias.filter(categoria => categoria?.activo === true);
    const productosActivosFiltrados= productosActivos.filter(producto =>
      categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)
    );
  
    let varianteSeleccionada;
    let imagenSeleccionada; // ✅ declarar variable para la imagen
    const productoSeleccionado= productosActivosFiltrados.find(producto => {
      const variante= producto.productos_variantes.find(v =>
        v.producto_id === imgID 
      
      );
  
      if (variante) {
        // ✅ Guardar la imagen relacionada
        imagenSeleccionada = producto.imagenes.find(img =>
          img.producto_id === imgID
        );
        varianteSeleccionada = variante;
        return true;
      }
     return false;
    }
  
  );
  

    if (!productoSeleccionado || !varianteSeleccionada) {
      console.error("Producto o variante no encontrados.");
      return;
    }
  
    // ✅ Usar la imagen seleccionada
    const imagenPrincipal = imagenSeleccionada?.urls?.[0] || './images/default.jpg';
    console.log(imagenPrincipal);
  
    // Miniaturas (excluye la primera imagen, que ya se usa como principal)
   // Miniaturas (excluye la imagen principal)
    const todasLasImagenes = imagenSeleccionada?.urls || [];
    const miniaturas = todasLasImagenes.slice(1).map(url => `
      <img src="${url}" class="url" style="width: 70px; height: 70px; border-radius: 5px; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
           onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 8px 20px rgba(0, 0, 0, 0.2)';"   
           onclick="document.querySelector('#imagen-principal').src='${url}'">
    `).join('');

    const nombre = productoSeleccionado.nombre_producto || "Producto sin nombre";
    const descripcion = productoSeleccionado.descripcion || "Sin descripción";
    const detalle= productoSeleccionado.detalles || "Sin detalle";
  
    const precioBase = productoSeleccionado.precio || 0;
    const precio = (precioBase / 100).toFixed(2);
    const precioOriginal = (precioBase * 1.3 / 100).toFixed(2);
    const descuento = Math.round(100 - (precio / precioOriginal) * 100);
    
    const talles = productoSeleccionado.productos_variantes.map(v => v.talles);
    const colores = productoSeleccionado.productos_variantes.map(v => v.colores);
    


  
    const tallesHTML = talles.map(talle => `
      <button class="insertar_talle" style="padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 5px; margin: 5px;">
        ${talle.insertar_talle}
      </button>
    `).join('');
  
    const coloresHTML = colores.map(color => `
      <button class="insertar_color"  style="padding: 10px; border: 1px solid gray; background: white; cursor: pointer; border-radius: 5px; margin: 5px;">
        ${color.insertar_color}
      </button>
    `).join('');
  
    container.innerHTML = `
      <div style="max-width: 1200px; width: 100%; display: flex; justify-content: center; align-items: center; gap: 50px; flex-wrap: wrap;">
        <div style="flex: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 25px;">
          <img src="${imagenPrincipal}" id="imagen-principal" alt="${nombre}"
               style="width: 300px; height: auto; margin-bottom: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); animation: rotate 5s infinite linear; transition: transform 0.3s ease;">
          
          <div style="display: flex; justify-content: center; gap: 2rem;">
            ${miniaturas}
          </div>
        </div>
  
        <div style="flex: 1; max-width: 500px; padding-left: 20px;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">${nombre}</h1>
          <p>${detalle}</p>
          <p>
            <span style="color: red; font-size: 24px; font-weight: bold;">$/ ${precio}</span>
            <span style="text-decoration: line-through; color: gray; margin-left: 10px;">$/ ${precioOriginal}</span>
            <span style="background-color: red; color: white; padding: 2px 5px; border-radius: 3px; font-size: 14px;">-${descuento}%</span>
          </p>
  
          <h3>Talla:</h3>
          <div>${tallesHTML}</div>
  
          <h3>Colores:</h3>
          <div>${coloresHTML}</div>
  
          <h3>Descripción del producto</h3>
          <p>${descripcion}</p>
  
          <h3>Opciones de entrega:</h3>
          <p>✔ Llega mañana | ✔ Retira mañana</p>
  
          <div>
            <button id=boton-descripcion style="padding: 12px 20px; border: none; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px 0; background:rgb(255, 0, 179); color: white;">Elije tus opciones</button>
            <button id=boton-agregar-carrito style="padding: 12px 20px; display: none; border: none; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px 0; background:rgb(255, 0, 179); color: white;">agregar al carrito</button>

          </div>
        </div>
      </div>
    `; 

      const coloresDescripcion=document.querySelectorAll(".insertar_color")
       const tallesDescripcion=document.querySelectorAll(".insertar_talle") 
       const botonDescripcion=document.getElementById("boton-descripcion") 
       const botoAgregarCarrito=document.getElementById("boton-agregar-carrito")
       console.log(coloresDescripcion,tallesDescripcion)  


       setTimeout(() => {
        const miniaturas = document.querySelectorAll('.url');
        const imagenPrincipal = document.querySelector('#imagen-principal');
      
        // Guardamos el src original de la imagen principal (para que siempre exista)
        let srcPrincipalActual = imagenPrincipal.src;
      
        miniaturas.forEach(miniatura => {
          miniatura.addEventListener('mouseenter', () => {
            // Guardamos el src actual de la miniatura
            const srcMini = miniatura.src;
      
            // Intercambiamos: la miniatura recibe el actual de la principal,
            // la principal recibe el de la miniatura
            miniatura.src = srcPrincipalActual;
            imagenPrincipal.src = srcMini;
      
            // Actualizamos el src actual de la principal para el próximo cambio
            srcPrincipalActual = srcMini;
          });
        });
      }, 50);
      


       let seleccion={
        color:null,
        talle:null
       }

    
       coloresDescripcion.forEach(color=>{

        color.addEventListener("click",async(e)=>{ 
    

          botonDescripcion.disabled=true
          
          coloresDescripcion.forEach(color=>color.classList.remove("seleccion_opciones_colores")) 
          e.target.classList.add("seleccion_opciones_colores") 

          if(e.target.classList.contains("seleccion_opciones_colores") && botonDescripcion.disabled===true){ 
            
           e.target.classList.add("seleccion_opciones_colores") 
           botonDescripcion.style.display="none"
           botoAgregarCarrito.style.display="block"
   
          seleccion.color=color.textContent

  
        
          }

        })
       })  




        tallesDescripcion.forEach(talle=>{

          talle.addEventListener("click",async(e)=>{  
             

            botonDescripcion.disabled=true
          
        tallesDescripcion.forEach(talle=>talle.classList.remove("seleccion_opciones_talles")) 

            e.target.classList.add("seleccion_opciones_talles") 
  
            if(e.target.classList.contains("seleccion_opciones_talles")){ 
               
             e.target.classList.add("seleccion_opciones_talles") 
             botonDescripcion.disabled=false
             botonDescripcion.style.display="none"
             botoAgregarCarrito.style.display="block"
             seleccion.talle=talle.textContent

           
            }
          })
         }) 

         let producto_ID=imgID
         gestionarTallesYcolores(producto_ID,seleccion)

  }  

    

  async function activarDescripcion(){ 

    await reendedizarDetallesProductos();

    const btnDescripcion=document.getElementById("boton-descripcion") 

   btnDescripcion.addEventListener("click",(e)=>{ 
    e.stopPropagation()

  

    const producto_ID=imgID 

    recibirDescripcion(producto_ID)

   })


   } 

   activarDescripcion() 

   const modal=document.getElementById("modal") 

   const cerrarCruz=document.getElementById("close")
   const cerrarBoton=document.querySelector(".btn-cerrar")
   const name=document.querySelector('.nombre')
   const details=document.querySelector('.detalles')
   const price=document.querySelector('.precio')
   const imgModal=document.querySelector(".imagen_modal")
  
   const sizeContainer=document.querySelector("#sizes-box") 
   const colorContainer=document.querySelector(".colors-box")
   
   
   const btnOpciones=document.querySelector(".btn__opciones") 
   console.log(btnOpciones)

  
  
  
   

   //FUNCION********************************************************************************************************
   

   async function recibirDescripcion(producto_ID) { 

    const usuarioNombre = JSON.parse(localStorage.getItem('usuario')) || [];
  
    let sizesTexto = "";
    let colorTexto = "";
  
    const usuarios = await obtenerUsuarios();
    console.log('user:', usuarios);
    const productos = await obtenerProductos();
    console.log(productos); 
    console.log(producto_ID); 
    let categoria = await obtenerCategorys();
  
    console.log(usuarioNombre, '22');
  
    const obtenerUSer = usuarios.user?.find(user => usuarioNombre.includes(user.usuario));
    const { usuario, usuario_id } = obtenerUSer;
  
    let imagenSeleccionada;
  
    let categoriasFiltrada = categoria.filter(category => category.activo === true);
    const productosFiltrados = productos.filter(p => p.activacion === true);
    let filtradoCategoryYProduct = productosFiltrados.filter(producto =>
      categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
    );
  
    for (const producto of filtradoCategoryYProduct) {
      imagenSeleccionada = producto.imagenes.find(imagen => imagen.producto_id === producto_ID);
      if (imagenSeleccionada) break;
    }
  
    const productoSeleccionado = filtradoCategoryYProduct.find(producto => producto.producto_id === producto_ID);
    if (!productoSeleccionado) return;
    const { nombre_producto, detalles, precio } = productoSeleccionado;
  
    const imagenOpciones = imagenSeleccionada?.urls[0];
  
    const varianteSeleccionada = filtradoCategoryYProduct.find(variante => variante.producto_id === producto_ID);
  
    const talles = varianteSeleccionada.productos_variantes.map(talles => {
      const varianteTalle = talles.talles.insertar_talle;
      return `
        <button class="sizes" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">${varianteTalle}</button>
      `;
    }).join(" ");
    console.log(talles);
  
    const colores = varianteSeleccionada.productos_variantes.map(colores => {
      const varianteColor = colores.colores.insertar_color;
      return `
        <button class="colors" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">${varianteColor}</button>
      `;
    }).join(" ");
    console.log(colores);
  
    const container = document.querySelector('.container');
    console.log(container);
    console.log(modal);
    console.log(sizeContainer);
  

  
    imgModal.src = imagenOpciones;
    name.innerHTML = "Nombre: " + nombre_producto;
    details.innerHTML = "Detalle: " + detalles;
    price.innerHTML = "precio: $" + precio;
  
    sizeContainer.innerHTML = talles;
    colorContainer.innerHTML = colores;
  
    container.append(modal);
  
    const sizes = document.querySelectorAll('.sizes');
    const colors = document.querySelectorAll('.colors');
  
    sizes.forEach(size => {
      size.addEventListener("click", () => {
        sizes.forEach(s => s.classList.remove("seleccion_opciones_talles"));
        size.classList.add("seleccion_opciones_talles");
        sizesTexto = size.textContent;
        if (colorTexto) activarBoton();
      });
    });
  
    colors.forEach(color => {
      color.addEventListener("click", () => {
        colors.forEach(c => c.classList.remove("seleccion_opciones_colores"));
        color.classList.add("seleccion_opciones_colores");
        colorTexto = color.textContent;
        if (sizesTexto) activarBoton();
      });
    });

    modal.style.display = "flex";
  
    function activarBoton() {
      btnOpciones.textContent = "Agregar al Carrito";
      btnOpciones.disabled = false;
    }
  
    console.log(btnOpciones);
  
    cerrarCruz.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    cerrarBoton.addEventListener("click", () => {
      modal.style.display = "none";
    });
    let carritoCompras = JSON.parse(localStorage.getItem('productos')) || [];
  
    btnOpciones.addEventListener("click", async () => {
     
  
      let objectoStorage = {
        user: usuario,
        user_id: usuario_id,
        producto_id: producto_ID,
        nombre_producto: nombre_producto,
        precio_producto: precio,
        cantidad: 1,
        detalles: detalles,
        imagen: imagenOpciones,
        color: colorTexto || "",
        talle: sizesTexto || ""
      };
  
      console.log(objectoStorage);
  
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
        alert("Esta combinación de talle y color no está disponible, combinaciones únicas de talle abajo del color.");
        return;
      }
      let colorNormalizado = (colorTexto || "").trim().toLowerCase();
      let talleNormalizado = (sizesTexto || "").trim().toLowerCase();
      
      let existeProducto = carritoCompras.find(producto =>
        producto.producto_id === producto_ID &&
        (producto.color || "").trim().toLowerCase() === colorNormalizado &&
        (producto.talle || "").trim().toLowerCase() === talleNormalizado &&
        producto.user_id === usuario_id // Asegura que sea del mismo usuario
      );
      
      if (existeProducto) {
        existeProducto.cantidad ++;
        actualizarCarrito()
      } else {
        carritoCompras.push({...objectoStorage});
        actualizarCarrito()
      }
      
  
      localStorage.setItem("productos", JSON.stringify(carritoCompras));
  
      manejarCantidadesDescripcion(producto_ID, sizesTexto, colorTexto);
    });
  }
  



  
  async function gestionarTallesYcolores(producto_ID, seleccion) {
    let botonAgregarCarrito = document.querySelector("#boton-agregar-carrito");
  
    botonAgregarCarrito.addEventListener("click", async (e) => {
      if (seleccion.talle && seleccion.color) {
        console.log(seleccion.talle, seleccion.color);
        await manejarCantidadesCarrito(producto_ID, seleccion.talle, seleccion.color);
      }
    });
  }
  
    

  
    async function manejarCantidadesDescripcion(productoID,sizes,color){  

       let talleID=null
        let colorID=null
        let stock=null
       
        
        const productos = await obtenerProductos();
    
        const productoSeleccionado=productos.find(producto=>producto.producto_id===productoID) 
        if(!productoSeleccionado){
          alert('no hay productos')
        }
    
         for (const element of productoSeleccionado.productos_variantes) { 
    
          
          
           if(element.talles.insertar_talle.toString().trim()===sizes.toString().trim() && element.colores.insertar_color.toString().trim()===color.toString().trim()){ 
    
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
         
    

           if(modal){
            modal.style.display="none"

           }
      

    
        let carritoCompras=JSON.parse(localStorage.getItem('productos'))||[]
    
             const primerProducto=carritoCompras.find(p=>p.producto_id===productoID&&
                                                      p.color.toString().trim()===color.toString().trim() && p.talle.toString().trim()===sizes.toString().trim()
             ) 
             if (!primerProducto) {
              console.warn("Producto no encontrado en carrito");
              return;
            }
            
             document.querySelector(".modal-2")?.remove();

             const div = document.createElement("div");
          
             
  
             div.innerHTML = `
               <div id="${productoID}-${color}-${sizes}" style="background: white; border-radius: 12px; width: 640px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="modal-2">
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
                     <p style="color: red;">el maximo permitido:${stock} unidades</p>
                     <div style="font-size: 18px; font-weight: bold;" class="product-price">Precio:$${primerProducto.precio_producto}</div>
                     <div style="display: flex; align-items: center; margin-top: 8px;" class="quantity-selector-container">
                       <button class="boton-eliminar" id="btn-eliminar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
                       <span class="quantity-selector" style="width: 30px; text-align: center;">${primerProducto.cantidad}</span>
                       <button class="boton-agregar" id="btn-agregar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
                     </div>
                   </div>
                 </div>
                 <div style="padding: 16px; display: flex; justify-content: space-between; border-top: 1px solid #ddd;" class="modal-footer">
                   <a style="font-weight: bold; color: #0046be;" class="seguir_comprando" href="#">Seguir comprando</a>
                   <a id="carrito" href="./carrito.html" style="background: #3a3f4c; text-decoration:none; color: white; padding: 8px 24px; border: none; border-radius: 20px; font-size: 16px; cursor: pointer;" class="btn-carro">Ir al Carro</a>
                 </div>
               </div>
             `;
             
             let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];
             stockStorage.push(stock);
             localStorage.setItem('stocks', JSON.stringify(stockStorage));
             
             if (!container.contains(div)) {
              container.append(div);
            }
            
             
             container.addEventListener("click", (e) => {
               const target = e.target;
             
               // Botón "Seguir comprando"
               if (target.matches(".seguir_comprando")) {
                 window.location.reload();
               } 



             
               // Botón cerrar modal (x)
               if (target.classList.contains("modal_close")) {
                 const modal = target.closest(".modal-2");
                 if (modal) modal.remove();
               }
             
               // Botón agregar cantidad
               if (target.matches(".boton-agregar")) {
                 e.preventDefault();
                 if (primerProducto.cantidad < stock) {
                   primerProducto.cantidad++;
                   const cantidadSpan = target.closest(".quantity-selector-container").querySelector(".quantity-selector");
                   cantidadSpan.textContent = primerProducto.cantidad;
             
                   localStorage.setItem("productos", JSON.stringify(carritoCompras));
                   actualizarCarrito()
                 }
               }
             
               // Botón eliminar cantidad
               if (target.matches(".boton-eliminar")) {
                 e.preventDefault();
                 if (primerProducto.cantidad > 0) {
                   primerProducto.cantidad--;
                   const cantidadSpan = target.closest(".quantity-selector-container").querySelector(".quantity-selector");
                   cantidadSpan.textContent = primerProducto.cantidad || 0;
                 }
             
                 if (primerProducto.cantidad === 0) {
                   const index = carritoCompras.findIndex(
                     (producto) =>
                       producto.producto_id.toString() === productoID.toString() &&
                       producto.color.toString().trim() === color.toString().trim() &&
                       producto.talle.toString().trim() === sizes.toString().trim()
                   );
             
                   if (index !== -1) {
                     carritoCompras.splice(index, 1);
                   } 
                   // Elimina el modal correspondiente al producto
                     const modalId = `${productoID}-${color}-${sizes}`;
                     const modal = document.getElementById(modalId);
                     if (modal) modal.remove();


                 }
             
                 localStorage.setItem("productos", JSON.stringify(carritoCompras));
                 actualizarCarrito()
               }
             });
             
             if (carritoCompras.length === 0) { 
            
              localStorage.removeItem("productos"); // Limpia si ya no hay nada
              actualizarCarrito()
            } 

            
            
        
      } 






      async function manejarCantidadesCarrito(productoID,sizes,color){ 

        let carritoCompras=JSON.parse(localStorage.getItem('productos'))||[]

        const usuarioNombre=JSON.parse(localStorage.getItem('usuario'))||[]
     
       

         let talleID=null
         let colorID=null
         let stock=null 
         let colorNombre=null
         let talleNombre=null
  
  
  
   
           
         const usuarios=await obtenerUsuarios()
         const productos = await obtenerProductos();
         const categoria=await obtenerCategorys()
      
  
         const obtenerUSer = usuarios.user?.find(user => usuarioNombre.includes(user.usuario));
       
         const {usuario,usuario_id}=obtenerUSer
  
  
  
  
  let imagenSeleccionada; 
  
  let categoriasFiltrada = categoria.filter(category => category.activo === true);
  const productosFiltrados = productos.filter(p => p.activacion === true);
  let filtradoCategoryYProduct = productosFiltrados.filter(producto => 
  categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
  );
  
  
  for (const producto of filtradoCategoryYProduct) { 
   imagenSeleccionada = producto.imagenes.find(imagen => imagen.producto_id === productoID);
   if (imagenSeleccionada) {
     break;  // Solo cuando ENCUENTRES la imagen cortas el bucle
   }
  } 
  
  // Buscar color en las variantes de productos
  
  
  
  
  const nombre=filtradoCategoryYProduct.find(producto=>producto.producto_id===productoID)?.nombre_producto 
  const detalles=filtradoCategoryYProduct.find(producto=>producto.producto_id===productoID)?.detalles
  const precio=filtradoCategoryYProduct.find(producto=>producto.producto_id===productoID)?.precio 
  
  
  const imagenOpciones=imagenSeleccionada?.urls[0] 
  
  
    
     
         const productoSeleccionado=productos.find(producto=>producto.producto_id===productoID) 
     
  
         console.log(productoSeleccionado) 
  
       
          for (const element of productoSeleccionado.productos_variantes) { 
          
     
           console.log(element) 
    
  
           
           if (String(element.talles.insertar_talle).trim().toLowerCase() === String(sizes).trim().toLowerCase()
           && 
            String(element.colores.insertar_color).trim().toLowerCase() === String(color).trim().toLowerCase()
          ) {
            console.log(sizes);
            console.log(color);
        
            talleID = element.talles.talle_id || null;
            colorID = element.colores.color_id || null;
            colorNombre=element.colores.insertar_color || null;
            talleNombre=element.talles.insertar_talle || null;
            stock = element.stock;
            
           
            break;
          }
     
          } 
  
          const objectoStorage={
            user:usuario,
            user_id:usuario_id,
            producto_id:productoID,
            nombre_producto:nombre,
            precio_producto:precio,
            cantidad:1,
            detalles:detalles,
            imagen:imagenOpciones,
            color:colorNombre || "",
            talle:talleNombre || ""
          } 

          console.log(colorNombre)
          console.log(talleNombre)
  
       
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
          
     
  
        
           
            console.log(carritoCompras)
      
           let primerProducto = carritoCompras.find(producto => 
            producto.producto_id.toString().trim()===productoID.toString().trim()&&
            producto.color.toString().trim() === color.toString().trim()&&
            producto.talle.toString().trim() === sizes.toString().trim()
          );
                 console.log(primerProducto) 

                 
  
                  if(primerProducto){  
                 
                    primerProducto.cantidad++
                    actualizarCarrito()
  
                  }
  
                 else{ 
                  carritoCompras.push({...objectoStorage}) 
                  actualizarCarrito()
                
                 }
      
        

  
  
         let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];
         stockStorage.push(stock);
         localStorage.setItem('stocks', JSON.stringify(stockStorage)); 
         localStorage.setItem('productos', JSON.stringify(carritoCompras));
      
     
         document.querySelector('.nuevo-modal')?.remove()
     
         const section=document.createElement("section") 
  
         section.innerHTML = ` 
         <div style="background: white; border-radius: 12px; width: 640px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);" class="nuevo-modal">
           <div style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #ddd;" class="modal-header">
             <h2 style="font-size: 18px; margin: 0; display: flex; align-items: center;">
               <span style="color: green; font-size: 24px; margin-right: 10px;" class="icon-check">✔</span>Producto agregado a tu Carro
             </h2>
             <button type="button" style="font-size: 24px; cursor: pointer; border: none;background: none;" id="close-x" class="modal_close">x</button>
           </div>
           <div style="display: flex; padding: 16px;" class="modal-content">
             <img style="width: 80px; height: auto; margin-right: 16px;" src="${imagenOpciones}" alt="Producto" />
             <div style="flex-grow: 1;" class="product-info">
               <h3 style="font-size: 14px; margin: 0; font-weight: normal;">${nombre}</h3>
               <strong style="display: block; margin: 4px 0;">${detalles}</strong>
               <p style="color: red;">talle:${sizes}</p>
               <p style="color: red;">color:${color}</p>
               <p style="color: red;">el maximo permitido:${stock} unidades</p>
               <div style="font-size: 18px; font-weight: bold;" class="product-price">Precio:$${precio}</div>
               <div style="display: flex; align-items: center; margin-top: 8px;" class="quantity-selector">
                 <button class="boton-eliminar" id="btn-eliminar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">-</button>
                 <span class="quantity-selector" style="width: 30px; text-align: center;">${primerProducto?.cantidad || objectoStorage.cantidad}</span>
                 <button class="boton-agregar" id="btn-agregar" style="width: 28px; height: 28px; font-size: 16px; border: 1px solid #ccc; background: white; cursor: pointer;">+</button>
               </div>
             </div>
           </div>
           <div style="padding: 16px; display: flex; justify-content: space-between; border-top: 1px solid #ddd;" class="modal-footer">
             <a style=" font-weight: bold; color: #0046be;" class="seguir_comprando" href="./productosUsuario.html">Seguir comprando</a>
             <a id="carrito" href="./carrito.html" style="background: #3a3f4c; text-decoration:none; color: white; padding: 8px 24px; border: none; border-radius: 20px; font-size: 16px; cursor: pointer;" class="btn-carro">Ir al Carro</a>
           </div>
         </div>
       `;
       
       if (!container.classList.contains(section)) {
         container.append(section);
       }
       
       let cantidadActual = primerProducto?.cantidad || objectoStorage.cantidad;
       const cantidadSpan = section.querySelector(".quantity-selector span"); // referencia al <span>
       
       section.addEventListener("click", (e) => {
         // SEGIR COMPRANDO
         if (e.target.matches(".seguir_comprando")) {
           window.location.reload();
         }
       
         // CERRAR MODAL
         if (e.target.matches(".modal_close")) {
           const modal = container.querySelector(".nuevo-modal");
           section.style.display = "none";
           if (modal) modal.remove();
         }
       
         if (e.target.matches(".boton-agregar")) {
          e.preventDefault();
        
          // Recalcular el producto actual desde el carrito
          let productoActual = carritoCompras.find(producto => 
            producto.producto_id.toString().trim() === productoID.toString().trim() &&
            producto.color.toString().trim() === color.toString().trim() &&
            producto.talle.toString().trim() === sizes.toString().trim()
          );
        
          if (productoActual) {
            if (productoActual.cantidad < stock) {
              productoActual.cantidad++;
              cantidadSpan.textContent = productoActual.cantidad;
              actualizarCarrito()
            }
          } else {
            if (objectoStorage.cantidad < stock) {
              carritoCompras.push({...objectoStorage});
              cantidadSpan.textContent = objectoStorage.cantidad;
              actualizarCarrito()
            }
          }
        
          localStorage.setItem("productos", JSON.stringify(carritoCompras));
        
        }
        
       
         // BOTÓN ELIMINAR
         if (e.target.matches(".boton-eliminar")) {
           e.preventDefault();
           if (primerProducto.cantidad > 0) {
           primerProducto.cantidad--;
             cantidadSpan.textContent = primerProducto.cantidad || 0;
           }
       
           if (primerProducto.cantidad === 0) {
             const index = carritoCompras.findIndex(
               (producto) =>
                 producto.producto_id.toString() === productoID.toString() &&
                 producto.color.toString().trim() === color.toString().trim() &&
                 producto.talle.toString().trim() === talleNombre.toString().trim()
             );
       
             if (index !== -1) {
               carritoCompras.splice(index, 1);
             }
       
             const modal = document.querySelector('.nuevo-modal');
             if (modal) {
               modal.remove();
             }
           }
       
           localStorage.setItem("productos", JSON.stringify(carritoCompras));
           actualizarCarrito()
         } 


       });
       
       
        

      }
     
   
  

  