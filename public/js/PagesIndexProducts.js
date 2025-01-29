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

            listaProductos.innerHTML+=` 
            <div class="col-md-3 product-card" data-category="tapados">
                  <div class="card">
                    <img src="${producto.imagenes}" class="card-img-top" alt="${producto.categorias.nombre_categoria}">
                    <div class="card-body">
                      <h5 class="card-title">${producto.nombre_producto}</h5>
                      <p class="card-text">$${producto.precio}</p>
                      <button class="btn btn-agregar btn-primary add-to-cart">Agregar al carrito</button>
                    </div>
                  </div>
                </div>

            ` 
         });  

         let botonesAgregarCarrito=[...document.querySelectorAll(".btn-agregar")]
        
      
         agregarBotonesAlCarrito(botonesAgregarCarrito)

         
    
     } 

     else {
        listaProductos.innerHTML = `<p>No hay productos disponibles para mostrar.</p>`;
      }


 }   


    mostrarProductosVenta() 

    async function selectorCategorys(){ 

        let productos = await obtenerProductosVenta(); 

        // Mapear las categorías desde los productos (asegurarse de que el producto tenga categoría válida)
        let categorias = productos
            .filter(producto => producto.categorias) // Solo productos con categorías definidas
            .map(producto => ({
                nombre: producto.categorias.nombre_categoria,
                activo: producto.categorias.activo
            }));
        
        // Eliminar duplicados (por el nombre de la categoría)
        let categoriasUnicas = [
            ...new Map(categorias.map(categoria => [categoria.nombre, categoria])).values()
        ]; 
        console.log(categoriasUnicas)  
       
      

        let categoriasLocales = JSON.parse(localStorage.getItem("category")) || []; 
        console.log(categoriasLocales)
        let filtradaStorage=categoriasLocales.filter(categorias=>categorias.activo===true) 
        console.log(filtradaStorage)

        // Filtrar solo las categorías activas
        let categoriasActivas = categoriasUnicas.filter(categoria => categoria.activo === true); 
        console.log(categoriasActivas)
        
        combinadas=[...filtradaStorage] 
       
           

        if(combinadas.length>0){ 
           
            combinadas.forEach(categoria=>{
                selector.innerHTML+=`
             <option value="${categoria.categoria}">${categoria.categoria}</option>

            `

            })
        }


    }

    selectorCategorys()


    selector.addEventListener("change", async (e) => {
      const listaProductos=document.getElementById("product-list") 
      const categoriaSelector = e.target.value; 

           listaProductos.innerHTML=""

          if(categoriaSelector!="todas"){ 

              productosFiltrados.forEach(producto=>{

                  if(producto.categorias.nombre_categoria===categoriaSelector){    
                      console.log(producto)
                      console.log(categoriaSelector)
                  
                            console.log(producto)
                          listaProductos.innerHTML+=` 
                          <div class="col-md-3 product-card" data-category="tapados">
                                <div class="card">
                                  <img src="${producto.imagenes}" class="card-img-top" alt="${producto.categorias.nombre_categoria}">
                                  <div class="card-body">
                                    <h5 class="card-title">${producto.nombre_producto}</h5>
                                    <p class="card-text">$${producto.precio}</p>
                                    <button class="btn btn-primary add-to-cart">Agregar al carrito</button>
                                  </div>
                                </div>
                              </div>
                  
                          ` 
                  }
              })
            


          } 

          else{ 

              productosFiltrados.forEach(producto => {  

                  listaProductos.innerHTML+=` 
                  <div class="col-md-3 product-card" data-category="tapados">
                        <div class="card">
                          <img src="${producto.imagenes}" class="card-img-top" alt="${producto.categorias.nombre_categoria}">
                          <div class="card-body">
                            <h5 class="card-title">${producto.nombre_producto}</h5>
                            <p class="card-text">$${producto.precio}</p>
                            <button class="btn btn-agregar btn-primary add-to-cart">Agregar al carrito</button>
                          </div>
                        </div>
                      </div>
              
                  ` 
               });

          }
        

      // Aquí puedes continuar con el código para mostrar las categorías activas
    });  

    
  


 function agregarBotonesAlCarrito(botones){ 
 

  botones.forEach((btn,index)=>{
    btn.addEventListener('click',async()=>{ 

      const productos= await obtenerProductosVenta() 

      let botonId=productos[index].producto_id 
      agregarProducto(botonId)


    })
  })

 } 

 let carritoStorage=localStorage.getItem('productos') 
 
 let carritoCompras=carritoStorage?JSON.parse(carritoStorage):[]


 async function agregarProducto(btnID){ 

  const productos= await obtenerProductosVenta() 

    
    let primerProducto=productos.find(id=>id.producto_id===btnID) 
    let primerProductoStorage=carritoCompras.find(id=>id.producto_id===btnID) 

     if(primerProductoStorage){
      primerProductoStorage.cantidad++
     }

     else{
      primerProducto.cantidad=1 
      primerProductoStorage=primerProducto
  
      carritoCompras.push({...primerProductoStorage})
     } 

     console.log('el carrito de compras',carritoCompras) 
     sumarCarrito(carritoCompras)

     localStorage.setItem('productos',JSON.stringify(carritoCompras))
 

 } 

 function sumarCarrito(carrito){


  let iconCart=document.getElementById("cart-count") 
  iconCart.innerHTML=carrito.reduce((acc,produc)=>acc+produc.cantidad,0) 


 } 







 