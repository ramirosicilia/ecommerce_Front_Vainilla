import { validarFormularioProducto, validarFormularioProductoUpdate } from "./validacionAdmin.js"; 


 
 export const pedirProductos=async()=>{ 

  try{ 

    const response= await fetch("http://localhost:1200/obtener-productos") 
    console.log(response)

    if(!response.ok){ 

      const dataErrror= await response.json() 
      throw new Error(dataErrror.error)

    } 

    else{
      const productosData= await response.json()  
      console.log(productosData)
      

      mostrarProductosAdmin(productosData) 
      return productosData
    } 

  } 


  catch(err){ 

    Swal.fire({
      title: '¡Error!',
      text: err.message, // Muestra el mensaje del backend
      icon: 'error',
      confirmButtonText: 'Intenta de nuevo',
  });

  }



}

pedirProductos()  


let categoriasUnicas = [];

function mostrarProductosAdmin(productos) {
  const tbody = document.getElementById("cuerpo-productos");
  const selectCategorias = document.getElementById("productCategory");

  // Limpiar contenido previo
  tbody.innerHTML = "";
  selectCategorias.innerHTML = "";

  console.log("Productos cargados:");

  // Recuperar categorías nuevas desde localStorage
  let categoriasLocales = JSON.parse(localStorage.getItem("category")) || [];
  console.log("Categorías desde localStorage:", categoriasLocales);

  // Crear un array para almacenar las categorías únicas y activas
 
   console.log(productos[0].activacion)
  // Filtrar productos con categorías activas
  let productosActivos = productos.filter(producto => producto.categorias?.activo === true);

  console.log("Productos activos:", productosActivos);

  // Agregar categorías activas de los productos
  productosActivos.forEach(producto => {
      if (!categoriasUnicas.includes(producto.categorias.nombre_categoria)) {
          categoriasUnicas.push(producto.categorias.nombre_categoria);
      }
  });

  // Filtrar y agregar categorías activas desde localStorage
  categoriasLocales.forEach(categoriaNueva => {
      if (categoriaNueva.activo === true && !categoriasUnicas.includes(categoriaNueva.categoria)) {
          categoriasUnicas.push(categoriaNueva.categoria);
      }
  });

  console.log("Categorías activas:", categoriasUnicas); 



  // Agregar las categorías activas al selector
  selectCategorias.innerHTML += `<option value="">Selecciona una categoría</option>`;
  categoriasUnicas.forEach(categoria => {
      selectCategorias.innerHTML += `<option value="${categoria}">${categoria}</option>`;
  });

  // Mostrar productos activos en la tabla
  if (productosActivos.length > 0) {
    productosActivos.forEach(producto => {
      tbody.innerHTML += `
          <tr>    
              <td>
                  <input type="checkbox" class="form-check-input pause-checkbox check" data-id="${producto.producto_id}">
              </td>
              <td><div class="contenido-celda"><img src="${producto.imagenes}" alt="Producto" style="max-width: 50px;"> ${producto.nombre_producto}</div></td>
              <td><div class="contenido-celda">${producto.precio}</div></td>
              <td><div class="contenido-celda">${producto.categorias.nombre_categoria}</div></td>
              <td><div class="contenido-celda">${producto.stock}</div></td>
              <td class="celda-botones">
                  <button class="btn btn-primary btn-sm btn-editar" data-bs-toggle="modal" data-bs-target="#editProductModal"><i class="fas fa-edit"></i> Editar</button>
                  <button class="btn btn-danger btn-sm btn-eliminar" data-bs-toggle="modal" data-bs-target="#confirmModal"><i class="fas fa-trash"></i> Eliminar</button>
              </td>
          </tr>
      `;
  });
  
  


      // Actualizar botones de editar y eliminar
      const botonesEditar = [...document.querySelectorAll(".btn-editar")];
      const botonesEliminar = [...document.querySelectorAll(".btn-eliminar")]; 
      const checkBox=[...document.querySelectorAll(".check")] 



      activarBotones(botonesEditar,botonesEliminar);  

      desactivadoLogicoProductos(checkBox)
  

  } else {
      console.log("No hay productos activos para mostrar.");
  }
}



//Formulario Actualizacion 

