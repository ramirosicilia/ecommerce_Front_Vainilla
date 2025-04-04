
import { obtenerProductos } from "./api/productos.js";
import { obtenerCategorys} from "./api/productos.js"; 
import {desactivadoLogicoProductos} from "./registroProductos.js";
import { renderImages } from "./updateImages.js";




async function mostrarProductosAdmin() { 
  let productos = await obtenerProductos();  
  let categorias = await obtenerCategorys();  

  const selectCategorias = document.getElementById("categoria-select-products");  
  const tbody = document.querySelector("#cuerpo-productos");  

  
  
  console.log(selectCategorias); // Verifica si el elemento existe en la consola  

  let productosActivos = productos.filter(producto => producto?.activacion === true);  
  let categoriasFiltradas = categorias.filter(categorys => categorys?.activo === true);  

  let productosActivosFiltrados = productosActivos.filter(producto =>  
    categoriasFiltradas.some(categoria => categoria.categoria_id === producto.categoria_id)  
  );  

  console.log(selectCategorias);  

  // Limpiar y agregar solo una vez la lista de categorías  
  if (selectCategorias?.options.length <= 1) {  
    selectCategorias.innerHTML = `<option value="">Selecciona una categoría</option>`;  
    categoriasFiltradas.forEach(categoria => {  
        let option = document.createElement("option");  
        option.value = categoria.nombre_categoria;  
        option.textContent = categoria.nombre_categoria;  
        selectCategorias.appendChild(option);  
    });  
  }  
   if(tbody){ 
    if (productosActivosFiltrados.length > 0) {  
      tbody.innerHTML = ""; // Limpiar antes de renderizar nuevos productos  
  
      productosActivosFiltrados.forEach((producto) => {  
          let categoriaProducto = categoriasFiltradas.find(c => c.categoria_id === producto.categoria_id)?.nombre_categoria;  
    
        
  
          // Calcular stock sumando todas las variantes  
          let stockTotal = producto.productos_variantes?.reduce((acc, variante) => acc + (variante.stock || 0), 0) || 0;  
  
          // Obtener la primera imagen del array de imágenes  
          let imagenUrl = producto.imagenes[0]?.urls?.[0];  
  
          let talles = producto.productos_variantes
          .map(variante => variante.talles ? variante.talles.insertar_talle : null)  // Accedemos directamente a insertar_talle si es un objeto
          .filter(Boolean)
          .join(", ") || "N/A";
          
          let colores = producto.productos_variantes
              .map(variante => variante.colores ? variante.colores.insertar_color : null)  // Accedemos directamente a insertar_color si es un objeto
              .filter(Boolean)
              .join(", ") || "N/A"; 
  
              let talleIds = producto.productos_variantes
                .map(variante => variante.talles?.talle_id)
                .filter(Boolean)  // Filtra los valores no definidos o nulos
                .join(", ") || "N/A";
  
              let colorIds = producto.productos_variantes
                  .map(variante => variante.colores?.color_id)
                  .filter(Boolean)
                  .join(", ") || "N/A";
  
          
      
          tbody.innerHTML += `  
             
              <tr>    
                  <td>
                      <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
                  </td>
                  <td><div class="contenido-celda"><img src="${imagenUrl}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto}</div></td>
                  <td><div class="contenido-celda">$${producto.precio}</div></td>
                  <td><div class="contenido-celda">${categoriaProducto}</div></td>
                  <td><div class="contenido-celda">${stockTotal}</div></td>
                  <td><div class="contenido-celda">${talles}</div></td>
                  <td><div class="contenido-celda">${colores}</div></td>
                  <td class="celda-botones">
                      <button class="btn btn-primary btn-sm btn-editar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                      <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.producto_id}" data-talle-id="${talleIds}" data-color-id="${colorIds}"data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fas fa-trash"></i> Eliminar</button>
                  </td>
              </tr>
          `;  
      
      });   
  
      // Seleccionar los elementos de la tabla que contienen los ID de talles y colores
      
  
      const botonesEditar = [...document.querySelectorAll(".btn-editar")];  
      const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")];   
      const checkBox = [...document.querySelectorAll(".check")];  
      
  
      desactivadoLogicoProductos(checkBox);  
      activarBotones(botonesEditar, botonesEliminar);  
  
      return;
  }  
  else {  
        console.log("No hay productos activos para mostrar.");  
    }  

   }
  
}   




