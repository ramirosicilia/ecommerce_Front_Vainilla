import { obtenerCategorys, obtenerProductos, obtenerUsuarios } from "./api/productos.js";


  let categorias = []
  let productos = []
  const container=document.querySelector(".container")

 async function obtenerDatos(){  
    
     categorias = await obtenerCategorys();
     productos = await obtenerProductos() 
    
}


async function reendedizarDetallesProductos() {
    await obtenerDatos();
  
    const imgID = JSON.parse(localStorage.getItem("id-imagen"));
    
    const productosActivos = productos.filter(producto => producto?.activacion === true);
    const categoriasFiltradas = categorias.filter(categoria => categoria?.activo === true);
    const productosActivosFiltrados = productosActivos.filter(producto =>
      categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)
    );
  
    let varianteSeleccionada;
    let imagenSeleccionada; // ✅ declarar variable para la imagen
    const productoSeleccionado = productosActivosFiltrados.find(producto => {
      const variante = producto.productos_variantes.find(v =>
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
      <img src="${url}" style="width: 70px; height: 70px; border-radius: 5px; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);"
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
          <img src="${imagenPrincipal}" alt="${nombre}"
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

          </div>
        </div>
      </div>
    `; 

      const coloresDescripcion=document.querySelectorAll(".insertar_color")
       const tallesDescripcion=document.querySelectorAll(".insertar_talle") 
       const botonDescripcion=document.getElementById("boton-descripcion")
       console.log(coloresDescripcion,tallesDescripcion) 


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
           botonDescripcion.disabled=false
           botonDescripcion.textContent="agregar al carrito"
          seleccion.color=color.textContent

    

      
           gestionarTallesYcolores(imgID,seleccion)
        
          }

        })
       })  




        tallesDescripcion.forEach(talle=>{

          talle.addEventListener("click",async(e)=>{  
             

            botonDescripcion.disabled=true
          
        tallesDescripcion.forEach(talle=>talle.classList.remove("seleccion_opciones_talles")) 

            e.target.classList.add("seleccion_opciones_talles") 
  
            if(e.target.classList.contains("seleccion_opciones_talles")&& botonDescripcion.disabled===true){ 
              
             e.target.classList.add("seleccion_opciones_talles") 
             botonDescripcion.disabled=false
             botonDescripcion.textContent="agregar al carrito"
           seleccion.talle=talle.textContent

           
                   let producto_ID=imgID
            
             gestionarTallesYcolores(producto_ID,seleccion)
          
            }
  

          
          })
         }) 


  }  

    

  async function activarDescripcion(){ 

    await reendedizarDetallesProductos();

    const btnDescripcion=document.getElementById("boton-descripcion") 

   btnDescripcion.addEventListener("click",()=>{ 

    const imgID = JSON.parse(localStorage.getItem("id-imagen"));

    const producto_ID=imgID 

    recibirDescripcion(producto_ID)

   

   })


   } 

   activarDescripcion() 

  let modal 

   async function recibirDescripcion(producto_ID){ 

        let sizesTexto=""
         let colorTexto=""
         const usuarioNombre=JSON.parse(localStorage.getItem('usuario'))?JSON.parse(localStorage.getItem('usuario')):[]
     
     
         const usuarios=await obtenerUsuarios()
         console.log('user:',usuarios)
         const productos = await obtenerProductos();
         console.log(productos); // Debería ser un array
         console.log( producto_ID); 
          let categoria = await obtenerCategorys();
         
         
     
         const obtenerUSer = usuarios.user?.find(user => usuarioNombre.includes(user.usuario));
     
                 const {usuario,usuario_id}=obtenerUSer
     
       
      
     
         let imagenSeleccionada; 

        let categoriasFiltrada = categoria.filter(category => category.activo === true);
         const productosFiltrados = productos.filter(p => p.activacion === true);
        let filtradoCategoryYProduct = productosFiltrados.filter(producto => 
          categoriasFiltrada.some(cat => cat.categoria_id === producto.categoria_id)
        );
         
     
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
         })
       console.log(talles)  
     
        
       const colores=varianteSeleccionada.productos_variantes.map(colores=>{
         const varianteColor=colores.colores.insertar_color 
         return `   
          <button class="colors-box" style="padding: 10px 14px; border: 1px solid #ccc; background: white; border-radius: 6px; cursor: pointer; min-width: 50px; text-align: center;">${varianteColor}</button>
       
         `
       })
       console.log(colores)
     
     
     
     
      const div=document.createElement("div")
      
     
     
                   div.innerHTML=`
     
         <div id="modal" class="modal-class" style="position: fixed; top: 50%; left: 50%; width: 600px; height:auto; display: flex; flex-direction:column; gap:1rem;  transform: translate(-50%, -50%); z-index: 9999; width: 500px; background: white; border-radius: 12px; padding: 24px; margin: 50px auto; box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);">
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

        modal=document.getElementById("modal") 
     
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
            let carritoCompras=JSON.parse(localStorage.getItem('productos'))?JSON.parse(localStorage.getItem('productos')):[]
      
      
             let primerProductoCarrito = carritoCompras.find(producto => 
              producto.producto_id === producto_ID &&
              producto.color === colorTexto &&
              producto.talle === sizesTexto
            );
            
      
           if(primerProductoCarrito){
            
             primerProductoCarrito.cantidad++
          
      
           }
      
            else{ 
              
             carritoCompras.push(objectoStorage) 
             
      
            }
          
      
      
             localStorage.setItem("productos",JSON.stringify(carritoCompras))  
 
 
           manejarCantidadesDescripcion(producto_ID,sizesTexto,colorTexto,)
      
    
  
         }) 

        

   } 

 
 
 

   async function gestionarTallesYcolores(producto_ID,seleccion){

    
    let btnOpciones=document.querySelector("#boton-descripcion ") 
    console.log(btnOpciones) 



   

    btnOpciones.addEventListener("click",async(e)=>{  
       e.stopPropagation() 
    
       
         
      if (seleccion.talle && seleccion.color) { 

        console.log(seleccion.talle,seleccion.color)

        await manejarCantidadesDescripcion(producto_ID, seleccion.talle, seleccion.color); 
      
       
        
      } 



    })

   }





    async function manejarCantidadesDescripcion(productoID,sizes,color){  
   
       let talleID=null
       let colorID=null
       let stock=null 

  
      
     
       const productos = await obtenerProductos();
   
       const productoSeleccionado=productos.find(producto=>producto.producto_id===productoID) 

       console.log(productoSeleccionado) 

       console.log(sizes) 

       console.log(color)
   
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
          stock = element.stock;
          console.log(talleID);
          console.log(colorID);
          console.log(stock);
          break;
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
        
   
          modal=document?.getElementById("modal") 
      
         console.log(modal) 

         if(modal){

          modal.remove(); 

         }
        
       
      
       let carritoCompras=JSON.parse(localStorage.getItem('productos'))?JSON.parse(localStorage.getItem('productos')):[]
   
            const primerProducto=carritoCompras.find(p=>p.producto_id===productoID) 
   
   
           const div=document.createElement("div") 
   
   
       div.innerHTML=` 
   
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
   
          
       ` 
   
       let stockStorage = JSON.parse(localStorage.getItem('stocks')) || [];
       stockStorage.push(stock);
       localStorage.setItem('stocks', JSON.stringify(stockStorage));
   
      
   
            console.log(div)
        document.body.append(div) 
        const cantidadSpan = div.querySelector(".quantity-selector span"); // referencia al <span>
   
       
        const btnSeguirCompra=document.querySelector(".seguir_comprando")
   
        btnSeguirCompra.addEventListener("click",(e)=>{ 
   
      
           if (e.target.matches(".seguir_comprando")) {
             window.location.reload();
           }
    
       
        }) 
   
        const cerrar=document.querySelector(".modal_close")
        console.log(cerrar)
        const Modal=document.querySelector(".modal-2")
        console.log(Modal)
        
         cerrar.addEventListener("click",(e)=>{ 
          e.stopPropagation()
         Modal.remove() 
    
       
     
        })
      
        const botonAgregar=document.getElementById("btn-agregar")  
        const botonEliminar=document.getElementById("btn-eliminar")  
        
        console.log(botonAgregar)
   
        botonAgregar.addEventListener("click",(e)=>{
         e.preventDefault() 
         console.log('opcionado') 
         console.log(primerProducto)
   
          if(primerProducto.cantidad<stock){
       
           primerProducto.cantidad++
           cantidadSpan.textContent=primerProducto.cantidad
           
   
           localStorage.setItem('productos', JSON.stringify(carritoCompras));
   
          } 
   
        
        }) 
   
   
        botonEliminar.addEventListener("click",(e)=>{ 
         cantidadSpan.textContent=""
         e.preventDefault() 
         console.log('opcionado') 
         console.log(primerProducto)
   
          if(primerProducto.cantidad>0){
           primerProducto.cantidad--
           cantidadSpan.textContent=primerProducto.cantidad || 0
       
   
           
           localStorage.setItem('productos', JSON.stringify(carritoCompras));
           
          } 
          
   
          
        }) 
      } 
     
   
  

  