const formulario = document.getElementById("formulario-producto");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(formulario);

  if (!validarFormularioProducto()) {
    return; // Detener si hay errores
  }

  try { 

     console.log(formData)  

    


    const response = await fetch("http://localhost:1200/subir-productos", {
      method: "POST",
      body: formData,
    }); 

    console.log(response)

    if (!response.ok) {
      throw new Error("Error al enviar los datos");
    }

    Swal.fire({
      title: "Éxito",
      text: "Producto guardado correctamente",
      icon: "success",
      confirmButtonText: "OK",
    });
    formulario.reset(); 
    setTimeout(() => { 
      window.location.reload()
      
    }, 2000);



  } catch (err) {
    Swal.fire({
      title: "Error",
      text: err.message,
      icon: "error",
      confirmButtonText: "Intenta de nuevo",
    });
  }  

 
 
}); 

  export function activarBotones(botonesEdit,botonesElim){ 

    botonesEdit.forEach((boton,index)=>{ 

      boton.addEventListener('click',async()=>{  

        const productos= await pedirProductos() 

        const productoID=productos[index].producto_id 

         actualizarEnvioUpdate(productoID)


      })

    })  


    botonesElim.forEach((boton,index)=>{ 

      boton.addEventListener('click',async()=>{  

        const productos= await pedirProductos() 

        const productoID=productos[index]?.producto_id 

        eliminarProductoSinVentas(productoID)


      })

    })  

   } 


   // Desactivar productos lógicamente
  export function desactivadoLogicoProductos(check) {
    const estadosGuardados = JSON.parse(localStorage.getItem("productosEstado")) || {};
  
    check.forEach((ck) => {
      const dataID = ck.getAttribute("data-id");
      const filaProducto = ck.closest("tr");
      const celdasContenido = filaProducto.querySelectorAll(".contenido-celda");
      const botonesAccion = filaProducto.querySelectorAll(".btn-editar, .btn-eliminar");
  
      // Restaurar estado desde localStorage
      if (estadosGuardados[dataID] === "desactivado") {
        ck.checked = true;
        filaProducto.classList.add("desactivado");
        celdasContenido.forEach((celda) => (celda.style.opacity = "0.4"));
        botonesAccion.forEach((boton) => (boton.style.opacity = "1")); // Botones sin opacidad
      } else {
        ck.checked = false;
        filaProducto.classList.remove("desactivado");
        celdasContenido.forEach((celda) => (celda.style.opacity = "1"));
      }
  
      ck.addEventListener("change", async (e) => {
        const desactivado = e.target.checked;
  
        try {
          const response = await fetch(`http://localhost:1200/desactivar-productos/${dataID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: !desactivado }),
          });
  
          if (!response.ok) throw new Error("Error al actualizar el producto");
  
          if (desactivado) {
            filaProducto.classList.add("desactivado");
            celdasContenido.forEach((celda) => (celda.style.opacity = "0.4"));
            botonesAccion.forEach((boton) => (boton.style.opacity = desactivado ? "0.4" : "1"));

            estadosGuardados[dataID] = "desactivado";
          } else {
            filaProducto.classList.remove("desactivado");
            celdasContenido.forEach((celda) => (celda.style.opacity = "1"));
            delete estadosGuardados[dataID];
          }
  
          localStorage.setItem("productosEstado", JSON.stringify(estadosGuardados));
  
          Swal.fire({
            title: desactivado
              ? "Producto desactivado correctamente"
              : "Producto activado correctamente",
            icon: "success",
            confirmButtonText: "Entendido",
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar el estado del producto.",
            icon: "error",
            confirmButtonText: "Intentar nuevamente",
          });
          e.target.checked = !desactivado; // Restaurar estado visual
        }
      });
    });
  }
  


  const formularioUpdate = document.getElementById("formulario-producto-update"); 
 console.log(formularioUpdate) 

    

 function actualizarEnvioUpdate(id){ 
 

  const selectCategorias = document.getElementById("productCategory-update");

       categoriasUnicas.forEach((categoria) => { 
     
           selectCategorias.innerHTML += `<option value="${categoria}">${categoria}</option>`;
       });
       console.log(categoriasUnicas)


  formularioUpdate.addEventListener("submit", async (e) => {
    e.preventDefault(); 
  
      
  
    const formData = new FormData(formularioUpdate); 
  

    console.log(validarFormularioProductoUpdate())
  
    if (!validarFormularioProductoUpdate()) {
      return; // Detener si hay errores
    }
   
    try {  


      const response = await fetch(`http://localhost:1200/actualizar-productos/${id}`, {
        method: "PUT",
        body: formData,
      }); 
  
      console.log(response)
  
      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }
  
      Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });


  
       const datos=response.json() 
       console.log(datos.data) 

       

      formulario.reset(); 
      setTimeout(() => { 
        window.location.reload()
        
      }, 2000);

    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
        confirmButtonText: "Intenta de nuevo",
      });
    }  
  
   
   
  });

 } 


 async function  eliminarProductoSinVentas(id) { 
  const botonConfirmacion=document.getElementById("boton-confirmacion")


    
      botonConfirmacion.addEventListener('click',async()=>{ 

        console.log('se confirmooo el:', id)  

        try {  


          const response = await fetch(`http://localhost:1200/borrar-productos/${id}`, {
            method: "DELETE",
         
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