mostrarProductosAdmin();



//Update productos  

document.getElementById("openImageModal")?.addEventListener("click", function () {
  let myModal = new bootstrap.Modal(document.getElementById("imageModal-update-modal"));
  myModal.show(); 

});


export let productoID=null  

export function activarBotones(botonesEdit,botonesElim){ 

  botonesEdit.forEach((boton)=>{ 

    boton.addEventListener('click',async(e)=>{  
  
      
          productoID=boton.getAttribute("data-id")  
         let dataColorID=boton.getAttribute("data-color-id")
         let dataTalleID=boton.getAttribute("data-talle-id") 
    
       localStorage.setItem("id",JSON.stringify(productoID)) 
       localStorage.setItem("color-id",JSON.stringify(dataColorID))
       localStorage.setItem("talle-id",JSON.stringify(dataTalleID))
       
    
       
       // Llamar a renderImages con el ID del producto
              await renderImages();

    })

  })  

  botonesElim.forEach((boton)=>{ 

    boton.addEventListener('click',async(e)=>{  
      
      const productoID=boton.getAttribute("data-id")
      let dataColorID=boton.getAttribute("data-color-id")
      let dataTalleID=boton.getAttribute("data-talle-id") 
     await eliminarProductoSinVentas(productoID,dataColorID,dataTalleID)


    })

  })  

 }  

// Capturar cada input en una variable distinta

const formularioUpdate = document.getElementById("formulario-update-admin");
const actualizarNombre = document.getElementById("update-ProductName");
const actualizarPrecio = document.getElementById("update-ProductPrice");
const actualizarDescripcion = document.getElementById("updateDetailDescription");
const actualizarStock = document.getElementById("updateProductStock");
const actualizarTalle = document.getElementById("update-productSize");
const actualizarColor = document.getElementById("update-product-Colors");
const actualizarCategoria = document.getElementById("productCategory-update");
const actualizarNombreDetalle = document.getElementById("update-productNameDetail"); 



  async function actualizarEnvioUpdate(){  
  
  const selectCategorias = document.getElementById("productCategory-update"); 

  if(selectCategorias){
    selectCategorias.innerHTML = `<option value="">Selecciona una categoría</option>`;

    let categorias = await obtenerCategorys(); 
    console.log(categorias);
  
    categorias.forEach((categoria) => { 
      selectCategorias.innerHTML += `<option value="${categoria.nombre_categoria}">${categoria.nombre_categoria}</option>`;
    });
  }
  
  }    
  actualizarEnvioUpdate()   



  actualizarNombre?.addEventListener("click",async()=>{  
    const id = JSON.parse(localStorage.getItem("id"));
  
    await updateNombreProducto(id) 
   
   
    }) 
   
    actualizarPrecio?.addEventListener("click",async()=>{ 
      const id = JSON.parse(localStorage.getItem("id"));
     await updatePrecioProducto(id)
    }) 
   
     actualizarDescripcion?.addEventListener("click",async()=>{ 
      const id = JSON.parse(localStorage.getItem("id"));
      await updateDescripcionProducto(id)
      }) 
   
      actualizarStock?.addEventListener("click",async()=>{ 
        const id = JSON.parse(localStorage.getItem("id"));
      await updateStockProducto(id)
   
      })  
   
   
      actualizarColor?.addEventListener("click",async()=>{ 
        const colorID = JSON.parse(localStorage.getItem("color-id"));
       await updateColorProducto(colorID)
      })  
   
      actualizarTalle?.addEventListener("click",async()=>{ 
        const talleID = JSON.parse(localStorage.getItem("talle-id"));
       await updateTalleProducto(talleID)
      }) 
   
      actualizarNombreDetalle?.addEventListener("click",async()=>{ 
        const id = JSON.parse(localStorage.getItem("id"));
       await updateDetallesProducto(id)
       
      }) 
   
      actualizarCategoria?.addEventListener("change",async(e)=>{ 
        const id = JSON.parse(localStorage.getItem("id"));
       await updateCategoriaProducto(id,e.target.value)
   
      })

  async function updateNombreProducto(id,) {
    try {  
       const input= document.getElementById("productName-update")
      const nombre_producto = document.getElementById("productName-update").value.trim();

      if (nombre_producto === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/.test(nombre_producto) === false) {
  
        document.getElementById("error-nombre-update").textContent = 'El nombre del producto no puede contener números ni caracteres no permitidos.';
        return;
    }

        const response = await fetch(`http://localhost:1200/update-nombre-producto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_producto })
        });
    let data= await response.json(); 

       input.value="" 

        setTimeout(() => { 
          window.location.reload()
          
        },300); 

      localStorage.removeItem("id");
      localStorage.removeItem("color-id");
      localStorage.removeItem("talle-id");
     
      

    } catch (error) {
        console.error("Error al actualizar el nombre del producto:", error);
    } 

    
}

async function updatePrecioProducto(id) {
    try {  
      const input=document.getElementById("productPrice-update")
      const precio=document.getElementById("productPrice-update").value.trim(); 

      if(precio===""){ 
        
        document.getElementById("error-nombre-update").textContent = 'El precio tiene que ser un numero valido';
   
        return
      } 

        const response = await fetch(`http://localhost:1200/update-precio-producto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ precio })
        }); 

        let data= await response.json(); 
        input.value="" 

       setTimeout(() => { 
          window.location.reload()
          
        },300);  

        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id");
        
      
    } catch (error) {
        console.error("Error al actualizar el precio del producto:", error);
    }
}

async function updateDetallesProducto(id,) {
    try {   
       const input=document.getElementById("detailName-update")
      const detalles =document.getElementById("detailName-update").value.trim(); 

      if (detalles === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-]+$/.test(detalles) === false) {
        // Mostrar el mensaje de error en lugar de un alert
        document.getElementById("error-detalles-update").textContent = 'El detalle del producto no puede contener números ni caracteres no permitidos.';
        return;
    }
       
        const response = await fetch(`http://localhost:1200/update-producto-detalles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ detalles})
        }); 

        let data= await response.json(); 
        input.value="" 
        setTimeout(() => { 
                 window.location.reload()
                 
               },300); 

        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id");
      


      
    } catch (error) {
        console.error("Error al actualizar los detalles del producto:", error);
    }
}

async function updateCategoriaProducto(id,nombre_categoria) { 
   
   let select=document.getElementById("productCategory-update")
    try {
        const response = await fetch(`http://localhost:1200/update-producto-categoria/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre_categoria })
        }); 

        let data= await response.json(); 
         select.value=nombre_categoria

        setTimeout(() => { 
                 window.location.reload()
                 
               },300); 

         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id");
       


    } catch (error) {
        console.error("Error al actualizar la categoría del producto:", error);
    }
}

async function updateDescripcionProducto(id) { 

    try { 
       const input=document.getElementById("detailDescription-update")
      const descripcion = document.getElementById("detailDescription-update").value.trim();  

      if (descripcion === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-.,;:¡!¿?]+$/.test(descripcion) === false) {
        // Mostrar el mensaje de error en lugar de un alert
        document.getElementById("error-descripcion-update").textContent = 'La descripción no puede contener números ni caracteres no permitidos.';
        return;
    }

        const response = await fetch(`http://localhost:1200/update-precio-descripcion/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ descripcion })
        });

        let data= await response.json(); 
        input.value="" 

        setTimeout(() => { 
          window.location.reload()
          
        },300); 

        localStorage.removeItem("id");
        localStorage.removeItem("color-id");
        localStorage.removeItem("talle-id");

      
    } catch (error) {
        console.error("Error al actualizar la descripción del producto:", error);
    }
}

async function updateColorProducto(id) {  

  const input=document.getElementById("update-productColor")
  const insertar_color=document.getElementById("update-productColor").value.trim(); 

  if (insertar_color === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s\-#]+$/.test(insertar_color) === false) {
            // Mostrar el mensaje de error en lugar de un alert
            document.getElementById("error-color-update").textContent = 'El color no puede contener números ni caracteres no permitidos.';
            return;
        }

    try {
        const response = await fetch(`http://localhost:1200/update-color-producto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({insertar_color})
        }); 

        let data= await response.json(); 
        input.value="" 

        setTimeout(() => { 
                 window.location.reload()
                 
               },300); 
         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id");
        


    } catch (error) {
        console.error("Error al actualizar el color del producto:", error);
    }
}

async function updateTalleProducto(id,) {
    try {  
        
       const input=document.getElementById("update-productSizes")
       const insertar_talle=document.getElementById("update-productSizes").value.trim(); 

       if (insertar_talle === "" || /^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s\-]+$/.test(insertar_talle) === false) {
        // Mostrar el mensaje de error en lugar de un alert
        document.getElementById("error-talle-update").textContent = 'El talle no puede estar vacío ni contener caracteres no permitidos.';
        return;
    } 

        const response = await fetch(`http://localhost:1200/update-talle-producto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ insertar_talle})
        }); 

        let data= await response.json(); 
        input.value="" 

        setTimeout(() => { 
                 window.location.reload()
                 
               },300); 
         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id");


    } catch (error) {
        console.error("Error al actualizar el talle del producto:", error);
    }
}

async function updateStockProducto(id,) { 

     const input=document.getElementById("productStock-update")
     const stockInput=document.getElementById("productStock-update").value.trim(); 
     let stock=Number(stockInput) 

      if (stockInput === "" || !/^\d+$/.test(stockInput)) {
            // Mostrar el mensaje de error si el campo está vacío o no es un número entero
            document.getElementById("error-stock-update").textContent = 'El stock debe ser un número entero positivo.';
            return;
        }


    try {
        const response = await fetch(`http://localhost:1200/update-stock-producto/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock})
        }); 

         let data= await response.json(); 
         input.value="" 

         setTimeout(() => { 
                 window.location.reload()
                 
               },300); 
         localStorage.removeItem("id");
         localStorage.removeItem("color-id");
         localStorage.removeItem("talle-id");

    } catch (error) {
        console.error("Error al actualizar el stock del producto:", error);
    }
}

  function mostrarModal() {
    const modalElement = document.getElementById("confirmModal");
    const modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();
  }  


  const imageInput = document.getElementById("productImage"); 

  
console.log(imageInput)
const previewContainer = document.getElementById("imagePreview");

let imagenes = []; // Array para almacenar archivos seleccionados

// Evento para manejar la selección de imágenes
if(imageInput){ 
  imageInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    imagenes = [...imagenes, ...files]; // Agrega las nuevas imágenes al array existente

    previewContainer.innerHTML = ""; // Limpiar previsualización

    imagenes.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "100px";
            img.style.margin = "5px";

            // Botón para eliminar imagen seleccionada
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.style.marginLeft = "5px";
            removeBtn.onclick = () => {
                imagenes.splice(index, 1); // Eliminar del array
                updatePreview(); // Actualizar la vista
            };

            const imgWrapper = document.createElement("div");
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);

            previewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
});

}

// Función para actualizar la previsualización cuando se elimina una imagen
function updatePreview() {
    previewContainer.innerHTML = "";
    imagenes.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.width = "100px";
            img.style.margin = "5px";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "X";
            removeBtn.style.marginLeft = "5px";
            removeBtn.onclick = () => {
                imagenes.splice(index, 1);
                updatePreview();
            };

            const imgWrapper = document.createElement("div");
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(removeBtn);

            previewContainer.appendChild(imgWrapper);
        };
        reader.readAsDataURL(file);
    });
}   

  



export async function  eliminarProductoSinVentas(id,color_id,talle_id) {  
   
  mostrarModal()


 const botonConfirmacion=document.getElementById("boton-confirmacion-borrar") 
 console.log(botonConfirmacion)

     botonConfirmacion.addEventListener('click',async()=>{   
    

       console.log('se confirmooo el:', id)  

       try {  


        const response = await fetch(`http://localhost:1200/borrar-productos/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ color_id, talle_id })
        });
     
         console.log(response)
     
         if (!response.ok) {
           throw new Error("Error al enviar los datos");
         }
   
         Swal.fire({
           title: "Éxito",
           text: "Producto eliminado correctamente",
           icon: "success",
           confirmButtonText: "OK",
         }).then(() => {
           // Cerrar el modal después del mensaje de éxito
           const modalElement = document.getElementById("confirmModal");
           const modalInstance = bootstrap.Modal.getInstance(modalElement);
           modalInstance.hide();
         });

         setTimeout(() => { 
           window.location.reload()
           
         }, 2000);
   
 
          const datos=response.json() 
          console.log(datos.eliminado) 

          
   
    
       } catch (err) {
         Swal.fire({
           title: "Error",
           text: err.message,
           icon: "error",
           confirmButtonText: "Intenta de nuevo",
         });
       }  
   

     })

 
}